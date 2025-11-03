import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Ticket, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import influenciaPoster from "@/assets/influencia-poster.jpeg";

interface HeroProps {
  onRegisterClick: () => void;
}

const Hero = ({ onRegisterClick }: HeroProps) => {
  const navigate = useNavigate();
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const heroRef = useRef<HTMLElement>(null);
  const heroTriggerRef = useRef<HTMLDivElement>(null);
  const hasTriggeredRef = useRef(false);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const cancelNavigation = () => {
    setShowCountdown(false);
    setCountdown(5);
    hasTriggeredRef.current = false;
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
      navigationTimeoutRef.current = null;
    }
  };

  const startCountdown = () => {
    setShowCountdown(true);
    setCountdown(5);
    
    let count = 5;
    countdownIntervalRef.current = setInterval(() => {
      count -= 1;
      setCountdown(count);
      
      if (count <= 0) {
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current);
        }
      }
    }, 1000);

    // Navigate after 5 seconds
    navigationTimeoutRef.current = setTimeout(() => {
      setIsTransitioning(true);
      
      // Simple fade-out
      if (heroRef.current) {
        heroRef.current.style.transition = 'opacity 0.5s ease-out';
        heroRef.current.style.opacity = '0';
      }

      // Navigate after animation
      setTimeout(() => {
        navigate('/about');
        window.scrollTo({ top: 0, behavior: 'instant' });
      }, 500);
    }, 5000);
  };

  // Lightweight scroll indicator hide/show
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollIndicator(window.scrollY <= 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Reliable trigger using IntersectionObserver on a sentinel at the bottom of hero
  useEffect(() => {
    if (!heroTriggerRef.current) return;
    const el = heroTriggerRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        if (entry.isIntersecting && !showCountdown && !isTransitioning && !hasTriggeredRef.current) {
          // Start countdown when bottom sentinel is visible
          hasTriggeredRef.current = true;
          startCountdown();
        } else if (!entry.isIntersecting && showCountdown) {
          // Cancel if sentinel leaves viewport (user scrolled up)
          cancelNavigation();
        } else if (!entry.isIntersecting && !showCountdown && hasTriggeredRef.current) {
          // Reset when moved away without active countdown
          hasTriggeredRef.current = false;
        }
      },
      {
        root: null,
        threshold: 0.6, // require 60% of sentinel to be visible (practical on small screens too)
      }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelNavigation();
    };
  }, [showCountdown, isTransitioning]);

  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl animate-pulse" />
      </div>

  {/* Bottom sentinel for IntersectionObserver trigger */}
  <div ref={heroTriggerRef} className="absolute bottom-0 left-0 right-0 h-2 pointer-events-none" aria-hidden="true" />

      <div className="container relative z-10 px-6 py-20 mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div className="animate-fade-in-up opacity-0" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
              <h3 className="text-sm font-semibold tracking-[0.3em] text-muted-foreground uppercase mb-4">
                Kaisan Associates Presents
              </h3>
            </div>

            <div className="animate-fade-in-up opacity-0" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
              <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
                  INFLUENCIA
                </span>
              </h1>
              <p className="text-xl md:text-2xl font-light text-foreground/80 mt-4 tracking-wide">
                Edition 2
              </p>
            </div>

            <div className="animate-fade-in-up opacity-0" style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}>
              <p className="text-2xl md:text-3xl font-light text-foreground/90 leading-relaxed">
                Transform Your Life Through Personal Excellence
              </p>
            </div>

            <div className="animate-fade-in-up opacity-0 pt-4" style={{ animationDelay: "0.7s", animationFillMode: "forwards" }}>
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2 text-foreground/70 group hover:text-primary transition-colors">
                  <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Saturday, 13 December 2025</span>
                </div>
                <div className="flex items-center gap-2 text-foreground/70 group hover:text-primary transition-colors">
                  <MapPin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Exclusive Workshop</span>
                </div>
                <div className="flex items-center gap-2 text-foreground/70 group hover:text-primary transition-colors">
                  <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Limited Seats</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up opacity-0 pt-4" style={{ animationDelay: "0.9s", animationFillMode: "forwards" }}>
              <Button
                onClick={onRegisterClick}
                size="lg"
                className="px-12 py-7 text-lg font-semibold bg-primary hover:bg-primary/90 text-white rounded-full shadow-2xl hover:shadow-primary/50 transition-all duration-500 hover:scale-105 group"
              >
                Reserve Your Seat
                <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">→</span>
              </Button>
              
              <Link to="/login" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full px-12 py-7 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 group"
                >
                  <Ticket className="w-5 h-5 mr-2" />
                  View Your E-Pass
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column - Poster */}
          <div className="animate-fade-in-up opacity-0" style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-500" />
              <img 
                src={influenciaPoster} 
                alt="Influencia Event Poster" 
                className="relative w-full h-auto rounded-2xl shadow-2xl group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div 
        className={`absolute bottom-12 left-1/2 -translate-x-1/2 z-20 transition-all duration-500 ${
          showScrollIndicator ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <button
          onClick={handleScrollDown}
          className="group flex flex-col items-center gap-3 cursor-pointer"
          aria-label="Scroll down"
        >
          <span className="text-sm font-semibold text-muted-foreground tracking-wider uppercase">
            Discover More
          </span>
          <div className="relative">
            {/* Animated circle background */}
            <div className="absolute inset-0 w-12 h-12 rounded-full bg-primary/10 animate-ping" />
            <div className="relative w-12 h-12 rounded-full bg-primary/20 backdrop-blur-sm border-2 border-primary/40 flex items-center justify-center group-hover:bg-primary/30 group-hover:border-primary/60 transition-all duration-300">
              <ChevronDown className="w-6 h-6 text-primary animate-bounce" />
            </div>
          </div>
          <div className="text-xs text-muted-foreground/70">
            Scroll to continue your journey
          </div>
        </button>
      </div>

      {/* Countdown Navigation Indicator */}
      <div 
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
          showCountdown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
        }`}
      >
        <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-4 md:px-8 py-3 md:py-4 rounded-2xl shadow-2xl border-2 border-white/20 backdrop-blur-xl max-w-[95vw] md:max-w-none">
          <div className="flex items-center gap-2 md:gap-4">
            <div className="relative flex items-center justify-center flex-shrink-0">
              <svg className="w-12 h-12 md:w-16 md:h-16 transform -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="3"
                  fill="none"
                  className="md:hidden"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="white"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={`${(countdown / 5) * 125.66} 125.66`}
                  className="transition-all duration-1000 ease-linear md:hidden"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="4"
                  fill="none"
                  className="hidden md:block"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="white"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${(countdown / 5) * 175.93} 175.93`}
                  className="transition-all duration-1000 ease-linear hidden md:block"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl md:text-3xl font-black">{countdown}</span>
              </div>
            </div>
            <div className="flex flex-col gap-0.5 md:gap-1 min-w-0">
              <p className="text-sm md:text-lg font-bold truncate">Taking you to About page...</p>
              <p className="text-xs md:text-sm text-white/80">Scroll up to cancel</p>
            </div>
            <button
              onClick={cancelNavigation}
              className="ml-2 md:ml-4 px-3 md:px-4 py-1.5 md:py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm md:text-base font-semibold transition-all duration-200 hover:scale-105 flex-shrink-0"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
