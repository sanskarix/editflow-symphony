import { useState, useRef, useEffect, useCallback } from 'react';
import { Download, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { VideoEffects } from './EffectsPanel';
import { toast } from 'sonner';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

interface VideoProcessorProps {
  videoFile: File;
  effects: VideoEffects;
  onProcessingComplete: (processedVideoUrl: string) => void;
}

export const VideoProcessor = ({
  videoFile,
  effects,
  onProcessingComplete,
}: VideoProcessorProps) => {
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedVideoUrl, setProcessedVideoUrl] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [mp4Url, setMp4Url] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const ffmpeg = useRef(createFFmpeg({ log: true }));

  const processVideo = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsProcessing(true);
    setProgress(0);
    setMp4Url(null); // Clear previous MP4 url if any

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      // Wait for video metadata to load
      await new Promise<void>((resolve) => {
        if (video.readyState >= 1) {
          resolve();
        } else {
          video.addEventListener('loadedmetadata', () => resolve(), { once: true });
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
        ...audioTracks,
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
        (url as any).fileExtension = fileExtension;
        onProcessingComplete(url);
        setIsProcessing(false);
        setProgress(100);
        audioContext.close();
        toast.success('Video processing completed successfully!');
      };

      if (effects.speedBoost) {
        video.playbackRate = 1.1;
      } else {
        video.playbackRate = 1.0;
      }

      mediaRecorder.start();
      video.currentTime = 0;

      let frameCount = 0;
      const maxFrames = Math.floor(video.duration * 30);

      const processFrame = () => {
        if (video.ended) {
          mediaRecorder.stop();
          return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (effects.brightnessBoost) {
          ctx.filter = 'brightness(1.1) saturate(1.1)';
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        if (effects.brightnessBoost) {
          ctx.filter = 'none';
        }

        if (effects.lineOverlay) {
          const gradient = ctx.createLinearGradient(
            0,
            canvas.height / 2 - 1,
            0,
            canvas.height / 2 + 1,
          );
          gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
          gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, canvas.height / 2 - 1, canvas.width, 2);
        }

        if (effects.lensFlare) {
          const time = frameCount / 30;
          const flareX = (Math.sin(time * 0.4) * 0.5 + 0.5) * canvas.width;
          const flareY = canvas.height * 0.4;
          const flareRadius = Math.min(canvas.width, canvas.height) * 0.4;
          const flareGradient = ctx.createRadialGradient(flareX, flareY, 0, flareX, flareY, flareRadius);
          flareGradient.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
          flareGradient.addColorStop(0.2, 'rgba(255, 220, 150, 0.3)');
          flareGradient.addColorStop(0.5, 'rgba(255, 200, 100, 0.1)');
          flareGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.globalCompositeOperation = 'screen';
          ctx.fillStyle = flareGradient;
          ctx.fillRect(flareX - flareRadius, flareY - flareRadius, flareRadius * 2, flareRadius * 2);
          ctx.globalCompositeOperation = 'source-over';
        }

        frameCount++;
        const progressPercent = Math.min((frameCount / maxFrames) * 100, 95);
        setProgress(progressPercent);

        requestAnimationFrame(processFrame);
      };

      await video.play();
      processFrame();
    } catch (error) {
      console.error('Video processing error:', error);
      toast.error('Error processing video. Please try again.');
      setIsProcessing(false);
    }
  }, [videoFile, effects, onProcessingComplete]);

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      video.src = URL.createObjectURL(videoFile);
      video.load();
      setProcessedVideoUrl(null);
      setMp4Url(null);
      setProgress(0);
    }
  }, [videoFile]);

  const downloadVideo = () => {
    if (processedVideoUrl) {
      const a = document.createElement('a');
      a.href = processedVideoUrl;
      const originalName = videoFile.name.replace(/\.[^/.]+$/, '');
      const extension = (processedVideoUrl as any).fileExtension || 'webm';
      a.download = `${originalName}_processed.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success('Download started! Check your downloads folder.');
    }
  };

  const convertToMp4 = async () => {
    if (!processedVideoUrl) return;
    setIsConverting(true);

    try {
      if (!ffmpeg.current.isLoaded()) {
        await ffmpeg.current.load();
      }

      const webmBlob = await fetch(processedVideoUrl).then((res) => res.blob());
      const webmFile = new File([webmBlob], 'input.webm', { type: 'video/webm' });

      await ffmpeg.current.FS('writeFile', 'input.webm', await fetchFile(webmFile));
      await ffmpeg.current.run(
        '-i',
        'input.webm',
        '-c:v',
        'libx264',
        '-c:a',
        'aac',
        '-preset',
        'fast',
        'output.mp4',
      );

      const data = ffmpeg.current.FS('readFile', 'output.mp4');
      const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
      setMp4Url(url);
      toast.success('MP4 conversion complete!');
    } catch (error) {
      console.error('MP4 conversion error:', error);
      toast.error('Conversion to MP4 failed. Please try again.');
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Video Processing</h2>
        <p className="text-muted-foreground">
          {isProcessing
            ? 'Processing your video with selected effects...'
            : processedVideoUrl
              ? 'Processing complete!'
              : 'Ready to process'}
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
            <p className="text-sm text-muted-foreground mb-2">Progress: {Math.round(progress)}%</p>
            <Progress value={progress} className="w-full" />
          </div>

          <div className="flex justify-center gap-4">
            {!isProcessing && !processedVideoUrl && (
              <Button variant="hero" size="lg" onClick={processVideo}>
                Start Processing
              </Button>
            )}

            {processedVideoUrl && !mp4Url && (
              <>
                <Button
                  variant="accent"
                  size="lg"
                  onClick={downloadVideo}
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Processed Video (WebM)
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={convertToMp4}
                  disabled={isConverting}
                >
                  {isConverting ? 'Converting...' : 'Convert to MP4'}
                </Button>
              </>
            )}

            {mp4Url && (
              <Button
                as="a"
                variant="primary"
                href={mp4Url}
                download={`${videoFile.name.replace(/\.[^/.]+$/, '')}_processed.mp4`}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Download Processed Video (MP4)
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
