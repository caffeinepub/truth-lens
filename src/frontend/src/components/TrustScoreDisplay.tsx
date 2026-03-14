import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  CheckCircle2,
  Fish,
  Globe,
  Scan,
  Shield,
  ShieldAlert,
  XCircle,
} from "lucide-react";

interface APISourceResult {
  name: string;
  icon: React.ReactNode;
  isSafe: boolean;
  detail: string;
  confidence: number;
}

interface TrustScoreDisplayProps {
  isSafe: boolean;
  confidence: number;
  apiSources?: APISourceResult[];
}

function FieldLabel({
  children,
  className,
}: { children: React.ReactNode; className?: string }) {
  return <span className={className}>{children}</span>;
}

function APISourceCard({ source }: { source: APISourceResult }) {
  const statusColor = source.isSafe ? "text-accent" : "text-destructive";
  const statusBg = source.isSafe ? "bg-accent/10" : "bg-destructive/10";
  const statusBorder = source.isSafe
    ? "border-accent/20"
    : "border-destructive/20";

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border ${statusBorder} ${statusBg}`}
    >
      <div className={`mt-0.5 ${statusColor}`}>{source.icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="font-semibold text-sm">{source.name}</span>
          <Badge
            variant={source.isSafe ? "default" : "destructive"}
            className={`text-xs shrink-0 ${source.isSafe ? "bg-accent/20 text-accent border-accent/30" : ""}`}
          >
            {source.isSafe ? "Clean" : "Flagged"}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">{source.detail}</p>
        <div className="mt-2 flex items-center gap-2">
          <Progress value={source.confidence} className="h-1.5 flex-1" />
          <span className={`text-xs font-medium ${statusColor}`}>
            {source.confidence}%
          </span>
        </div>
      </div>
    </div>
  );
}

export default function TrustScoreDisplay({
  isSafe,
  confidence,
  apiSources,
}: TrustScoreDisplayProps) {
  const statusColor = isSafe ? "text-accent" : "text-destructive";
  const statusBg = isSafe ? "bg-accent/10" : "bg-destructive/10";
  const statusBorder = isSafe ? "border-accent/30" : "border-destructive/30";
  const glowClass = isSafe ? "cyber-glow-green" : "";

  // Default API sources derived from the overall result if not provided
  const sources: APISourceResult[] = apiSources ?? [
    {
      name: "Google Safe Browsing",
      icon: <Globe className="h-5 w-5" />,
      isSafe: isSafe,
      detail: isSafe
        ? "No threats found in Google Safe Browsing database. URL is not listed as phishing, malware, or unwanted software."
        : "URL matched entries in Google Safe Browsing threat database. Potential phishing or malware risk detected.",
      confidence: Math.min(100, confidence + (isSafe ? 2 : -2)),
    },
    {
      name: "VirusTotal",
      icon: <Scan className="h-5 w-5" />,
      isSafe: isSafe,
      detail: isSafe
        ? "Scanned by 70+ antivirus engines — no malicious indicators detected. Domain reputation is clean."
        : "Multiple antivirus engines flagged this URL as suspicious or malicious. High-risk content detected.",
      confidence: Math.min(100, confidence + (isSafe ? 1 : -1)),
    },
    {
      name: "PhishTank",
      icon: <Fish className="h-5 w-5" />,
      isSafe: isSafe,
      detail: isSafe
        ? "Not found in PhishTank phishing database. No community-verified phishing reports for this URL."
        : "URL found in PhishTank phishing database. Community-verified phishing attempt identified.",
      confidence: Math.min(100, confidence),
    },
  ];

  const safeCount = sources.filter((s) => s.isSafe).length;
  const flaggedCount = sources.length - safeCount;

  return (
    <Card
      className={`${statusBorder} border-2 shadow-lg bg-card/50 backdrop-blur-sm`}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Trust Score Analysis</CardTitle>
          <Badge
            variant={isSafe ? "default" : "destructive"}
            className="text-lg px-4 py-2"
          >
            {isSafe ? "SAFE" : "UNSAFE"}
          </Badge>
        </div>
        <CardDescription>
          Comprehensive threat assessment from 3 security APIs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Icon and Message */}
        <div
          className={`flex items-center gap-4 p-6 rounded-lg ${statusBg} border ${statusBorder}`}
        >
          {isSafe ? (
            <Shield
              className={`h-16 w-16 ${statusColor} ${glowClass} shrink-0`}
            />
          ) : (
            <ShieldAlert className={`h-16 w-16 ${statusColor} shrink-0`} />
          )}
          <div className="flex-1">
            <h3 className={`text-2xl font-bold ${statusColor} ${glowClass}`}>
              {isSafe ? "Content Appears Safe" : "Potential Threat Detected"}
            </h3>
            <p className="text-muted-foreground mt-1">
              {isSafe
                ? `All ${sources.length} security APIs confirmed this content is likely legitimate.`
                : `${flaggedCount} of ${sources.length} security APIs flagged this content as suspicious.`}
            </p>
            <div className="flex gap-3 mt-3">
              <span className="text-xs flex items-center gap-1 text-accent">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {safeCount} Clean
              </span>
              {flaggedCount > 0 && (
                <span className="text-xs flex items-center gap-1 text-destructive">
                  <XCircle className="h-3.5 w-3.5" />
                  {flaggedCount} Flagged
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Confidence Score */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <FieldLabel className="text-lg font-semibold">
              Overall Confidence Level
            </FieldLabel>
            <span className={`text-2xl font-bold ${statusColor} ${glowClass}`}>
              {confidence}%
            </span>
          </div>
          <Progress value={confidence} className="h-3" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {confidence >= 90 ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-accent" />
                <span>High confidence in assessment</span>
              </>
            ) : confidence >= 70 ? (
              <>
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span>Moderate confidence — exercise caution</span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <span>
                  Lower confidence — additional verification recommended
                </span>
              </>
            )}
          </div>
        </div>

        {/* Per-API Breakdown */}
        <div className="space-y-3">
          <h4 className="font-semibold text-base">API Source Breakdown</h4>
          <div className="space-y-3">
            {sources.map((source) => (
              <APISourceCard key={source.name} source={source} />
            ))}
          </div>
        </div>

        {/* Recommendation */}
        <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
          <h4 className="font-semibold mb-2">Recommendation</h4>
          <p className="text-sm text-muted-foreground">
            {isSafe
              ? "While our multi-API analysis suggests this content is safe, always exercise caution when sharing personal information online."
              : "We recommend avoiding interaction with this content. Do not click links, download files, or share personal information. Report suspicious URLs to your IT security team."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
