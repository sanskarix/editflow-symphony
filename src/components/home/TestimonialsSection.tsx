import { Star, Quote } from 'lucide-react';

export const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Content Creator',
      company: '@sarahcreates',
      content: 'VideoFX Studio has completely transformed my content creation workflow. The lens flare effects are absolutely stunning, and the fact that everything processes locally gives me complete peace of mind about my video privacy.',
      rating: 5,
      avatar: 'SC',
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Wedding Videographer',
      company: 'Rodriguez Films',
      content: 'As a professional videographer, I was skeptical about browser-based editing. But the quality of effects here rivals expensive desktop software. The brightness enhancement feature has saved me hours of color correction.',
      rating: 5,
      avatar: 'MR',
    },
    {
      name: 'Emily Watson',
      role: 'Marketing Director',
      company: 'TechStartup Inc.',
      content: 'Our marketing team loves how easy it is to enhance our product videos. The professional results help our content stand out on social media, and the speed of processing means we can iterate quickly on campaigns.',
      rating: 5,
      avatar: 'EW',
    },
    {
      name: 'David Kim',
      role: 'YouTuber',
      company: '500K Subscribers',
      content: 'The speed control feature is a game-changer for creating engaging content. I can add cinematic effects to my videos without the complexity of traditional editing software. My audience engagement has increased significantly.',
      rating: 5,
      avatar: 'DK',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background/50 to-background">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Loved by Creators
            <span className="block bg-gradient-primary bg-clip-text text-transparent">
              Worldwide
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of content creators, professionals, and businesses who trust 
            VideoFX Studio for their video enhancement needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.name}
              className="glass-strong rounded-xl p-6 hover:bg-card/60 transition-smooth group"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Quote icon */}
              <Quote className="w-8 h-8 text-primary/50 mb-4" />
              
              {/* Content */}
              <p className="text-muted-foreground leading-relaxed mb-6">
                "{testimonial.content}"
              </p>
              
              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              
              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role} • {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
          {[
            { number: '50K+', label: 'Videos Enhanced' },
            { number: '15K+', label: 'Happy Creators' },
            { number: '4.9★', label: 'User Rating' },
            { number: '100%', label: 'Privacy Protected' },
          ].map((stat, index) => (
            <div 
              key={stat.label}
              className="text-center glass rounded-lg p-4 hover:bg-card/60 transition-smooth"
            >
              <div className="text-2xl md:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                {stat.number}
              </div>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};