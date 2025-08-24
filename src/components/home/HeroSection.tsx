import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Sparkles, Video, Zap } from 'lucide-react';

export const HeroSection = () => {
  const [videoPlaying, setVideoPlaying] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-accent/20 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute top-2/3 left-1/3 w-16 h-16 bg-primary-glow/20 rounded-full blur-xl animate-pulse delay-2000" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-8 hover:bg-primary/15 transition-smooth">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Professional Video Effects in Seconds</span>
          </div>

          {/* Main headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            Transform Your Videos with
            <span className="block bg-gradient-primary bg-clip-text text-transparent">
              AI-Powered Effects
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Add cinematic lens flares, brightness enhancement, speed adjustments, and stunning line overlays to your videos. 
            No technical skills required – just upload, customize, and download.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button 
              variant="hero" 
              size="xl"
              className="min-w-48 group"
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            >
              <Video className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Start Editing Now
            </Button>
            <Button 
              variant="glass" 
              size="xl"
              className="min-w-48"
              onClick={() => setVideoPlaying(!videoPlaying)}
            >
              <Play className="w-5 h-5" />
              Watch Demo
            </Button>
          </div>

          {/* Features preview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {[
              { icon: Sparkles, label: 'Lens Flares' },
              { icon: Zap, label: 'Brightness Boost' },
              { icon: Video, label: 'Line Overlays' },
              { icon: Play, label: 'Speed Control' },
            ].map(({ icon: Icon, label }, index) => (
              <div 
                key={label}
                className="glass rounded-lg p-4 text-center hover:bg-card/80 transition-smooth group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Icon className="w-6 h-6 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};