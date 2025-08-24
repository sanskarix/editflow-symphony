import { Users, Target, Heart, Zap, Shield, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function About() {
  const values = [
    {
      icon: Heart,
      title: 'Creator-First',
      description: 'Everything we build is designed with creators in mind. We understand your workflow and challenges.',
    },
    {
      icon: Shield,
      title: 'Privacy by Design',
      description: 'Your content is yours. All processing happens locally, ensuring your videos never leave your device.',
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'We push the boundaries of what\'s possible in browser-based video processing.',
    },
    {
      icon: Globe,
      title: 'Accessibility',
      description: 'Professional video effects should be available to everyone, regardless of budget or technical skill.',
    },
  ];

  const stats = [
    { number: '50,000+', label: 'Videos Enhanced' },
    { number: '15,000+', label: 'Happy Creators' },
    { number: '25+', label: 'Countries Served' },
    { number: '4.9/5', label: 'User Rating' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Empowering Creators
              <span className="block bg-gradient-primary bg-clip-text text-transparent">
                Worldwide
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              VideoFX Studio was born from a simple belief: professional video enhancement 
              should be accessible to everyone, not just those with expensive software and years of training.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
                  <Target className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Our Mission</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Democratizing Professional Video Effects
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  We believe that creativity shouldn't be limited by technical barriers or expensive software. 
                  Our mission is to provide professional-grade video enhancement tools that are fast, 
                  intuitive, and accessible to creators at every level.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  By leveraging cutting-edge web technologies and AI, we're making it possible for anyone 
                  to create stunning, professional-quality videos right in their browser – no downloads, 
                  no installations, no compromises.
                </p>
              </div>
              <div className="glass-strong rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-foreground mb-6">What Drives Us</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-xs font-bold">1</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Accessibility</p>
                      <p className="text-xs text-muted-foreground">Making professional tools available to everyone</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-accent/20 text-accent rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-xs font-bold">2</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Innovation</p>
                      <p className="text-xs text-muted-foreground">Pushing the boundaries of web-based video processing</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary-glow/20 text-primary-glow rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-xs font-bold">3</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Privacy</p>
                      <p className="text-xs text-muted-foreground">Ensuring your content stays secure and private</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-card/20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Our Values
            </h2>
            <p className="text-lg text-muted-foreground">
              These core principles guide everything we do and help us stay focused 
              on what matters most: empowering your creativity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <div 
                key={value.title}
                className="glass rounded-xl p-6 text-center hover:bg-card/60 transition-smooth group"
              >
                <div className="bg-primary/10 text-primary w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <value.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Growing Impact
            </h2>
            <p className="text-lg text-muted-foreground">
              We're proud to be part of the creative journey for thousands of creators worldwide.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div 
                key={stat.label}
                className="glass rounded-xl p-6 text-center hover:bg-card/60 transition-smooth"
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-card/20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Our Team</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Built by Creators, for Creators
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
              Our team consists of experienced developers, designers, and content creators who understand 
              the challenges of modern video production. We use VideoFX Studio ourselves and are constantly 
              working to make it better based on real-world feedback.
            </p>
            <Link to="/contact">
              <Button variant="hero" size="lg" className="group">
                <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}