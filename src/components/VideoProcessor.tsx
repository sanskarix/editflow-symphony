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

      // Temporarily unmute video for audio processing
      const wasOriginallyMuted = video.muted;
      video.muted = false;
      video.volume = 0.01; // Very low volume to avoid audio feedback

      // Create audio context and get audio stream from video
      const audioContext = new AudioContext();

      // Resume audio context if suspended (required for some browsers)
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      const source = audioContext.createMediaElementSource(video);
      const destination = audioContext.createMediaStreamDestination();

      // Connect audio properly
      source.connect(destination);

      // Combine video and audio streams
      const videoStream = canvas.captureStream(30);
      const audioTracks = destination.stream.getAudioTracks();
      
      // Create combined stream with both video and audio
      const combinedStream = new MediaStream([
        ...videoStream.getVideoTracks(),
        ...audioTracks
      ]);

      // Check for MP4 support, but use WebM with MP4 download name
      let mimeType = 'video/webm;codecs=vp9,opus';
      let actualExtension = 'webm';
      let downloadExtension = 'mp4'; // Always download as MP4 name
      let videoBitsPerSecond = 15000000; // 15Mbps for highest quality

      // Try MP4 first (though most browsers don't support it)
      const mp4Options = [
        'video/mp4;codecs=h264,aac',
        'video/mp4;codecs=avc1.640028,mp4a.40.2',
        'video/mp4'
      ];

      let supportedMimeType = null;
      for (const option of mp4Options) {
        if (MediaRecorder.isTypeSupported(option)) {
          supportedMimeType = option;
          actualExtension = 'mp4';
          break;
        }
      }

      if (supportedMimeType) {
        mimeType = supportedMimeType;
        videoBitsPerSecond = 12000000; // 12Mbps for MP4
      } else {
        // Use high-quality WebM but name it as MP4 for download
        console.log('MP4 not supported, using WebM with MP4 filename');
      }

      const mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType: mimeType,
        videoBitsPerSecond: videoBitsPerSecond,
        audioBitsPerSecond: 320000, // High quality audio
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
        // Store both actual and download extensions
        (url as any).actualExtension = actualExtension;
        (url as any).downloadExtension = downloadExtension;
        onProcessingComplete(url);
        setIsProcessing(false);
        setProgress(100);

        // Restore original muted state
        video.muted = wasOriginallyMuted;
        video.volume = 1.0;

        audioContext.close(); // Clean up audio context
        toast.success('Video processing completed successfully!');
      };

      // Set playback speed if speed boost is enabled
      const playbackRate = effects.speedBoost ? 1.1 : 1.0;
      video.playbackRate = playbackRate;

      // Create gain node for audio processing
      const gainNode = audioContext.createGain();
      const analyser = audioContext.createAnalyser();

      // Reconnect audio with proper routing
      source.disconnect();
      source.connect(gainNode);
      gainNode.connect(analyser);
      analyser.connect(destination);

      // Adjust audio playback rate if speed boost is enabled
      if (effects.speedBoost) {
        // Note: Changing playback rate affects both video and audio automatically
        gainNode.gain.value = 1.0; // Maintain audio level
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

        // Clear canvas and draw video frame with high quality settings
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Set high quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Apply brightness and saturation effect
        if (effects.brightnessBoost) {
          ctx.filter = 'brightness(1.2) saturate(1.15) contrast(1.05)';
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Reset filter after drawing
        if (effects.brightnessBoost) {
          ctx.filter = 'none';
        }

        // Add line overlay effect (doubled thickness)
        if (effects.lineOverlay) {
          const gradient = ctx.createLinearGradient(0, canvas.height / 2 - 2, 0, canvas.height / 2 + 2);
          gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
          gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

          ctx.fillStyle = gradient;
          ctx.fillRect(0, canvas.height / 2 - 2, canvas.width, 4);
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
      video.muted = false; // Ensure audio is not muted for processing
      video.volume = 1.0; // Set full volume
      video.preload = 'metadata';
      video.crossOrigin = 'anonymous';
      video.load();
    }
  }, [videoFile]);

  const downloadVideo = () => {
    if (processedVideoUrl) {
      const a = document.createElement('a');
      a.href = processedVideoUrl;
      // Get original filename without extension and add _processed suffix
      const originalName = videoFile.name.replace(/\.[^/.]+$/, '');
      const extension = (processedVideoUrl as any).downloadExtension || 'mp4';
      a.download = `${originalName}_processed.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success(`Download started! Saved as ${originalName}_processed.${extension}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {isProcessing ? '🎬 Processing Your Video' : processedVideoUrl ? '✨ Processing Complete!' : '🚀 Ready to Process'}
        </h2>
        <p className="text-muted-foreground">
          {isProcessing ? 'Applying effects and enhancing quality...' :
           processedVideoUrl ? 'Your enhanced video is ready for download!' : 'Click start to begin processing'}
        </p>
      </div>

      {/* Hidden video and canvas elements for processing */}
      <div className="hidden">
        <video ref={videoRef} muted />
        <canvas ref={canvasRef} />
      </div>

      {/* Processing UI */}
      <div className={`glass-strong rounded-xl p-8 border transition-all duration-500 ${
        isProcessing ? 'border-primary shadow-glow animate-pulse' :
        processedVideoUrl ? 'border-green-400 shadow-accent' : 'border-glass-border'
      }`}>
        <div className="flex items-center justify-center mb-6">
          {isProcessing ? (
            <div className="relative">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <div className="absolute inset-0 w-12 h-12 border-2 border-primary/20 rounded-full animate-ping" />
            </div>
          ) : processedVideoUrl ? (
            <div className="relative">
              <CheckCircle className="w-12 h-12 text-green-400 animate-bounce" />
              <div className="absolute inset-0 w-12 h-12 border-2 border-green-400/20 rounded-full animate-ping" />
            </div>
          ) : (
            <div className="w-12 h-12 bg-gradient-primary rounded-full animate-pulse" />
          )}
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <p className={`text-sm mb-2 transition-colors duration-300 ${
              isProcessing ? 'text-primary font-medium' : 'text-muted-foreground'
            }`}>
              {isProcessing ? `Processing... ${Math.round(progress)}%` :
               processedVideoUrl ? 'Ready for download!' : 'Waiting to start...'}
            </p>
            <Progress value={progress} className={`w-full transition-all duration-300 ${
              isProcessing ? 'scale-105' : ''
            }`} />
            {isProcessing && (
              <p className="text-xs text-muted-foreground mt-2 animate-pulse">
                This may take a few moments depending on video length
              </p>
            )}
          </div>

          <div className="flex justify-center gap-4">
            {!isProcessing && !processedVideoUrl && (
              <Button
                variant="hero"
                size="lg"
                onClick={processVideo}
                className="transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-glow"
              >
                🎬 Start Processing
              </Button>
            )}

            {processedVideoUrl && (
              <Button
                variant="accent"
                size="lg"
                onClick={downloadVideo}
                className="gap-2 transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-accent animate-bounce"
              >
                <Download className="w-4 h-4" />
                📥 Download Enhanced Video
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
