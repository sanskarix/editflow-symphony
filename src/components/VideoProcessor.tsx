import { useState, useRef, useEffect, useCallback } from 'react';
import { Download, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { VideoEffects } from './EffectsPanel';
import { toast } from 'sonner';

interface VideoProcessorProps {
  videoFile: File;
  effects: VideoEffects;
  onProcessingComplete: (processedVideoUrl: string) => void;
}

export const VideoProcessor = ({ videoFile, effects, onProcessingComplete }: VideoProcessorProps) => {
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedVideoUrl, setProcessedVideoUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const processVideo = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsProcessing(true);
    setProgress(0);
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      // Wait for video metadata to load
      await new Promise((resolve) => {
        if (video.readyState >= 1) {
          resolve(undefined);
        } else {
          video.addEventListener('loadedmetadata', () => resolve(undefined), { once: true });
        }
      });

      // Set canvas dimensions to match video (preserving aspect ratio)
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Create audio context and get audio stream from video
      const audioContext = new AudioContext();
      const source = audioContext.createMediaElementSource(video);
      const destination = audioContext.createMediaStreamDestination();
      source.connect(destination);
      source.connect(audioContext.destination);

      // Combine video and audio streams
      const videoStream = canvas.captureStream(30);
      const audioTracks = destination.stream.getAudioTracks();
      
      // Create combined stream with both video and audio
      const combinedStream = new MediaStream([
        ...videoStream.getVideoTracks(),
        ...audioTracks
      ]);

      // Try MP4 first, fallback to WebM if not supported
      let mimeType = 'video/mp4;codecs=h264,aac';
      let fileExtension = 'mp4';
      
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm;codecs=vp9,opus';
        fileExtension = 'webm';
      }

      const mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType: mimeType,
        videoBitsPerSecond: 8000000, // 8Mbps for high quality
      });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setProcessedVideoUrl(url);
        // Store file extension for download
        (url as any).fileExtension = fileExtension;
        onProcessingComplete(url);
        setIsProcessing(false);
        setProgress(100);
        audioContext.close(); // Clean up audio context
        toast.success('Video processing completed successfully!');
      };

      // Set playback speed if speed boost is enabled
      if (effects.speedBoost) {
        video.playbackRate = 1.1;
      } else {
        video.playbackRate = 1.0;
      }

      // Start recording
      mediaRecorder.start();

      // Reset video to start
      video.currentTime = 0;
      
      // Animation loop variables
      let frameCount = 0;
      const maxFrames = Math.floor(video.duration * 30); // Estimate frames
      
      const processFrame = () => {
        if (video.ended) {
          mediaRecorder.stop();
          return;
        }

        // Clear canvas and draw video frame (maintains aspect ratio)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Apply brightness and saturation effect (optimized for better performance)
        if (effects.brightnessBoost) {
          ctx.filter = 'brightness(1.1) saturate(1.1)';
        }
        
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Reset filter after drawing
        if (effects.brightnessBoost) {
          ctx.filter = 'none';
        }

        // Add line overlay effect
        if (effects.lineOverlay) {
          const gradient = ctx.createLinearGradient(0, canvas.height / 2 - 1, 0, canvas.height / 2 + 1);
          gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
          gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          
          ctx.fillStyle = gradient;
          ctx.fillRect(0, canvas.height / 2 - 1, canvas.width, 2);
        }

        // Add lens flare effect
        if (effects.lensFlare) {
          const time = frameCount / 30; // Convert to seconds
          // Horizontal movement - left to right and back with smooth oscillation
          const flareX = (Math.sin(time * 0.4) * 0.5 + 0.5) * canvas.width;
          const flareY = canvas.height * 0.4; // Keep it in upper portion
          
          // Larger, more subtle lens flare
          const flareRadius = Math.min(canvas.width, canvas.height) * 0.4;
          const flareGradient = ctx.createRadialGradient(flareX, flareY, 0, flareX, flareY, flareRadius);
          flareGradient.addColorStop(0, 'rgba(255, 255, 255, 0.5)');  // 50% opacity center
          flareGradient.addColorStop(0.2, 'rgba(255, 220, 150, 0.3)'); // Warm tone
          flareGradient.addColorStop(0.5, 'rgba(255, 200, 100, 0.1)'); // Subtle outer glow
          flareGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          
          ctx.globalCompositeOperation = 'screen'; // Blend mode for realistic flare
          ctx.fillStyle = flareGradient;
          ctx.fillRect(flareX - flareRadius, flareY - flareRadius, flareRadius * 2, flareRadius * 2);
          ctx.globalCompositeOperation = 'source-over'; // Reset blend mode
        }

        frameCount++;
        const progressPercent = Math.min((frameCount / maxFrames) * 100, 95);
        setProgress(progressPercent);

        requestAnimationFrame(processFrame);
      };

      // Start video playback and processing
      await video.play();
      processFrame();

    } catch (error) {
      console.error('Video processing error:', error);
      toast.error('Error processing video. Please try again.');
      setIsProcessing(false);
    }
  }, [videoFile, effects, onProcessingComplete, isProcessing]);

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      video.src = URL.createObjectURL(videoFile);
      video.load();
    }
  }, [videoFile]);

  const downloadVideo = () => {
    if (processedVideoUrl) {
      const a = document.createElement('a');
      a.href = processedVideoUrl;
      // Get original filename without extension and add _processed suffix
      const originalName = videoFile.name.replace(/\.[^/.]+$/, '');
      const extension = (processedVideoUrl as any).fileExtension || 'webm';
      a.download = `${originalName}_processed.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success('Download started! Check your downloads folder.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Video Processing
        </h2>
        <p className="text-muted-foreground">
          {isProcessing ? 'Processing your video with selected effects...' : 
           processedVideoUrl ? 'Processing complete!' : 'Ready to process'}
        </p>
      </div>

      {/* Hidden video and canvas elements for processing */}
      <div className="hidden">
        <video ref={videoRef} muted />
        <canvas ref={canvasRef} />
      </div>

      {/* Processing UI */}
      <div className="glass-strong rounded-xl p-8 border border-glass-border">
        <div className="flex items-center justify-center mb-6">
          {isProcessing ? (
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          ) : processedVideoUrl ? (
            <CheckCircle className="w-8 h-8 text-green-400" />
          ) : (
            <div className="w-8 h-8 bg-gradient-primary rounded-full" />
          )}
        </div>

        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Progress: {Math.round(progress)}%
            </p>
            <Progress value={progress} className="w-full" />
          </div>

          <div className="flex justify-center gap-4">
            {!isProcessing && !processedVideoUrl && (
              <Button 
                variant="hero" 
                size="lg"
                onClick={processVideo}
              >
                Start Processing
              </Button>
            )}

            {processedVideoUrl && (
              <Button 
                variant="accent" 
                size="lg"
                onClick={downloadVideo}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Download Processed Video
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};