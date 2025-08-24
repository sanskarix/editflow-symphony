import { useState } from 'react';
import { Minus, Zap, Sun, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

export interface VideoEffects {
  lineOverlay: boolean;
  speedBoost: boolean;
  brightnessBoost: boolean;
  lensFlare: boolean;
}

interface EffectsPanelProps {
  effects: VideoEffects;
  onEffectChange: (effects: VideoEffects) => void;
  onStartProcessing: () => void;
  isProcessing: boolean;
}

const effectsConfig = [
  {
    id: 'lineOverlay' as keyof VideoEffects,
    name: 'Subtle Line Overlay',
    description: 'Adds a horizontal glass-like line in the middle',
    icon: Minus,
    color: 'text-blue-400',
  },
  {
    id: 'speedBoost' as keyof VideoEffects,
    name: 'Speed Enhancement',
    description: 'Increases video speed to 1.1x with synchronized audio',
    icon: Zap,
    color: 'text-yellow-400',
  },
  {
    id: 'brightnessBoost' as keyof VideoEffects,
    name: 'Brightness & Saturation',
    description: 'Subtle enhancement preserving original quality',
    icon: Sun,
    color: 'text-orange-400',
  },
  {
    id: 'lensFlare' as keyof VideoEffects,
    name: 'Dynamic Lens Flare',
    description: 'Adds a moving cinematic lens flare effect',
    icon: Sparkles,
    color: 'text-purple-400',
  },
];

export const EffectsPanel = ({ effects, onEffectChange, onStartProcessing, isProcessing }: EffectsPanelProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleEffectToggle = (effectId: keyof VideoEffects, checked: boolean) => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    
    onEffectChange({
      ...effects,
      [effectId]: checked,
    });
  };

  const selectedEffectsCount = Object.values(effects).filter(Boolean).length;
  const hasEffectsSelected = selectedEffectsCount > 0;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Choose Your Effects
        </h2>
        <p className="text-muted-foreground">
          Select effects to enhance your video
        </p>
      </div>

      <div className="grid gap-4">
        {effectsConfig.map((effect) => {
          const Icon = effect.icon;
          const isSelected = effects[effect.id];
          
          return (
            <div
              key={effect.id}
              className={`glass-strong rounded-xl p-6 border transition-all duration-300 hover:scale-102 cursor-pointer ${
                isSelected
                  ? 'border-primary bg-primary/10 shadow-glow transform scale-102'
                  : 'border-glass-border hover:border-primary/50 hover:shadow-lg'
              } ${isAnimating ? 'animate-pulse' : ''}`}
              onClick={() => handleEffectToggle(effect.id, !isSelected)}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  isSelected ? 'bg-gradient-primary shadow-glow scale-110' : 'bg-secondary hover:bg-secondary/80'
                }`}>
                  <Icon className={`w-6 h-6 transition-all duration-300 ${
                    isSelected ? 'text-primary-foreground animate-pulse' : effect.color
                  }`} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <Checkbox
                      id={effect.id}
                      checked={isSelected}
                      onCheckedChange={(checked) => 
                        handleEffectToggle(effect.id, checked as boolean)
                      }
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <label 
                      htmlFor={effect.id}
                      className="font-semibold text-foreground cursor-pointer"
                    >
                      {effect.name}
                    </label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {effect.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center pt-4">
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            {selectedEffectsCount} effect{selectedEffectsCount !== 1 ? 's' : ''} selected
          </p>
        </div>
        
        <Button
          variant={isProcessing ? "processing" : "hero"}
          size="xl"
          onClick={onStartProcessing}
          disabled={!hasEffectsSelected || isProcessing}
          className="w-full max-w-md transition-all duration-300 hover:scale-105 active:scale-95"
        >
          {isProcessing ? 'Processing Video...' : 'Start Processing'}
        </Button>
        
        {!hasEffectsSelected && (
          <p className="text-sm text-muted-foreground mt-2">
            Select at least one effect to continue
          </p>
        )}
      </div>
    </div>
  );
};
