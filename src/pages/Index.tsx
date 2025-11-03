import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Phone, Mail, Calendar, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import Hero from "@/components/Hero";
import RegistrationForm from "@/components/RegistrationForm";
import kaisanLogo from "@/assets/kaisan-logo.png";

const Index = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const contactSectionRef = useRef<HTMLElement>(null);
  const hasTriggeredNavRef = useRef(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const cancelNavigation = () => {
    setShowCountdown(false);
    setCountdown(5);
    hasTriggeredNavRef.current = false;
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
      // Simple fade-out
      if (contactSectionRef.current) {
        contactSectionRef.current.style.transition = 'opacity 0.5s ease-out';
        contactSectionRef.current.style.opacity = '0';
      }

      // Navigate after animation
      setTimeout(() => {
        navigate('/about');
        window.scrollTo({ top: 0, behavior: 'instant' });
      }, 500);
    }, 5000);
  };

  useEffect(() => {
    const handleOpenRegistration = () => {
      setIsFormOpen(true);
    };

    window.addEventListener('openRegistrationModal', handleOpenRegistration);
    
    return () => {
      window.removeEventListener('openRegistrationModal', handleOpenRegistration);
    };
  }, []);

  // Open registration if navigated from About page
  useEffect(() => {
    if (location.state?.openRegistration) {
      setTimeout(() => {
        setIsFormOpen(true);
      }, 300);
      
      // Clear the state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Reliable trigger using IntersectionObserver on the contact section
  useEffect(() => {
    if (!contactSectionRef.current) return;
    const el = contactSectionRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        if (entry.isIntersecting && entry.intersectionRatio >= 0.6 && !showCountdown && !hasTriggeredNavRef.current) {
          hasTriggeredNavRef.current = true;
          startCountdown();
        }

        if (!entry.isIntersecting) {
          if (showCountdown) {
            cancelNavigation();
          } else {
            hasTriggeredNavRef.current = false;
          }
        }
      },
      { root: null, threshold: [0, 0.25, 0.5, 0.6, 0.75, 1] }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelNavigation();
    };
  }, [showCountdown]);

  return (
    <div className="min-h-screen bg-background">
      <Hero onRegisterClick={() => setIsFormOpen(true)} />
      
      {/* Contact Section */}
      <section 
        ref={contactSectionRef}
        className="py-32 bg-gradient-to-b from-background to-primary/5 relative overflow-hidden"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10 px-6 mx-auto">
          <div className="max-w-4xl mx-auto text-center space-y-16">
            <div className="space-y-6 animate-fade-in-up">
              <h2 className="text-5xl md:text-6xl font-bold text-foreground">
                Ready to <span className="text-primary">Transform?</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Take the first step towards personal excellence and professional growth
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <div className="p-8 rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg group">
                <Phone className="w-8 h-8 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <p className="text-sm text-muted-foreground mb-2 font-medium">Call Us</p>
                <a href="tel:+918589990060" className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
                  +91 858 999 00 60
                </a>
              </div>

              <div className="p-8 rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg group">
                <Mail className="w-8 h-8 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <p className="text-sm text-muted-foreground mb-2 font-medium">Email Us</p>
                <a href="mailto:info@kaisanassociates.com" className="text-lg font-semibold text-foreground hover:text-primary transition-colors break-all">
                  info@kaisanassociates.com
                </a>
              </div>

              <div className="p-8 rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg group">
                <Calendar className="w-8 h-8 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <p className="text-sm text-muted-foreground mb-2 font-medium">Date</p>
                <p className="text-lg font-semibold text-foreground">
                  Saturday, 13 Dec 2025
                </p>
              </div>
            </div>

            <div className="animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              <button
                onClick={() => setIsFormOpen(true)}
                className="px-12 py-7 text-lg font-semibold text-white bg-primary hover:bg-primary/90 rounded-full shadow-2xl hover:shadow-primary/50 transition-all duration-500 hover:scale-105 group"
              >
                Register Your Seat Now
                <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-background border-t border-border/50">
        <div className="container px-6 mx-auto">
          <div className="flex flex-col items-center gap-6">
            <img src={kaisanLogo} alt="Kaisan Associates" className="h-12 opacity-80" />
            <p className="text-center text-muted-foreground">
              © 2025 Kaisan Associates. All rights reserved.
            </p>
            <p className="text-center text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Empowering individuals and organizations to achieve excellence through transformative workshops and training programs.
            </p>
          </div>
        </div>
      </footer>

      {/* Registration Form Modal */}
      <RegistrationForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />

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
    </div>
  );
};

export default Index;
