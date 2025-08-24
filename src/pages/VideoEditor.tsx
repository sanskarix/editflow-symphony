import { useState } from 'react';
import { VideoUpload } from '@/components/VideoUpload';
import { EffectsPanel, VideoEffects } from '@/components/EffectsPanel';
import { VideoProcessor } from '@/components/VideoProcessor';
import { Sparkles, Video } from 'lucide-react';

type EditorStep = 'upload' | 'effects' | 'processing';

export default function VideoEditor() {
  const [currentStep, setCurrentStep] = useState<EditorStep>('upload');
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [effects, setEffects] = useState<VideoEffects>({
    lineOverlay: false,
    speedBoost: false,
    brightnessBoost: false,
    lensFlare: false,
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleVideoSelect = (file: File) => {
    setSelectedVideo(file);
    // Animate transition to effects panel
    setTimeout(() => {
      setCurrentStep('effects');
    }, 300);
  };

  const handleRemoveVideo = () => {
    setSelectedVideo(null);
    setCurrentStep('upload');
    setEffects({
      lineOverlay: false,
      speedBoost: false,
      brightnessBoost: false,
      lensFlare: false,
    });
  };

  const handleStartProcessing = () => {
    setIsProcessing(true);
    setCurrentStep('processing');
  };

  const handleProcessingComplete = (processedVideoUrl: string) => {
    setIsProcessing(false);
    // Keep on processing step to show download option
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-12">
            <div className="flex items-center gap-4">
              {[
                { step: 'upload', label: 'Upload', icon: Video },
                { step: 'effects', label: 'Effects', icon: Sparkles },
                { step: 'processing', label: 'Process', icon: Video },
              ].map(({ step, label, icon: Icon }, index) => {
                const isActive = currentStep === step;
                const isCompleted = 
                  (step === 'upload' && selectedVideo) ||
                  (step === 'effects' && currentStep === 'processing');
                
                return (
                  <div key={step} className="flex items-center gap-4">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-smooth ${
                      isActive 
                        ? 'bg-gradient-primary text-primary-foreground shadow-glow' 
                        : isCompleted
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-secondary text-secondary-foreground'
                    }`}>
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{label}</span>
                    </div>
                    {index < 2 && (
                      <div className={`w-8 h-0.5 transition-smooth ${
                        isCompleted ? 'bg-accent' : 'bg-border'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step Content */}
          <div className="transition-smooth">
            {currentStep === 'upload' && (
              <VideoUpload
                onVideoSelect={handleVideoSelect}
                selectedVideo={selectedVideo}
                onRemoveVideo={handleRemoveVideo}
              />
            )}

            {currentStep === 'effects' && selectedVideo && (
              <EffectsPanel
                effects={effects}
                onEffectChange={setEffects}
                onStartProcessing={handleStartProcessing}
                isProcessing={isProcessing}
              />
            )}

            {currentStep === 'processing' && selectedVideo && (
              <VideoProcessor
                videoFile={selectedVideo}
                effects={effects}
                onProcessingComplete={handleProcessingComplete}
              />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 VideoFX Studio. Transform your videos with professional effects.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
