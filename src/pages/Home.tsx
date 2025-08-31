import { useState, useRef, useEffect } from 'react';
import { VideoUpload } from '@/components/VideoUpload';
import { EffectsPanel, VideoEffects } from '@/components/EffectsPanel';
import { VideoProcessor } from '@/components/VideoProcessor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Play, 
  Sparkles, 
  Zap, 
  Shield, 
  Clock,
  Star,
  Quote,
  ArrowRight,
  Video,
  Mail,
  Phone,
  ChevronDown
} from 'lucide-react';
import { toast } from 'sonner';

type EditorStep = 'landing' | 'upload' | 'effects' | 'processing';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<EditorStep>('landing');
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [effects, setEffects] = useState<VideoEffects>({
    lineOverlay: false,
    speedBoost: false,
    brightnessBoost: false,
    lensFlare: false,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  // Smooth scroll to editor
  const scrollToEditor = () => {
    setCurrentStep('upload');
    setTimeout(() => {
      editorRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 100);
  };

  // Smooth scroll to features
  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  };

  const handleVideoSelect = (file: File) => {
    setSelectedVideo(file);
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
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent! We\'ll get back to you soon.');
  };

  // Intersection observer for animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.fade-in-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-2xl flex items-center justify-center">
                <Video className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                VideoFX Pro
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <button 
                onClick={scrollToFeatures}
                className="text-foreground/70 hover:text-foreground transition-smooth"
              >
                Features
              </button>
              <Button 
                variant="ghost" 
                onClick={scrollToEditor}
                className="hover:bg-primary/10"
              >
                Try Now
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto fade-in-on-scroll">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent leading-tight">
              Transform Your Videos
              <br />
              <span className="text-foreground">In Seconds</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Professional video effects powered by AI. Add lens flares, enhance colors, 
              and boost your content with studio-quality effects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="xl" 
                variant="hero"
                onClick={scrollToEditor}
                className="group hover:scale-105 transition-smooth shadow-glow"
              >
                Start Editing Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-smooth" />
              </Button>
              <Button 
                size="xl" 
                variant="outline"
                onClick={scrollToFeatures}
                className="group border-primary/20 hover:border-primary/40"
              >
                See Features
                <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-smooth" />
              </Button>
            </div>
          </div>
          
          {/* Demo Video Preview */}
          <div className="mt-16 max-w-4xl mx-auto fade-in-on-scroll">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-primary rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-smooth"></div>
              <div className="relative bg-card/50 backdrop-blur-xl rounded-3xl p-8 border border-border/50">
                <div className="aspect-video bg-gradient-secondary rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <Play className="w-16 h-16 text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">See VideoFX Pro in action</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 px-6 bg-card/30">
        <div className="container mx-auto">
          <div className="text-center mb-16 fade-in-on-scroll">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Powerful Effects,
              <span className="bg-gradient-primary bg-clip-text text-transparent"> Simple Interface</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create stunning videos, built for creators who demand quality.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Sparkles,
                title: "Lens Flare Effects",
                description: "Add cinematic lens flares that move naturally across your footage"
              },
              {
                icon: Zap,
                title: "Speed Enhancement",
                description: "Optimize playback speed for better engagement and flow"
              },
              {
                icon: Shield,
                title: "Color Boost",
                description: "Enhance brightness and saturation for vibrant, professional results"
              },
              {
                icon: Clock,
                title: "Instant Processing",
                description: "Get your enhanced videos in seconds, not hours"
              }
            ].map((feature, index) => (
              <div key={index} className="fade-in-on-scroll group">
                <div className="bg-card/50 backdrop-blur-xl rounded-2xl p-6 border border-border/50 hover:border-primary/30 transition-smooth hover:shadow-card hover:-translate-y-2">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-smooth">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16 fade-in-on-scroll">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Three Simple Steps to
              <span className="bg-gradient-primary bg-clip-text text-transparent"> Amazing Videos</span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "01", title: "Upload", description: "Drop your video file or select from device" },
                { step: "02", title: "Enhance", description: "Choose from professional effects and filters" },
                { step: "03", title: "Download", description: "Get your enhanced video in MP4 format" }
              ].map((item, index) => (
                <div key={index} className="text-center fade-in-on-scroll group">
                  <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white group-hover:scale-110 transition-smooth">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-card/30">
        <div className="container mx-auto">
          <div className="text-center mb-16 fade-in-on-scroll">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Loved by
              <span className="bg-gradient-primary bg-clip-text text-transparent"> Creators Worldwide</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Sarah Chen",
                role: "Content Creator",
                content: "VideoFX Pro transformed my content game. The lens flare effects are absolutely stunning!",
                rating: 5
              },
              {
                name: "Mike Rodriguez",
                role: "YouTuber",
                content: "Finally, professional video effects that don't take hours to render. This is a game-changer.",
                rating: 5
              },
              {
                name: "Emma Thompson",
                role: "Social Media Manager",  
                content: "The quality is incredible and it's so easy to use. My videos look like they were made in a studio.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="fade-in-on-scroll">
                <div className="bg-card/50 backdrop-blur-xl rounded-2xl p-6 border border-border/50 hover:border-primary/30 transition-smooth">
                  <Quote className="w-8 h-8 text-primary mb-4" />
                  <p className="text-foreground mb-4 leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center gap-2 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Editor Section */}
      {currentStep !== 'landing' && (
        <section ref={editorRef} className="py-20 px-6 bg-background">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">
                  <span className="bg-gradient-primary bg-clip-text text-transparent">Video Editor</span>
                </h2>
                <p className="text-muted-foreground">Transform your videos with professional effects</p>
              </div>

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
                            ? 'bg-gradient-primary text-white shadow-glow' 
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

              {/* Editor Content */}
              <div className="bg-card/50 backdrop-blur-xl rounded-3xl p-8 border border-border/50">
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
          </div>
        </section>
      )}

      {/* CTA Section */}
      {currentStep === 'landing' && (
        <section className="py-20 px-6">
          <div className="container mx-auto text-center">
            <div className="max-w-3xl mx-auto fade-in-on-scroll">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Create
                <span className="bg-gradient-primary bg-clip-text text-transparent"> Amazing Videos?</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of creators who trust VideoFX Pro for their video enhancement needs.
              </p>
              <Button 
                size="xl" 
                variant="hero"
                onClick={scrollToEditor}
                className="group hover:scale-105 transition-smooth shadow-glow"
              >
                Start Creating Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-smooth" />
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Footer with Contact */}
      <footer className="bg-card/50 backdrop-blur-xl border-t border-border/50">
        <div className="container mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Contact Form */}
            <div className="fade-in-on-scroll">
              <h3 className="text-2xl font-bold mb-6">Get In Touch</h3>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    placeholder="First Name" 
                    className="bg-background/50 border-border/50 focus:border-primary/50"
                    required
                  />
                  <Input 
                    placeholder="Last Name" 
                    className="bg-background/50 border-border/50 focus:border-primary/50"
                    required
                  />
                </div>
                <Input 
                  type="email" 
                  placeholder="Email Address" 
                  className="bg-background/50 border-border/50 focus:border-primary/50"
                  required
                />
                <Textarea 
                  placeholder="Your Message" 
                  rows={4}
                  className="bg-background/50 border-border/50 focus:border-primary/50"
                  required
                />
                <Button 
                  type="submit" 
                  variant="hero" 
                  size="lg"
                  className="w-full"
                >
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="fade-in-on-scroll">
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">Email Us</p>
                    <a 
                      href="mailto:hello@videofxpro.com" 
                      className="text-primary hover:text-primary/80 transition-smooth"
                    >
                      hello@videofxpro.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">Call Us</p>
                    <a 
                      href="tel:+1234567890" 
                      className="text-primary hover:text-primary/80 transition-smooth"
                    >
                      +1 (234) 567-8900
                    </a>
                  </div>
                </div>

                <div className="pt-6">
                  <h4 className="font-semibold mb-4">Quick Actions</h4>
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                      asChild
                    >
                      <a href="mailto:hello@videofxpro.com">
                        <Mail className="w-4 h-4" />
                        Email
                      </a>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      asChild
                    >
                      <a href="tel:+1234567890">
                        <Phone className="w-4 h-4" />
                        Call
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-border/50 mt-12 pt-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Video className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
                VideoFX Pro
              </span>
            </div>
            <p className="text-muted-foreground">
              © 2024 VideoFX Pro. Transform your videos with professional effects.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}