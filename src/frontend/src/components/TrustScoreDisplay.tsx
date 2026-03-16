import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Fish,
  Globe,
  Scan,
  ShieldCheck,
  ShieldX,
  TriangleAlert,
} from "lucide-react";

interface ApiSource {
  name: string;
  isSafe: boolean;
  detail: string;
  confidence: number;
}
interface Props {
  verdict: string;
  trustScore: number;
  apiSources: ApiSource[];
}

function VerdictBadge({ verdict }: { verdict: string }) {
  if (verdict === "Safe")
    return (
      <Badge className="bg-accent/20 text-accent border-accent/40 text-base px-4 py-1 gap-2">
        <ShieldCheck className="h-4 w-4" /> Safe
      </Badge>
    );
  if (verdict === "Suspicious")
    return (
      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/40 text-base px-4 py-1 gap-2">
        <TriangleAlert className="h-4 w-4" /> Suspicious
      </Badge>
    );
  return (
    <Badge className="bg-destructive/20 text-destructive border-destructive/40 text-base px-4 py-1 gap-2">
      <ShieldX className="h-4 w-4" /> Phishing
    </Badge>
  );
}

function ScoreRing({ score, verdict }: { score: number; verdict: string }) {
  const color =
    verdict === "Safe"
      ? "#22c55e"
      : verdict === "Suspicious"
        ? "#eab308"
        : "#ef4444";
  const r = 44;
  const circ = 2 * Math.PI * r;
  return (
    <div className="relative flex items-center justify-center">
      <svg
        width="120"
        height="120"
        className="-rotate-90"
        role="img"
        aria-label={`Trust score: ${score}`}
      >
        <title>Trust score ring: {score}/100</title>
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="oklch(var(--border))"
          strokeWidth="8"
        />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circ}
          strokeDashoffset={circ - (score / 100) * circ}
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 6px ${color})`,
            transition: "stroke-dashoffset 1s ease",
          }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-2xl font-bold font-mono" style={{ color }}>
          {score}
        </div>
        <div className="text-xs text-muted-foreground">Trust</div>
      </div>
    </div>
  );
}

export default function TrustScoreDisplay({
  verdict,
  trustScore,
  apiSources,
}: Props) {
  const icons: Record<string, React.ReactNode> = {
    "Google Safe Browsing": <Globe className="h-5 w-5" />,
    VirusTotal: <Scan className="h-5 w-5" />,
    PhishTank: <Fish className="h-5 w-5" />,
  };
  return (
    <div className="space-y-4">
      <Card className="cyber-border bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <ScoreRing score={trustScore} verdict={verdict} />
            <div className="flex-1 text-center sm:text-left">
              <p className="text-sm text-muted-foreground mb-2">
                Overall Verdict
              </p>
              <VerdictBadge verdict={verdict} />
              <p className="mt-3 text-sm text-muted-foreground">
                {verdict === "Safe"
                  ? "No threats detected. This URL appears to be safe."
                  : verdict === "Suspicious"
                    ? "Exercise caution. This URL shows suspicious characteristics."
                    : "High risk detected. Avoid visiting this URL."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-3 sm:grid-cols-3">
        {apiSources.map((src) => (
          <Card
            key={src.name}
            className={`bg-card/40 backdrop-blur-sm border ${src.isSafe ? "border-accent/30" : "border-destructive/30"}`}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <span
                  className={src.isSafe ? "text-accent" : "text-destructive"}
                >
                  {icons[src.name]}
                </span>
                {src.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{src.detail}</p>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-border">
                  <div
                    className="h-1.5 rounded-full transition-all"
                    style={{
                      width: `${src.confidence}%`,
                      background: src.isSafe
                        ? "oklch(var(--accent))"
                        : "oklch(var(--destructive))",
                    }}
                  />
                </div>
                <span className="text-xs font-mono text-muted-foreground">
                  {src.confidence}%
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
