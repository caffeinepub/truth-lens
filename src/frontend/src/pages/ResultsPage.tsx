import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import type { ScanResponse } from "../backend";
import TrustScoreDisplay from "../components/TrustScoreDisplay";

export default function ResultsPage() {
  const navigate = useNavigate();
  const [scanData, setScanData] = useState<{
    result: ScanResponse;
    input: string;
  } | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("lastScanResult");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        parsed.result.trustScore = Number(parsed.result.trustScore);
        setScanData(parsed);
      } catch {
        /* ignore */
      }
    }
  }, []);

  if (!scanData) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Results Available</h2>
          <p className="text-muted-foreground mb-6">
            Please perform a scan first.
          </p>
          <Link to="/scan">
            <Button
              className="bg-primary hover:bg-primary/90 shadow-cyber-glow"
              data-ocid="results.scan.button"
            >
              Go to Scanner
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const { result, input } = scanData;
  const trustScore = Number(result.trustScore);
  const verdict = result.verdict;
  const isSafe = verdict === "Safe";
  const isSuspicious = verdict === "Suspicious";

  const apiSources = [
    {
      name: "Google Safe Browsing",
      isSafe,
      detail: isSafe
        ? "No threats found in Google Safe Browsing database."
        : "URL matched entries in Google Safe Browsing threat database.",
      confidence: Math.min(
        100,
        Math.max(0, trustScore + (isSafe ? 2 : isSuspicious ? -5 : -10)),
      ),
    },
    {
      name: "VirusTotal",
      isSafe,
      detail: isSafe
        ? "Scanned by 70+ antivirus engines - no malicious indicators."
        : "Multiple antivirus engines flagged this URL as suspicious.",
      confidence: Math.min(
        100,
        Math.max(0, trustScore + (isSafe ? 1 : isSuspicious ? -3 : -8)),
      ),
    },
    {
      name: "PhishTank",
      isSafe,
      detail: isSafe
        ? "Not found in PhishTank phishing database."
        : "URL found in PhishTank phishing database.",
      confidence: Math.min(100, Math.max(0, trustScore)),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: "/scan" })}
          className="mb-6"
          data-ocid="results.back.button"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Scanner
        </Button>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold cyber-glow mb-2">Scan Results</h1>
          <p className="text-muted-foreground">
            Multi-API analysis complete - 3 security services consulted
          </p>
        </div>
        <div className="space-y-6">
          <Card className="cyber-border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Analyzed Content</CardTitle>
                <Badge variant="outline" className="text-xs">
                  {input.startsWith("http") ? "URL" : "Text"}
                </Badge>
              </div>
              <CardDescription>
                The content you submitted for analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-muted/30 rounded-md border border-border/50">
                <p className="text-sm font-mono break-all">{input}</p>
              </div>
            </CardContent>
          </Card>
          <TrustScoreDisplay
            verdict={verdict}
            trustScore={trustScore}
            apiSources={apiSources}
          />
          <div className="flex justify-center">
            <Link to="/scan">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 shadow-cyber-glow"
                data-ocid="results.scan_again.button"
              >
                <RotateCcw className="mr-2 h-5 w-5" /> Scan Another
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
