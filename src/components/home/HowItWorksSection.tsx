import { Upload, Wand2, Download, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const HowItWorksSection = () => {
  const steps = [
    {
      number: '01',
      icon: Upload,
      title: 'Upload Your Video',
      description: 'Simply drag and drop your video file or click to browse. We support all popular video formats including MP4, MOV, and WebM.',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      number: '02',
      icon: Wand2,
      title: 'Choose Effects',
      description: 'Select from our library of professional effects. Mix and match lens flares, brightness boosts, overlays, and speed adjustments.',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      number: '03',
      icon: Download,
      title: 'Download Enhanced Video',
      description: 'Your processed video maintains original quality with stunning effects applied. Download instantly in MP4 format.',
      color: 'text-primary-glow',
      bgColor: 'bg-primary-glow/10',
    },
  ];

  return (
    <section className="py-20 bg-card/20">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Transform your videos in three simple steps. No software to download, 
            no complex tutorials – just professional results in minutes.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                <div className="glass-strong rounded-2xl p-8 text-center hover:bg-card/60 transition-smooth group hover:scale-105">
                  {/* Step number */}
                  <div className="absolute -top-4 left-8">
                    <div className="bg-gradient-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className={`${step.bgColor} ${step.color} w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                    <step.icon className="w-8 h-8" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-primary/50" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Button 
              variant="hero" 
              size="xl"
              className="group"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Start Creating Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};