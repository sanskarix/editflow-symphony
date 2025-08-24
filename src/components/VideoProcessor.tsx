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
  const [downloadExtension, setDownloadExtension] = useState<string>('mp4');
  const [actualExtension, setActualExtension] = useState<string>('webm');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const processVideo = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsProcessing(true);
    setProgress(0);
    setDownloadExtension('mp4'); // Reset to default
    setActualExtension('webm'); // Reset to default
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let wasOriginallyMuted = true; // Default value

    try {
      // Wait for video metadata to load
      await new Promise((resolve) => {
        if (video.readyState >= 1) {
          resolve(undefined);
        } else {
          video.addEventListener('loadedmetadata', () => resolve(undefined), { once: true });
        }
      });

      // Set canvas dimensions to match video exactly (preserving aspect ratio)
      canvas.width = video.videoWidth || 1920;
      canvas.height = video.videoHeight || 1080;

      // Set canvas style for high DPI displays
      canvas.style.width = `${canvas.width}px`;
      canvas.style.height = `${canvas.height}px`;

      console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);
      console.log('Video dimensions:', video.videoWidth, 'x', video.videoHeight);

      // Calculate smart encoding settings based on input video
      const inputFileSizeMB = videoFile.size / (1024 * 1024);
      const videoDuration = video.duration;
      const videoResolution = video.videoWidth * video.videoHeight;
      const originalBitrate = (videoFile.size * 8) / videoDuration / 1000; // kbps

      console.log('Input video analysis:');
      console.log('- File size:', inputFileSizeMB.toFixed(2), 'MB');
      console.log('- Duration:', videoDuration.toFixed(2), 's');
      console.log('- Resolution:', video.videoWidth + 'x' + video.videoHeight);
      console.log('- Estimated original bitrate:', originalBitrate.toFixed(0), 'kbps');

      // Temporarily unmute video for audio processing
      wasOriginallyMuted = video.muted;
      video.muted = false;
      video.volume = 1.0; // Full volume for proper audio capture

      // Close existing audio context if any
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        await audioContextRef.current.close();
      }

      // Create audio context and get audio stream from video
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      // Resume audio context if suspended (required for some browsers)
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      // Check if video element is already connected to an audio context
      let source;
      try {
        source = audioContext.createMediaElementSource(video);
      } catch (error) {
        if (error.name === 'InvalidStateError') {
          console.warn('Video element already connected to an AudioContext. Creating new video element...');
          // Create a clone of the video for audio processing
          const newVideo = document.createElement('video');
          newVideo.src = video.src;
          newVideo.muted = false;
          newVideo.volume = 1.0;
          newVideo.currentTime = video.currentTime;
          newVideo.playbackRate = video.playbackRate;

          // Wait for the new video to be ready
          await new Promise((resolve) => {
            newVideo.addEventListener('loadedmetadata', resolve, { once: true });
            newVideo.load();
          });

          source = audioContext.createMediaElementSource(newVideo);

          // Sync the new video with the original
          video.addEventListener('timeupdate', () => {
            if (Math.abs(newVideo.currentTime - video.currentTime) > 0.1) {
              newVideo.currentTime = video.currentTime;
            }
          });
        } else {
          throw error;
        }
      }

      const destination = audioContext.createMediaStreamDestination();

      // Connect audio properly
      source.connect(destination);

      // Calculate smart bitrates to avoid file bloat
      // Use 1.2x original bitrate or reasonable defaults based on resolution
      let targetVideoBitrateKbps;
      if (videoResolution <= 640 * 480) {
        // SD: 1-2 Mbps
        targetVideoBitrateKbps = Math.min(originalBitrate * 1.2, 2000);
      } else if (videoResolution <= 1280 * 720) {
        // HD: 2-4 Mbps
        targetVideoBitrateKbps = Math.min(originalBitrate * 1.2, 4000);
      } else if (videoResolution <= 1920 * 1080) {
        // Full HD: 4-6 Mbps
        targetVideoBitrateKbps = Math.min(originalBitrate * 1.2, 6000);
      } else {
        // 4K+: 8-12 Mbps
        targetVideoBitrateKbps = Math.min(originalBitrate * 1.2, 12000);
      }

      // Ensure minimum quality
      targetVideoBitrateKbps = Math.max(targetVideoBitrateKbps, 1000); // At least 1 Mbps

      // Check for MP4 support, but use WebM with MP4 download name
      let mimeType = 'video/webm;codecs=vp9,opus';
      let currentActualExtension = 'webm';
      let currentDownloadExtension = 'mp4';
      let videoBitsPerSecond = targetVideoBitrateKbps * 1000; // Convert to bps

      // Use original frame rate or cap at 30fps to avoid bloat
      const originalFrameRate = 30; // Default fallback
      const targetFrameRate = Math.min(originalFrameRate, 30);

      // Combine video and audio streams with optimized quality
      const videoStream = canvas.captureStream(targetFrameRate);
      const audioTracks = destination.stream.getAudioTracks();

      console.log('Audio tracks found:', audioTracks.length);
      console.log('Video tracks found:', videoStream.getVideoTracks().length);

      // Log quality settings
      console.log('Optimized recording settings:');
      console.log('- MIME type:', mimeType);
      console.log('- Video bitrate:', (videoBitsPerSecond/1000).toFixed(0), 'kbps');
      console.log('- Audio bitrate: 128 kbps');
      console.log('- Frame rate:', targetFrameRate, 'fps');
      console.log('- Expected output size: ~', ((videoBitsPerSecond + 128000) * videoDuration / 8 / 1024 / 1024).toFixed(1), 'MB');

      // Create combined stream with both video and audio
      const combinedStream = new MediaStream([
        ...videoStream.getVideoTracks(),
        ...audioTracks
      ]);

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
          currentActualExtension = 'mp4';
          break;
        }
      }

      if (supportedMimeType) {
        mimeType = supportedMimeType;
        // Keep the calculated smart bitrate for MP4
        console.log('Using MP4 encoding with smart bitrate');
      } else {
        // Use WebM with same smart bitrate
        mimeType = 'video/webm;codecs=vp9,opus';
        console.log('MP4 not supported, using WebM with smart bitrate and MP4 filename');
      }

      const mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType: mimeType,
        videoBitsPerSecond: videoBitsPerSecond,
        audioBitsPerSecond: 128000, // Optimized audio quality
        bitsPerSecond: videoBitsPerSecond + 128000, // Total bitrate
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
        // Store extension information in state
        setActualExtension(currentActualExtension);
        setDownloadExtension(currentDownloadExtension);
        onProcessingComplete(url);
        setIsProcessing(false);
        setProgress(100);

        // Restore original muted state
        video.muted = wasOriginallyMuted;
        video.volume = 1.0;

        // Clean up audio context
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
          audioContextRef.current.close();
          audioContextRef.current = null;
        }
        toast.success('Video processing completed successfully!');
      };

      // Set playback speed if speed boost is enabled
      const playbackRate = effects.speedBoost ? 1.1 : 1.0;
      video.playbackRate = playbackRate;

      // Create audio processing chain
      const gainNode = audioContext.createGain();
      gainNode.gain.value = 1.0; // Full audio level

      // Simple direct connection for better compatibility
      source.connect(gainNode);
      gainNode.connect(destination);

      // Verify audio tracks are properly connected
      setTimeout(() => {
        const tracks = destination.stream.getAudioTracks();
        console.log('Final audio tracks:', tracks.length, tracks.map(t => t.enabled));
      }, 100);

      // Start recording with error handling
      try {
        mediaRecorder.start(100); // Request data every 100ms for smoother recording
        console.log('MediaRecorder started successfully');
      } catch (err) {
        console.error('Failed to start MediaRecorder:', err);
        throw new Error('Failed to start video recording');
      }

      // Reset video to start
      video.currentTime = 0;
      
      // Animation loop variables
      let frameCount = 0;
      const maxFrames = Math.floor(video.duration * targetFrameRate); // Use actual target frame rate
      
      const processFrame = () => {
        if (video.ended) {
          mediaRecorder.stop();
          return;
        }

        // Clear canvas and draw video frame with maximum quality settings
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Disable smoothing for pixel-perfect rendering (unless effects require it)
        ctx.imageSmoothingEnabled = false; // Preserve original pixels

        // Save context state for effects
        ctx.save();

        // Apply brightness and saturation effect
        if (effects.brightnessBoost) {
          ctx.filter = 'brightness(1.2) saturate(1.15) contrast(1.05)';
          ctx.imageSmoothingEnabled = true; // Enable smoothing only for filters
          ctx.imageSmoothingQuality = 'high';
        }

        // Draw video frame at exact dimensions
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Restore context state
        ctx.restore();

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

      // Restore video state on error
      if (video) {
        video.muted = wasOriginallyMuted;
        video.volume = 1.0;
      }

      // Clean up audio context on error
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    }
  }, [videoFile, effects, onProcessingComplete, isProcessing]);

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;

      // Set up video element for optimal audio/video capture
      video.muted = false;
      video.volume = 1.0;
      video.preload = 'auto'; // Load entire video for better processing
      video.crossOrigin = 'anonymous';
      video.playsInline = true;

      // Create object URL and load
      const objectUrl = URL.createObjectURL(videoFile);
      video.src = objectUrl;
      video.load();

      // Cleanup object URL when component unmounts
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }
  }, [videoFile]);

  // Cleanup audio context on component unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  const downloadVideo = () => {
    if (processedVideoUrl) {
      const a = document.createElement('a');
      a.href = processedVideoUrl;
      // Get original filename without extension and add _processed suffix
      const originalName = videoFile.name.replace(/\.[^/.]+$/, '');
      const extension = downloadExtension;
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
