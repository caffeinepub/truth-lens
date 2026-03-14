import { Skeleton } from "@/components/ui/skeleton";
import { BarChart2 } from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useGetAllScanResults } from "../../hooks/useQueries";

const SAFE_COLOR = "#00c8a0";
const UNSAFE_COLOR = "#e05a4e";

export default function AnalyticsTab() {
  const { data: results, isLoading } = useGetAllScanResults();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-72 w-full" />
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="text-center py-20" data-ocid="analytics.empty_state">
        <BarChart2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">No scan data available yet.</p>
        <p className="text-xs text-muted-foreground mt-1">
          Perform scans to see analytics here.
        </p>
      </div>
    );
  }

  const safeCount = results.filter((r) => r.isSafe).length;
  const unsafeCount = results.length - safeCount;

  const pieData = [
    { name: "Safe", value: safeCount },
    { name: "Unsafe / Threat", value: unsafeCount },
  ];

  // Confidence score buckets: 0-39, 40-59, 60-79, 80-100
  const buckets = [
    { range: "0–39", count: 0 },
    { range: "40–59", count: 0 },
    { range: "60–79", count: 0 },
    { range: "80–100", count: 0 },
  ];
  for (const r of results) {
    const s = Number(r.confidenceScore);
    if (s < 40) buckets[0].count++;
    else if (s < 60) buckets[1].count++;
    else if (s < 80) buckets[2].count++;
    else buckets[3].count++;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Donut/Pie Chart */}
        <div className="rounded-lg border border-border/50 bg-card/30 p-5">
          <h3 className="text-sm font-semibold mb-4 font-mono uppercase tracking-widest text-muted-foreground">
            Verdict Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={3}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                <Cell fill={SAFE_COLOR} />
                <Cell fill={UNSAFE_COLOR} />
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "oklch(0.16 0.03 240)",
                  border: "1px solid oklch(0.25 0.05 240)",
                  borderRadius: "6px",
                  color: "oklch(0.95 0.05 220)",
                }}
              />
              <Legend
                formatter={(value) => (
                  <span
                    style={{ color: "oklch(0.7 0.05 220)", fontSize: "12px" }}
                  >
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-2">
            <div className="text-center">
              <p
                className="text-2xl font-bold font-mono"
                style={{ color: SAFE_COLOR }}
              >
                {safeCount}
              </p>
              <p className="text-xs text-muted-foreground">Safe</p>
            </div>
            <div className="w-px bg-border" />
            <div className="text-center">
              <p
                className="text-2xl font-bold font-mono"
                style={{ color: UNSAFE_COLOR }}
              >
                {unsafeCount}
              </p>
              <p className="text-xs text-muted-foreground">Threats</p>
            </div>
          </div>
        </div>

        {/* Confidence Distribution Bar Chart */}
        <div className="rounded-lg border border-border/50 bg-card/30 p-5">
          <h3 className="text-sm font-semibold mb-4 font-mono uppercase tracking-widest text-muted-foreground">
            Confidence Score Distribution
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={buckets}
              margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
            >
              <XAxis
                dataKey="range"
                tick={{ fill: "oklch(0.6 0.05 220)", fontSize: 11 }}
                axisLine={{ stroke: "oklch(0.25 0.05 240)" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "oklch(0.6 0.05 220)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  background: "oklch(0.16 0.03 240)",
                  border: "1px solid oklch(0.25 0.05 240)",
                  borderRadius: "6px",
                  color: "oklch(0.95 0.05 220)",
                }}
                cursor={{ fill: "oklch(0.65 0.25 220 / 0.08)" }}
              />
              <Bar
                dataKey="count"
                name="Scans"
                radius={[4, 4, 0, 0]}
                fill="oklch(0.65 0.25 220)"
              />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-center text-muted-foreground mt-2">
            Grouped by confidence score range
          </p>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        {(
          [
            {
              label: "Total Analyzed",
              value: results.length,
              color: "oklch(0.65 0.25 220)",
            },
            {
              label: "Avg Confidence",
              value: `${Math.round(results.reduce((acc, r) => acc + Number(r.confidenceScore), 0) / results.length)}%`,
              color: "oklch(0.7 0.28 160)",
            },
            {
              label: "Threat Rate",
              value: `${results.length > 0 ? Math.round((unsafeCount / results.length) * 100) : 0}%`,
              color:
                unsafeCount / results.length > 0.3
                  ? "oklch(0.6 0.25 25)"
                  : "oklch(0.7 0.28 160)",
            },
          ] as { label: string; value: string | number; color: string }[]
        ).map(({ label, value, color }) => (
          <div
            key={label}
            className="rounded-lg border p-4 text-center bg-card/30"
            style={{ borderColor: `${color}30` }}
          >
            <p className="text-2xl font-bold font-mono" style={{ color }}>
              {value}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
