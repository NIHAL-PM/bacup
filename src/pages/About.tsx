import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import AboutInfluencia from "@/components/AboutInfluencia";
import kaisanLogo from "@/assets/kaisan-logo.png";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/">
            <img src={kaisanLogo} alt="Kaisan Associates" className="h-12 object-contain" />
          </Link>
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="pt-24">
        <AboutInfluencia />
      </main>

      <footer className="bg-card/50 backdrop-blur-sm border-t border-border py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <img src={kaisanLogo} alt="Kaisan Associates" className="h-16 mx-auto mb-4 object-contain" />
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} Kaisan Associates. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default About;
