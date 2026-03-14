import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Info, Lock, ScanLine, Shield, Zap } from "lucide-react";
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
    <div className="relative" style={{ background: "oklch(0.12 0.02 240)" }}>
      {/* Global cyber background layer */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: "url(/assets/generated/hero-bg.dim_1920x1080.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          opacity: 0.15,
        }}
      />
      {/* Scan line overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, oklch(0.65 0.25 220 / 0.015) 2px, oklch(0.65 0.25 220 / 0.015) 4px)",
        }}
      />

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden z-10">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url(/assets/generated/hero-bg.dim_1920x1080.png)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, oklch(0.12 0.02 240 / 0.7) 0%, oklch(0.12 0.02 240 / 0.5) 50%, oklch(0.12 0.02 240) 100%)",
            }}
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <img
              src="/assets/generated/truth-lens-logo-transparent.dim_256x256.png"
              alt="Truth-Lens Logo"
              className="h-48 w-48 animate-pulse drop-shadow-[0_0_32px_rgba(0,200,255,0.8)]"
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

      {/* Glowing divider */}
      <div
        className="relative z-10 h-px mx-auto"
        style={{
          background:
            "linear-gradient(to right, transparent, oklch(0.65 0.25 220 / 0.6), oklch(0.7 0.28 160 / 0.6), transparent)",
          maxWidth: "800px",
        }}
      />

      {/* Tabs Section */}
      <section
        className="relative py-20 z-10"
        style={{
          background:
            "linear-gradient(to bottom, oklch(0.12 0.02 240) 0%, oklch(0.14 0.03 240) 50%, oklch(0.12 0.02 240) 100%)",
        }}
      >
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.65 0.25 220 / 0.04) 1px, transparent 1px), linear-gradient(90deg, oklch(0.65 0.25 220 / 0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-4">
            <span
              className="inline-block text-xs font-mono tracking-widest uppercase mb-3"
              style={{ color: "oklch(0.7 0.28 160)" }}
            >
              [ THREAT INTELLIGENCE SUITE ]
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 cyber-glow">
            Explore Truth-Lens
          </h2>

          <Tabs defaultValue="features" className="w-full max-w-4xl mx-auto">
            <TabsList
              className="flex w-full mb-8 bg-card/60 border p-1 h-auto gap-1"
              style={{ borderColor: "oklch(0.65 0.25 220 / 0.3)" }}
              data-ocid="landing.tabs"
            >
              <TabsTrigger
                value="features"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-mono text-sm"
                data-ocid="landing.features.tab"
              >
                <Zap className="h-4 w-4" /> Features
              </TabsTrigger>
              <TabsTrigger
                value="scanner"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-mono text-sm"
                data-ocid="landing.scanner.tab"
              >
                <ScanLine className="h-4 w-4" /> Scanner
              </TabsTrigger>
              <TabsTrigger
                value="howit"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-mono text-sm"
                data-ocid="landing.howit.tab"
              >
                <Shield className="h-4 w-4" /> How It Works
              </TabsTrigger>
              <TabsTrigger
                value="about"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-mono text-sm"
                data-ocid="landing.about.tab"
              >
                <Info className="h-4 w-4" /> About
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="features"
              className="mt-0"
              data-ocid="landing.features.panel"
            >
              <FeaturesGrid />
            </TabsContent>

            <TabsContent
              value="scanner"
              className="mt-0"
              data-ocid="landing.scanner.panel"
            >
              <div
                className="rounded-xl border p-8 text-center"
                style={{
                  borderColor: "oklch(0.65 0.25 220 / 0.3)",
                  background: "oklch(0.13 0.025 240 / 0.8)",
                }}
              >
                <ScanLine
                  className="h-14 w-14 mx-auto mb-4"
                  style={{
                    color: "oklch(0.65 0.25 220)",
                    filter: "drop-shadow(0 0 12px oklch(0.65 0.25 220 / 0.6))",
                  }}
                />
                <h3 className="text-2xl font-bold mb-3 cyber-glow">
                  URL Scanner
                </h3>
                <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                  Submit any URL or suspicious text to scan against multiple
                  threat databases including Google Safe Browsing, VirusTotal,
                  and PhishTank. Get instant verdicts: Safe, Suspicious, or
                  Phishing.
                </p>
                <ul className="text-left max-w-sm mx-auto space-y-2 mb-6 text-sm text-muted-foreground font-mono">
                  <li className="flex items-center gap-2">
                    <span style={{ color: "oklch(0.7 0.28 160)" }}>▸</span>{" "}
                    IP-based URL detection
                  </li>
                  <li className="flex items-center gap-2">
                    <span style={{ color: "oklch(0.7 0.28 160)" }}>▸</span>{" "}
                    Phishing keyword analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <span style={{ color: "oklch(0.7 0.28 160)" }}>▸</span> Long
                    URL flagging
                  </li>
                  <li className="flex items-center gap-2">
                    <span style={{ color: "oklch(0.7 0.28 160)" }}>▸</span>{" "}
                    Trust score calculation
                  </li>
                </ul>
                <Button
                  onClick={handleGetStarted}
                  className="bg-primary hover:bg-primary/90 shadow-cyber-glow"
                  data-ocid="landing.scanner_tab.primary_button"
                >
                  Launch Scanner <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent
              value="howit"
              className="mt-0"
              data-ocid="landing.howit.panel"
            >
              <div
                className="rounded-xl border p-8"
                style={{
                  borderColor: "oklch(0.65 0.25 220 / 0.3)",
                  background: "oklch(0.13 0.025 240 / 0.8)",
                }}
              >
                <h3 className="text-2xl font-bold mb-6 text-center cyber-glow">
                  How Truth-Lens Works
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      step: "01",
                      title: "Submit URL",
                      desc: "Enter any suspicious URL or paste text content you want to verify for threats.",
                    },
                    {
                      step: "02",
                      title: "Multi-API Scan",
                      desc: "Truth-Lens checks the input against Google Safe Browsing, VirusTotal, and PhishTank databases simultaneously.",
                    },
                    {
                      step: "03",
                      title: "Verdict & Score",
                      desc: "Receive a trust score and a verdict -- Safe, Suspicious, or Phishing -- with details from each source.",
                    },
                  ].map((item) => (
                    <div key={item.step} className="text-center">
                      <div
                        className="text-4xl font-bold font-mono mb-3"
                        style={{ color: "oklch(0.65 0.25 220)" }}
                      >
                        {item.step}
                      </div>
                      <h4 className="font-semibold text-lg mb-2">
                        {item.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value="about"
              className="mt-0"
              data-ocid="landing.about.panel"
            >
              <div
                className="rounded-xl border p-8"
                style={{
                  borderColor: "oklch(0.65 0.25 220 / 0.3)",
                  background: "oklch(0.13 0.025 240 / 0.8)",
                }}
              >
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <img
                    src="/assets/generated/truth-lens-logo-transparent.dim_256x256.png"
                    alt="Truth-Lens Logo"
                    className="h-40 w-40 drop-shadow-[0_0_20px_rgba(0,200,255,0.6)] flex-shrink-0"
                  />
                  <div>
                    <h3 className="text-2xl font-bold mb-3 cyber-glow">
                      About Truth-Lens
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Truth-Lens is an AI-powered cybersecurity tool built to
                      help users identify phishing links, malicious URLs, and
                      online fraud. It combines intelligent pattern detection
                      with real-time threat database lookups to deliver fast,
                      accurate verdicts.
                    </p>
                    <p className="text-muted-foreground mb-4">
                      Built on the Internet Computer (ICP), Truth-Lens ensures
                      your scan history and data are stored securely on-chain
                      with no centralized server vulnerabilities.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {[
                        "ICP Blockchain",
                        "Google Safe Browsing",
                        "VirusTotal",
                        "PhishTank",
                        "Motoko Backend",
                      ].map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-full text-xs font-mono border"
                          style={{
                            borderColor: "oklch(0.65 0.25 220 / 0.4)",
                            color: "oklch(0.65 0.25 220)",
                            background: "oklch(0.65 0.25 220 / 0.08)",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Glowing divider */}
      <div
        className="relative z-10 h-px mx-auto"
        style={{
          background:
            "linear-gradient(to right, transparent, oklch(0.7 0.28 160 / 0.6), oklch(0.65 0.25 220 / 0.6), transparent)",
          maxWidth: "800px",
        }}
      />

      {/* CTA Section */}
      <section
        className="relative py-24 z-10 overflow-hidden"
        style={{
          background:
            "linear-gradient(to bottom, oklch(0.12 0.02 240), oklch(0.10 0.03 240))",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 50%, oklch(0.65 0.25 220 / 0.07) 0%, transparent 70%)",
          }}
        />
        <div className="container mx-auto px-4 text-center relative">
          <div className="flex justify-center mb-6">
            <Shield
              className="h-12 w-12"
              style={{
                color: "oklch(0.7 0.28 160)",
                filter: "drop-shadow(0 0 12px oklch(0.7 0.28 160 / 0.6))",
              }}
            />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 cyber-glow">
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

          <div className="mt-10">
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors font-mono"
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
