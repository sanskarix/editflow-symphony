import { Sparkles, Zap, Video, Play, Download, Shield, Clock, Star } from 'lucide-react';

export const FeaturesSection = () => {
  const features = [
    {
      icon: Sparkles,
      title: 'Cinematic Lens Flares',
      description: 'Add Hollywood-style lens flares that move organically across your video, creating a professional cinematic look.',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: Zap,
      title: 'Brightness & Saturation Boost',
      description: 'Enhance your video\'s visual impact with intelligent brightness and saturation adjustments that maintain natural colors.',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      icon: Video,
      title: 'Dynamic Line Overlays',
      description: 'Create engaging scan line effects and overlays that add a modern, tech-inspired aesthetic to your content.',
      color: 'text-primary-glow',
      bgColor: 'bg-primary-glow/10',
    },
    {
      icon: Play,
      title: 'Smart Speed Control',
      description: 'Optimize your video\'s pacing with intelligent speed adjustments while preserving audio quality and synchronization.',
      color: 'text-accent-glow',
      bgColor: 'bg-accent-glow/10',
    },
    {
      icon: Download,
      title: 'High-Quality Export',
      description: 'Download your enhanced videos in MP4 format with pristine quality, ready for any platform or purpose.',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: Shield,
      title: 'Privacy Focused',
      description: 'Your videos are processed locally in your browser. Nothing is uploaded to servers, ensuring complete privacy.',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      icon: Clock,
      title: 'Lightning Fast',
      description: 'Advanced optimization ensures your videos are processed quickly without compromising on quality or effects.',
      color: 'text-primary-glow',
      bgColor: 'bg-primary-glow/10',
    },
    {
      icon: Star,
      title: 'Professional Results',
      description: 'Achieve studio-quality video enhancement that rivals expensive professional software, all in your browser.',
      color: 'text-accent-glow',
      bgColor: 'bg-accent-glow/10',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-background/50">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Powerful Features for
            <span className="block bg-gradient-primary bg-clip-text text-transparent">
              Professional Results
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to transform ordinary videos into extraordinary content. 
            Our AI-powered effects are designed to be intuitive, fast, and incredibly effective.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="glass-strong rounded-xl p-6 hover:bg-card/60 transition-smooth group hover:scale-105 hover:shadow-glow"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`${feature.bgColor} ${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
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
  );
};