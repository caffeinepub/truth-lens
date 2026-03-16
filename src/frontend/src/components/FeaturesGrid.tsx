import { ChevronDown } from "lucide-react";
import { useState } from "react";

const FEATURES = [
  {
    icon: "/assets/generated/icon-scan-transparent.dim_128x128.png",
    title: "URL Scanner",
    description:
      "Multi-layered URL scanning to detect phishing links before they harm you.",
    details: [
      "Google Safe Browsing database",
      "VirusTotal 70+ antivirus engines",
      "PhishTank phishing repository",
      "IP-based URL detection",
    ],
  },
  {
    icon: "/assets/generated/icon-shield-transparent.dim_128x128.png",
    title: "Real-time Protection",
    description:
      "Instant threat analysis powered by AI and multiple security APIs.",
    details: [
      "Simultaneous multi-API scanning",
      "Sub-second verdict delivery",
      "Continuous database updates",
      "Heuristic detection",
    ],
  },
  {
    icon: "/assets/generated/icon-shield-transparent.dim_128x128.png",
    title: "Trust Score",
    description:
      "A clear 0-100 trust score so you know exactly how safe a URL is.",
    details: [
      "Transparent scoring algorithm",
      "Color-coded risk levels",
      "Breakdown per security service",
      "Confidence percentage per source",
    ],
  },
  {
    icon: "/assets/generated/icon-scan-transparent.dim_128x128.png",
    title: "Multi-API Analysis",
    description:
      "Cross-validation from Google Safe Browsing, VirusTotal, and PhishTank.",
    details: [
      "3-source consensus verdict",
      "Reduces false positives",
      "Enterprise-grade intelligence",
      "Audit-ready scan history",
    ],
  },
];

export default function FeaturesGrid() {
  const [expanded, setExpanded] = useState<number | null>(null);
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {FEATURES.map((f, i) => (
        // biome-ignore lint/a11y/useKeyWithClickEvents: card click is supplementary, button inside handles keyboard
        <div
          key={f.title}
          className="group rounded-xl border border-primary/20 bg-card/50 backdrop-blur-sm p-5 transition-all duration-300 hover:border-primary/50 hover:shadow-cyber-glow cursor-pointer"
          onClick={() => setExpanded(expanded === i ? null : i)}
          data-ocid={`features.card.${i + 1}`}
        >
          <div className="relative mb-4 w-16 h-16 mx-auto">
            <img
              src={f.icon}
              alt={f.title}
              className="w-16 h-16 object-contain drop-shadow-[0_0_8px_oklch(var(--primary)/0.6)] transition-transform group-hover:scale-110"
            />
          </div>
          <h3 className="font-semibold text-center mb-2">{f.title}</h3>
          <p className="text-sm text-muted-foreground text-center">
            {f.description}
          </p>
          <div className="flex justify-center mt-3">
            <button
              type="button"
              className="flex items-center gap-1 text-xs text-primary hover:text-accent transition-colors"
              data-ocid={`features.toggle.${i + 1}`}
            >
              {expanded === i ? "Hide details" : "Show details"}
              <ChevronDown
                className={`h-3 w-3 transition-transform duration-200 ${expanded === i ? "rotate-180" : ""}`}
              />
            </button>
          </div>
          {expanded === i && (
            <ul className="mt-3 space-y-1 border-t border-border/40 pt-3">
              {f.details.map((d) => (
                <li
                  key={d}
                  className="flex items-start gap-2 text-xs text-muted-foreground"
                >
                  <span className="text-accent mt-0.5">&#9656;</span>
                  {d}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
