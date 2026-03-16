import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useGetSystemStats } from "../../hooks/useQueries";

function DonutChart({
  safe,
  suspicious,
  phishing,
}: { safe: number; suspicious: number; phishing: number }) {
  const total = safe + suspicious + phishing || 1;
  const r = 50;
  const circ = 2 * Math.PI * r;
  const safeSlice = (safe / total) * circ;
  const suspSlice = (suspicious / total) * circ;
  const phishSlice = (phishing / total) * circ;
  return (
    <div className="flex items-center gap-6">
      <svg
        width="140"
        height="140"
        viewBox="0 0 140 140"
        role="img"
        aria-label="Verdict breakdown donut chart"
      >
        <title>
          Verdict breakdown: Safe {safe}, Suspicious {suspicious}, Phishing{" "}
          {phishing}
        </title>
        <circle
          cx="70"
          cy="70"
          r={r}
          fill="none"
          stroke="oklch(var(--border))"
          strokeWidth="20"
        />
        {safe > 0 && (
          <circle
            cx="70"
            cy="70"
            r={r}
            fill="none"
            stroke="oklch(var(--accent))"
            strokeWidth="20"
            strokeDasharray={`${safeSlice} ${circ - safeSlice}`}
            strokeDashoffset={0}
            transform="rotate(-90 70 70)"
          />
        )}
        {suspicious > 0 && (
          <circle
            cx="70"
            cy="70"
            r={r}
            fill="none"
            stroke="#eab308"
            strokeWidth="20"
            strokeDasharray={`${suspSlice} ${circ - suspSlice}`}
            strokeDashoffset={-(circ - safeSlice)}
            transform="rotate(-90 70 70)"
          />
        )}
        {phishing > 0 && (
          <circle
            cx="70"
            cy="70"
            r={r}
            fill="none"
            stroke="oklch(var(--destructive))"
            strokeWidth="20"
            strokeDasharray={`${phishSlice} ${circ - phishSlice}`}
            strokeDashoffset={-(circ - safeSlice - suspSlice)}
            transform="rotate(-90 70 70)"
          />
        )}
        <text
          x="70"
          y="74"
          textAnchor="middle"
          fill="currentColor"
          fontSize="12"
        >
          {total} scans
        </text>
      </svg>
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-accent" />
          <span>Safe - {safe}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-yellow-500" />
          <span>Suspicious - {suspicious}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-destructive" />
          <span>Phishing - {phishing}</span>
        </div>
      </div>
    </div>
  );
}

function BarChart({
  data,
}: { data: { label: string; value: number; color: string }[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="space-y-3">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground w-20 shrink-0">
            {d.label}
          </span>
          <div className="flex-1 h-5 rounded-full bg-muted/30 overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${(d.value / max) * 100}%`,
                background: d.color,
              }}
            />
          </div>
          <span className="text-xs font-mono w-8 text-right">{d.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsTab() {
  const { data: stats, isLoading, error } = useGetSystemStats();
  if (isLoading)
    return (
      <div
        className="flex items-center justify-center py-12"
        data-ocid="analytics.loading_state"
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  if (error || !stats)
    return (
      <Alert variant="destructive" data-ocid="analytics.error_state">
        <AlertDescription>
          Failed to load analytics. Ensure you are logged in via Internet
          Identity.
        </AlertDescription>
      </Alert>
    );

  const safe = Number(stats.safeCount);
  const suspicious = Number(stats.suspiciousCount);
  const phishing = Number(stats.phishingCount);
  const total = Number(stats.totalScans);
  const barData = [
    { label: "Safe", value: safe, color: "oklch(var(--accent))" },
    { label: "Suspicious", value: suspicious, color: "#eab308" },
    { label: "Phishing", value: phishing, color: "oklch(var(--destructive))" },
    { label: "Total", value: total, color: "oklch(var(--primary))" },
  ];
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="bg-card/40 cyber-border">
        <CardHeader>
          <CardTitle className="text-base">Verdict Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <DonutChart safe={safe} suspicious={suspicious} phishing={phishing} />
        </CardContent>
      </Card>
      <Card className="bg-card/40 cyber-border">
        <CardHeader>
          <CardTitle className="text-base">Scan Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart data={barData} />
        </CardContent>
      </Card>
    </div>
  );
}
