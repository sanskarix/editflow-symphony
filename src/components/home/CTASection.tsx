import { Button } from '@/components/ui/button';
import { Video, Sparkles, ArrowRight } from 'lucide-react';

export const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/6 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/6 w-48 h-48 bg-accent/20 rounded-full blur-2xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/30 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">Ready to Transform Your Videos?</span>
          </div>

          {/* Headline */}
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Start Creating
            <span className="block bg-gradient-primary bg-clip-text text-transparent">
              Professional Videos
            </span>
            <span className="block text-foreground">Today</span>
          </h2>

          {/* Description */}
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of creators who are already using VideoFX Studio to enhance their content. 
            No sign-up required, no software to install – just upload and create.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Button 
              variant="hero" 
              size="xl"
              className="min-w-56 group"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <Video className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Start Editing Now
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span>100% Browser-based</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span>No Registration Required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span>Privacy Protected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span>Instant Results</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};