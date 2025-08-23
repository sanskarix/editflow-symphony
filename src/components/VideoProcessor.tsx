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
      // Set canvas dimensions to match video
      video.addEventListener('loadedmetadata', () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      });

      // Create MediaRecorder for output
      const stream = canvas.captureStream(30);
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
      });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setProcessedVideoUrl(url);
        onProcessingComplete(url);
        setIsProcessing(false);
        setProgress(100);
        toast.success('Video processing completed!');
      };

      // Start recording
      mediaRecorder.start();

      // Set playback speed if speed boost is enabled
      if (effects.speedBoost) {
        video.playbackRate = 1.2;
      }

      // Animation loop for processing effects
      let frameCount = 0;
      const maxFrames = Math.floor(video.duration * 30); // Estimate frames

      const processFrame = () => {
        if (video.ended || !isProcessing) {
          mediaRecorder.stop();
          return;
        }

        // Draw video frame
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Apply brightness and saturation effect
        if (effects.brightnessBoost) {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          for (let i = 0; i < data.length; i += 4) {
            // Increase brightness and saturation
            data[i] = Math.min(255, data[i] * 1.1);     // Red
            data[i + 1] = Math.min(255, data[i + 1] * 1.1); // Green  
            data[i + 2] = Math.min(255, data[i + 2] * 1.1); // Blue
          }
          
          ctx.putImageData(imageData, 0, 0);
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
          const flareX = (Math.sin(time * 0.5) + 1) * canvas.width / 2;
          const flareY = (Math.cos(time * 0.3) + 1) * canvas.height / 2;
          
          const flareGradient = ctx.createRadialGradient(flareX, flareY, 0, flareX, flareY, 100);
          flareGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
          flareGradient.addColorStop(0.3, 'rgba(255, 200, 100, 0.4)');
          flareGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          
          ctx.fillStyle = flareGradient;
          ctx.fillRect(flareX - 100, flareY - 100, 200, 200);
        }

        frameCount++;
        const progressPercent = Math.min((frameCount / maxFrames) * 100, 95);
        setProgress(progressPercent);

        requestAnimationFrame(processFrame);
      };

      // Start video playback and processing
      video.currentTime = 0;
      video.play();
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
      a.download = `processed_${videoFile.name.replace(/\.[^/.]+$/, '')}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success('Download started!');
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