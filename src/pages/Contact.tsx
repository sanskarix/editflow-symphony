import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MessageCircle, Twitter, Github, Send, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success('Message sent successfully! We\'ll get back to you within 24 hours.');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-8">
              <MessageCircle className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Get in Touch</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              We'd Love to
              <span className="block bg-gradient-primary bg-clip-text text-transparent">
                Hear From You
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Have questions, feedback, or need help? Our team is here to support you. 
              Whether you're a creator, developer, or just curious about VideoFX Studio, we're excited to connect.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="glass-strong rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="text-sm font-medium text-foreground mb-2 block">
                        Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        required
                        className="bg-background/50"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="text-sm font-medium text-foreground mb-2 block">
                        Email *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your.email@example.com"
                        required
                        className="bg-background/50"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="text-sm font-medium text-foreground mb-2 block">
                      Subject *
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What's this about?"
                      required
                      className="bg-background/50"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="text-sm font-medium text-foreground mb-2 block">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us more about your question or feedback..."
                      rows={6}
                      required
                      className="bg-background/50 resize-none"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    variant="hero" 
                    size="lg" 
                    className="w-full group"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <CheckCircle className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>

              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-6">Other Ways to Connect</h2>
                  <div className="space-y-6">
                    <div className="glass rounded-xl p-6 hover:bg-card/60 transition-smooth">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/10 text-primary w-12 h-12 rounded-lg flex items-center justify-center">
                          <Mail className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-2">Email Support</h3>
                          <p className="text-muted-foreground mb-2">
                            For general inquiries, technical support, or partnership opportunities.
                          </p>
                          <a 
                            href="mailto:hello@videofxstudio.com"
                            className="text-primary hover:underline font-medium"
                          >
                            hello@videofxstudio.com
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="glass rounded-xl p-6 hover:bg-card/60 transition-smooth">
                      <div className="flex items-start gap-4">
                        <div className="bg-accent/10 text-accent w-12 h-12 rounded-lg flex items-center justify-center">
                          <Twitter className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-2">Social Media</h3>
                          <p className="text-muted-foreground mb-2">
                            Follow us for updates, tips, and community highlights.
                          </p>
                          <a 
                            href="https://twitter.com/videofxstudio"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent hover:underline font-medium"
                          >
                            @videofxstudio
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="glass rounded-xl p-6 hover:bg-card/60 transition-smooth">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary-glow/10 text-primary-glow w-12 h-12 rounded-lg flex items-center justify-center">
                          <Github className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-2">Open Source</h3>
                          <p className="text-muted-foreground mb-2">
                            Contribute to our open-source projects or report issues.
                          </p>
                          <a 
                            href="https://github.com/videofxstudio"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-glow hover:underline font-medium"
                          >
                            github.com/videofxstudio
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* FAQ */}
                <div className="glass-strong rounded-2xl p-8">
                  <h3 className="text-xl font-semibold text-foreground mb-6">Quick Answers</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-1">Response Time</h4>
                      <p className="text-sm text-muted-foreground">We typically respond within 24 hours during business days.</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-1">Technical Support</h4>
                      <p className="text-sm text-muted-foreground">Include your browser version and device info for faster troubleshooting.</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-1">Feature Requests</h4>
                      <p className="text-sm text-muted-foreground">We love hearing your ideas! Tell us what features would help your workflow.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}