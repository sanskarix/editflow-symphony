import { Sparkles, Zap, Video, Play, Download, Shield, Clock, Star, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function Features() {
  const mainFeatures = [
    {
      icon: Sparkles,
      title: 'Cinematic Lens Flares',
      description: 'Add Hollywood-style lens flares that move organically across your video',
      details: [
        'Customizable flare intensity and movement patterns',
        'Natural-looking light effects that enhance storytelling',
        'Multiple flare styles to match different moods',
        'Real-time preview before processing'
      ],
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: Zap,
      title: 'Brightness & Saturation Boost',
      description: 'Enhance your video\'s visual impact with intelligent adjustments',
      details: [
        'AI-powered color enhancement algorithms',
        'Preserves natural skin tones and colors',
        'Optimized for different lighting conditions',
        'Maintains video quality during processing'
      ],
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      icon: Video,
      title: 'Dynamic Line Overlays',
      description: 'Create engaging scan line effects and modern overlays',
      details: [
        'Tech-inspired aesthetic for modern content',
        'Customizable line thickness and opacity',
        'Animated overlays that sync with video',
        'Perfect for gaming and tech videos'
      ],
      color: 'text-primary-glow',
      bgColor: 'bg-primary-glow/10',
    },
    {
      icon: Play,
      title: 'Smart Speed Control',
      description: 'Optimize your video\'s pacing with intelligent speed adjustments',
      details: [
        'Maintains audio synchronization',
        'Smooth speed transitions',
        'Optimized for social media formats',
        'Preserves video quality at all speeds'
      ],
      color: 'text-accent-glow',
      bgColor: 'bg-accent-glow/10',
    },
  ];

  const additionalFeatures = [
    { icon: Download, title: 'High-Quality MP4 Export', description: 'Download your enhanced videos in MP4 format with pristine quality' },
    { icon: Shield, title: 'Privacy Focused Processing', description: 'All processing happens locally in your browser - your videos never leave your device' },
    { icon: Clock, title: 'Lightning Fast Processing', description: 'Advanced optimization ensures quick processing without quality compromise' },
    { icon: Star, title: 'Professional Results', description: 'Studio-quality enhancement that rivals expensive professional software' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Powerful Video Enhancement Features</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Everything You Need for
              <span className="block bg-gradient-primary bg-clip-text text-transparent">
                Professional Videos
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Our AI-powered features are designed to give you professional results without the complexity. 
              From cinematic effects to quality enhancement, we've got you covered.
            </p>
            
            <Link to="/editor">
              <Button variant="hero" size="xl" className="group">
                <Video className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Try All Features Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {mainFeatures.map((feature, index) => (
                <div 
                  key={feature.title}
                  className="glass-strong rounded-2xl p-8 hover:bg-card/60 transition-smooth"
                >
                  <div className={`${feature.bgColor} ${feature.color} w-16 h-16 rounded-xl flex items-center justify-center mb-6`}>
                    <feature.icon className="w-8 h-8" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <ul className="space-y-3">
                    {feature.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-20 bg-card/20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Built for Modern Creators
            </h2>
            <p className="text-lg text-muted-foreground">
              Every feature is designed with your workflow in mind, ensuring you can create 
              professional content quickly and efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {additionalFeatures.map((feature, index) => (
              <div 
                key={feature.title}
                className="glass rounded-xl p-6 text-center hover:bg-card/60 transition-smooth group"
              >
                <div className="bg-primary/10 text-primary w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Ready to Transform
              <span className="block bg-gradient-primary bg-clip-text text-transparent">
                Your Videos?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Experience all these powerful features for free. No registration required, 
              no software to download – just professional results in minutes.
            </p>
            <Link to="/editor">
              <Button variant="hero" size="xl" className="group">
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Start Creating Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}