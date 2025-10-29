import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users } from "lucide-react";

interface HeroProps {
  onRegisterClick: () => void;
}

const Hero = ({ onRegisterClick }: HeroProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="container relative z-10 px-6 py-20 mx-auto">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Logo/Brand */}
          <div className="animate-fade-in-up opacity-0" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
            <h3 className="text-sm font-semibold tracking-[0.3em] text-muted-foreground uppercase mb-4">
              Kaisan Associates Presents
            </h3>
          </div>

          {/* Main Heading */}
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

          {/* Tagline */}
          <div className="animate-fade-in-up opacity-0" style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}>
            <p className="text-2xl md:text-3xl font-light text-foreground/90 max-w-3xl mx-auto leading-relaxed">
              Transform Your Life Through Personal Excellence
            </p>
          </div>

          {/* Event Details */}
          <div className="animate-fade-in-up opacity-0 pt-8" style={{ animationDelay: "0.7s", animationFillMode: "forwards" }}>
            <div className="flex flex-wrap justify-center gap-8 text-sm">
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

          {/* CTA Button */}
          <div className="animate-fade-in-up opacity-0 pt-4" style={{ animationDelay: "0.9s", animationFillMode: "forwards" }}>
            <Button
              onClick={onRegisterClick}
              size="lg"
              className="px-12 py-7 text-lg font-semibold bg-primary hover:bg-primary/90 text-white rounded-full shadow-2xl hover:shadow-primary/50 transition-all duration-500 hover:scale-105 group"
            >
              Reserve Your Seat
              <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">→</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary/50 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
