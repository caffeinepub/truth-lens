import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Info, ScanSearch, Zap } from "lucide-react";
import FeaturesGrid from "../components/FeaturesGrid";
import ScanForm from "../components/ScanForm";
import { getCurrentUser } from "../utils/userAuth";

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Enter URL or Text",
    desc: "Paste any suspicious URL or text content into the scanner.",
  },
  {
    step: "02",
    title: "AI Analysis",
    desc: "Backend checks against multiple security databases and heuristic algorithms.",
  },
  {
    step: "03",
    title: "Get Results",
    desc: "Receive a detailed trust score, verdict, and per-API breakdown in seconds.",
  },
  {
    step: "04",
    title: "Stay Protected",
    desc: "Review the report and stay one step ahead of online threats.",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  return (
    <div className="relative">
      {/* Hero */}
      <section
        className="relative min-h-[85vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: "url(/assets/generated/hero-bg.dim_1920x1080.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <img
              src="/assets/generated/logo-transparent.dim_256x256.png"
              alt="Truth-Lens Logo"
              className="h-28 w-28 drop-shadow-[0_0_30px_oklch(var(--primary)/0.8)] animate-pulse-glow"
            />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 cyber-glow tracking-tight">
            Truth-Lens
          </h1>
          <p className="text-xl md:text-2xl text-accent cyber-glow-green mb-2 font-semibold">
            AI-Powered Phishing &amp; Fraud Detection
          </p>
          <p className="text-base md:text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Protect yourself from online threats. Scan URLs, analyze content,
            and detect fraud in real-time.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              size="lg"
              onClick={() => navigate({ to: user ? "/scan" : "/login" })}
              className="bg-primary hover:bg-primary/90 shadow-cyber-glow text-lg px-8 py-6 group"
              data-ocid="hero.primary_button"
            >
              Get Started{" "}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Link to="/admin/login">
              <Button
                size="lg"
                variant="outline"
                className="border-primary/40 hover:border-primary hover:shadow-cyber-glow text-lg px-8 py-6"
                data-ocid="hero.admin.link"
              >
                Admin Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-16 container mx-auto px-4">
        <Tabs defaultValue="features" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-10 bg-card/50 border border-primary/20 p-1 h-auto">
            <TabsTrigger
              value="features"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2.5"
              data-ocid="home.features.tab"
            >
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Features</span>
            </TabsTrigger>
            <TabsTrigger
              value="scanner"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2.5"
              data-ocid="home.scanner.tab"
            >
              <ScanSearch className="h-4 w-4" />
              <span className="hidden sm:inline">Scanner</span>
            </TabsTrigger>
            <TabsTrigger
              value="how"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2.5"
              data-ocid="home.how.tab"
            >
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">How It Works</span>
            </TabsTrigger>
            <TabsTrigger
              value="about"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2.5"
              data-ocid="home.about.tab"
            >
              <Info className="h-4 w-4" />
              <span className="hidden sm:inline">About</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="features">
            <h2 className="text-3xl font-bold text-center mb-8 cyber-glow">
              Advanced Security Features
            </h2>
            <FeaturesGrid />
          </TabsContent>

          <TabsContent value="scanner">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-4 cyber-glow">
                Quick Scan
              </h2>
              <p className="text-center text-muted-foreground mb-8">
                Paste a suspicious URL or text to analyze instantly.
              </p>
              {user ? (
                <ScanForm />
              ) : (
                <div className="text-center py-8 border border-primary/20 rounded-xl bg-card/30">
                  <p className="text-muted-foreground mb-4">
                    Please log in to use the scanner.
                  </p>
                  <Link to="/login">
                    <Button
                      className="bg-primary hover:bg-primary/90 shadow-cyber-glow"
                      data-ocid="home.scanner.login.button"
                    >
                      Login to Scan
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="how">
            <h2 className="text-3xl font-bold text-center mb-10 cyber-glow">
              How It Works
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {HOW_IT_WORKS.map((s) => (
                <div
                  key={s.step}
                  className="rounded-xl border border-primary/20 bg-card/40 p-6 text-center hover:border-primary/50 hover:shadow-cyber-glow transition-all"
                >
                  <div className="text-4xl font-bold font-mono text-primary/30 mb-3">
                    {s.step}
                  </div>
                  <h3 className="font-semibold mb-2 text-accent">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="about">
            <div className="max-w-2xl mx-auto text-center">
              <img
                src="/assets/generated/logo-transparent.dim_256x256.png"
                alt="Truth-Lens"
                className="h-32 w-32 mx-auto mb-6 drop-shadow-[0_0_20px_oklch(var(--primary)/0.6)]"
              />
              <h2 className="text-3xl font-bold mb-4 cyber-glow">
                About Truth-Lens
              </h2>
              <p className="text-muted-foreground mb-6">
                Truth-Lens is an AI-powered phishing and fraud detection
                platform built on the Internet Computer blockchain. We combine
                Google Safe Browsing, VirusTotal, and PhishTank with custom
                heuristic algorithms to protect you.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { label: "APIs Consulted", value: "3" },
                  { label: "Threat Signals", value: "70+" },
                  { label: "Detection Rate", value: "99%" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-lg border border-primary/20 bg-card/30 p-4"
                  >
                    <div className="text-2xl font-bold cyber-glow">
                      {s.value}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-xs text-muted-foreground">
                <p>
                  Built with: React &middot; Motoko &middot; Internet Computer
                  &middot; TanStack Router
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Admin link */}
      <section className="py-10 border-t border-primary/10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Administrator access
          </p>
          <Link to="/admin/login">
            <Button
              variant="outline"
              className="border-primary/30 hover:border-primary hover:shadow-cyber-glow"
              data-ocid="home.admin.link"
            >
              Go to Admin Dashboard
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
