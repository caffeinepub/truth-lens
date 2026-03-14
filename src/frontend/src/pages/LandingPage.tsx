import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Lock } from "lucide-react";
import FeaturesGrid from "../components/FeaturesGrid";
import { getCurrentUser } from "../utils/userAuth";

export default function LandingPage() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const handleGetStarted = () => {
    if (currentUser) {
      navigate({ to: "/scan" });
    } else {
      navigate({ to: "/login" });
    }
  };

  return (
    <div className="relative">
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url(/assets/generated/hero-bg.dim_1920x1080.png)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <img
              src="/assets/generated/logo-transparent.dim_256x256.png"
              alt="Truth-Lens Logo"
              className="h-28 w-28 animate-pulse drop-shadow-[0_0_24px_rgba(0,200,255,0.7)]"
            />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 cyber-glow">
            Truth-Lens
          </h1>
          <p className="text-2xl md:text-3xl mb-4 text-accent cyber-glow-green">
            AI-Powered Phishing &amp; Fraud Detection
          </p>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Protect yourself from online threats with advanced AI technology.
            Scan URLs, analyze content, and detect fraud in real-time.
          </p>
          <Button
            size="lg"
            onClick={handleGetStarted}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-cyber-glow text-lg px-8 py-6 group"
            data-ocid="landing.primary_button"
          >
            Get Started{" "}
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>

      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 cyber-glow">
            Advanced Security Features
          </h2>
          <FeaturesGrid />
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Secure Your Digital Life?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of users protecting themselves from online fraud and
            phishing attacks.
          </p>
          <Button
            size="lg"
            onClick={handleGetStarted}
            className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-cyber-glow-green text-lg px-8 py-6"
            data-ocid="landing.secondary_button"
          >
            Start Scanning Now
          </Button>

          <div className="mt-8">
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
              data-ocid="landing.admin.link"
            >
              <Lock className="h-3 w-3" />
              Admin Access
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
