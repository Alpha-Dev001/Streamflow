import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Play, Users, Shield, Zap, ArrowRight, CheckCircle, BarChart3, Globe, Clock, Star, Monitor, Settings, TrendingUp, MessageSquare, Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react";

const Landing = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Loading animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100); // Small delay for smooth animation
    return () => clearTimeout(timer);
  }, []);

  // Enhanced smooth scroll for anchor links
  useEffect(() => {
    const handleSmoothScroll = (e) => {
      const targetId = e.target.getAttribute("href");
      if (targetId && targetId.startsWith("#")) {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const startPosition = window.pageYOffset;
          const targetPosition = targetElement.offsetTop - 80; // Account for fixed navbar
          const distance = targetPosition - startPosition;
          const duration = 800; // milliseconds
          let start = null;

          const easeInOutCubic = (t) => {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
          };

          const animation = (currentTime) => {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const progress = Math.min(timeElapsed / duration, 1);
            const easeProgress = easeInOutCubic(progress);

            window.scrollTo(0, startPosition + (distance * easeProgress));

            if (timeElapsed < duration) {
              requestAnimationFrame(animation);
            }
          };

          requestAnimationFrame(animation);
        }
      }
    };

    const handleClick = (e) => {
      handleSmoothScroll(e);
    };

    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
      link.addEventListener("click", handleClick);
    });

    return () => {
      anchorLinks.forEach(link => {
        link.removeEventListener("click", handleClick);
      });
    };
  }, []);

  // Auto-scroll animation
  useEffect(() => {
    const scrollContainer = document.getElementById('testimonials-scroll');
    if (scrollContainer) {
      let scrollPosition = 0;
      const scrollSpeed = 1; // pixels per frame

      const animate = () => {
        scrollPosition += scrollSpeed;

        // Reset when reaching the end
        if (scrollPosition >= scrollContainer.scrollWidth / 2) {
          scrollPosition = 0;
        }

        scrollContainer.scrollLeft = scrollPosition;
        requestAnimationFrame(animate);
      };

      const animationId = requestAnimationFrame(animate);

      return () => {
        cancelAnimationFrame(animationId);
      };
    }
  }, []);

  const stats = [
    { value: "10K+", label: "Active Streamers" },
    { value: "2M+", label: "Hours Streamed" },
    { value: "99.9%", label: "Uptime" },
    { value: "150+", label: "Countries" }
  ];

  const features = [
    {
      icon: Play,
      title: "Instant Streaming",
      description: "Go live in seconds with our one-click streaming technology",
      highlight: "No complex setup required"
    },
    {
      icon: Users,
      title: "Audience Growth",
      description: "Built-in tools to grow and engage your community",
      highlight: "Real-time chat and analytics"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level encryption and content protection",
      highlight: "GDPR compliant"
    },
    {
      icon: Globe,
      title: "Global CDN",
      description: "Deliver your content to viewers worldwide with zero lag",
      highlight: "Auto-scaling infrastructure"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Deep insights into your audience and performance",
      highlight: "Custom dashboards"
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock technical support for streamers",
      highlight: "Average response time < 2min"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Content Creator",
      content: "StreamFlow transformed my streaming career. The quality and reliability are unmatched.",
      rating: 5
    },
    {
      name: "Mike Rodriguez",
      role: "Professional Gamer",
      content: "Best streaming platform I've used. Zero lag and amazing audience engagement tools.",
      rating: 5
    },
    {
      name: "Emma Thompson",
      role: "Music Artist",
      content: "The monetization features helped me turn my passion into a full-time career.",
      rating: 5
    },
    {
      name: "Alex Kumar",
      role: "Tech Streamer",
      content: "The analytics dashboard gives me insights I never had before. Game changer for my content strategy.",
      rating: 5
    },
    {
      name: "Jessica Park",
      role: "Fitness Instructor",
      content: "I can reach my global audience with zero buffering. The platform is incredibly reliable.",
      rating: 4
    },
    {
      name: "David Martinez",
      role: "Podcast Host",
      content: "StreamFlow's audio quality is crystal clear. My listeners love the professional setup.",
      rating: 5
    },
    {
      name: "Lisa Wang",
      role: "Digital Artist",
      content: "The community features helped me build a loyal following. Monetization is seamless.",
      rating: 5
    },
    {
      name: "James Wilson",
      role: "Educational Streamer",
      content: "Teaching online has never been easier. The platform handles everything perfectly.",
      rating: 4
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Hero Section - Apple/MacBook Style */}
      <section className="relative min-h-screen flex items-center justify-center bg-black">
        {/* Minimal Navigation */}
        <nav className={`fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10 transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}>
          <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="StreamFlow"
                  className="w-10 h-10 object-contain"
                />
              </div>
              <span className="text-white font-semibold text-lg">StreamFlow</span>
            </div>
            <div className="flex items-center gap-8">
              <a href="#how-it-works" className="text-white/70 hover:text-white transition-colors text-sm">How it works</a>
              <a href="#testimonials" className="text-white/70 hover:text-white transition-colors text-sm">Testimonials</a>
              <Link to="/login" className="text-white/70 hover:text-white transition-colors text-sm">Sign In</Link>
              <Link to="/register" className="bg-white/60 text-black px-6 py-2 rounded-full text-sm font-medium hover:bg-white/70 transition-colors">
                Start Free
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className={`max-w-6xl mx-auto px-6 text-center pt-20 transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
          <h1 className="text-6xl md:text-8xl font-thin text-white mb-6 leading-tight">
            Streaming.
            <br />
            <span className="font-thin">Reimagined.</span>
          </h1>

          <p className="text-xl text-white/60 mb-12 max-w-3xl mx-auto leading-relaxed">
            Professional streaming infrastructure that just works.
            No complexity. No compromises. Just pure performance.
          </p>

          {/* Single CTA */}
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white/80 text-black px-8 py-4 rounded-full text-lg font-medium hover:bg-white/90 transition-colors"
          >
            Start streaming free
            <ArrowRight className="w-5 h-5" />
          </Link>

          {/* Subtle Trust Indicators */}
          <div className="mt-16 flex items-center justify-center gap-12 text-white/40 text-sm">
            <div>No credit card required</div>
            <div>•</div>
            <div>Setup in 2 minutes</div>
            <div>•</div>
            <div>14-day free trial</div>
          </div>
        </div>
      </section>

      {/* How It Works - Horizontal Timeline */}
      <section id="how-it-works" className="relative py-32 px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-thin text-white mb-8">
              How it works.
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
              Three simple steps to professional streaming.
            </p>
          </div>

          {/* Horizontal Timeline */}
          <div className="relative">

            <div className="grid md:grid-cols-3 gap-16 relative">
              {/* Step 1 */}
              <div className="text-center">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-xl border border-white/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-white/20">
                    <Monitor className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-thin text-white mb-3">Sign up</h3>
                <p className="text-white/60 leading-relaxed">
                  Create your account in seconds. No credit card required.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-xl border border-white/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-white/20">
                    <Settings className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-thin text-white mb-3">Configure</h3>
                <p className="text-white/60 leading-relaxed">
                  Choose your settings and connect your streaming software.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-xl border border-white/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-white/20">
                    <TrendingUp className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-thin text-white mb-3">Stream</h3>
                <p className="text-white/60 leading-relaxed">
                  Go live and grow your audience with professional tools.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-24">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-white/60 text-black px-8 py-4 rounded-full text-lg font-medium hover:bg-white/70 transition-colors"
            >
              Get started now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Apple Style */}
      <section id="testimonials" className="relative py-32 px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-thin text-white mb-8">
              Loved by creators.
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
              See what our users have to say about their streaming experience.
            </p>
          </div>

          <div className="relative">
            {/* Edge fade effects for entering/leaving */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black via-black/60 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black via-black/60 to-transparent z-10 pointer-events-none" />

            {/* Auto-scroll container */}
            <div
              id="testimonials-scroll"
              className="overflow-x-auto scrollbar-hide pb-4"
              style={{ scrollBehavior: 'auto' }}
            >
              <div className="flex gap-8" style={{ minWidth: 'max-content' }}>
                {[...testimonials, ...testimonials].map((testimonial, index) => (
                  <div
                    key={`${testimonial.name}-${index}`}
                    className="bg-white/5 rounded-2xl p-12 border border-white/10 min-w-[450px] max-w-[450px] hover:bg-white/10 transition-all duration-300 flex-shrink-0 relative"
                  >
                    {/* Edge glow effects */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-300" />
                    <div className="flex mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-white/80 mb-8 text-xl leading-relaxed font-light">"{testimonial.content}"</p>
                    <div>
                      <div className="font-medium text-white">{testimonial.name}</div>
                      <div className="text-white/50 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* CTA Section - Apple Style */}
      <section className="relative py-32 px-6 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-thin text-white mb-8">
            Ready to stream?
          </h2>
          <p className="text-xl text-white/60 mb-12 leading-relaxed">
            Join thousands of creators using StreamFlow.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full text-lg font-medium hover:bg-white/90 transition-all duration-300"
          >
            Start free trial
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer - Apple Style */}
      <footer className="relative py-20 px-6 bg-black border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-16 mb-16">
            {/* Company */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                  <img
                    src="/logo.png"
                    alt="StreamFlow"
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <span className="text-white font-semibold text-lg">StreamFlow</span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                Professional streaming infrastructure.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-medium text-white mb-6 text-sm">Product</h4>
              <div className="space-y-3">
                <Link to="#how-it-works" className="block text-white/60 text-sm hover:text-white transition-colors">Features</Link>
                <Link to="#" className="block text-white/60 text-sm hover:text-white transition-colors">API</Link>
                <Link to="#" className="block text-white/60 text-sm hover:text-white transition-colors">Documentation</Link>
              </div>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-medium text-white mb-6 text-sm">Company</h4>
              <div className="space-y-3">
                <Link to="#" className="block text-white/60 text-sm hover:text-white transition-colors">About</Link>
                <Link to="#" className="block text-white/60 text-sm hover:text-white transition-colors">Blog</Link>
                <Link to="#" className="block text-white/60 text-sm hover:text-white transition-colors">Careers</Link>
              </div>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-medium text-white mb-6 text-sm">Legal</h4>
              <div className="space-y-3">
                <Link to="#" className="block text-white/60 text-sm hover:text-white transition-colors">Privacy</Link>
                <Link to="#" className="block text-white/60 text-sm hover:text-white transition-colors">Terms</Link>
                <Link to="#" className="block text-white/60 text-sm hover:text-white transition-colors">Support</Link>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-16 border-t border-white/10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-white/40 text-sm">
                © 2026 StreamFlow. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <Link to="/login" className="text-white/60 text-sm hover:text-white transition-colors">Sign In</Link>
                <Link to="/register" className="text-white/60 text-sm hover:text-white transition-colors">Sign Up</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
