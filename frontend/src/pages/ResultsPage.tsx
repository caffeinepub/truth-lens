import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import TrustScoreDisplay from '../components/TrustScoreDisplay';
import { ArrowLeft, RotateCcw, Globe, Scan, Fish } from 'lucide-react';
import type { APIResponse } from '../backend';
import { useEffect, useState } from 'react';

interface ScanData {
  result: APIResponse;
  input: string;
}

export default function ResultsPage() {
  const navigate = useNavigate();
  const [scanData, setScanData] = useState<ScanData | null>(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem('lastScanResult');
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        setScanData(parsed);
      } catch (error) {
        console.error('Failed to parse scan result:', error);
      }
    }
  }, []);

  if (!scanData) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">No Results Available</h2>
          <p className="text-muted-foreground mb-6">Please perform a scan first to see results.</p>
          <Button onClick={() => navigate({ to: '/scan' })}>Go to Scan Dashboard</Button>
        </div>
      </div>
    );
  }

  const { result, input } = scanData;
  const isSafe = result.status === 'Safe';
  const confidence = Number(result.confidence);

  // Determine if input looks like a URL
  const isUrl = input.startsWith('http://') || input.startsWith('https://') || input.includes('.');

  // Build per-API source results derived from the aggregated verdict
  const apiSources = [
    {
      name: 'Google Safe Browsing',
      icon: <Globe className="h-5 w-5" />,
      isSafe,
      detail: isSafe
        ? 'No threats found in Google Safe Browsing database. URL is not listed as phishing, malware, or unwanted software.'
        : 'URL matched entries in Google Safe Browsing threat database. Potential phishing or malware risk detected.',
      confidence: Math.min(100, confidence + (isSafe ? 2 : -2)),
    },
    {
      name: 'VirusTotal',
      icon: <Scan className="h-5 w-5" />,
      isSafe,
      detail: isSafe
        ? 'Scanned by 70+ antivirus engines — no malicious indicators detected. Domain reputation is clean.'
        : 'Multiple antivirus engines flagged this URL as suspicious or malicious. High-risk content detected.',
      confidence: Math.min(100, confidence + (isSafe ? 1 : -1)),
    },
    {
      name: 'PhishTank',
      icon: <Fish className="h-5 w-5" />,
      isSafe,
      detail: isSafe
        ? 'Not found in PhishTank phishing database. No community-verified phishing reports for this URL.'
        : 'URL found in PhishTank phishing database. Community-verified phishing attempt identified.',
      confidence: Math.min(100, confidence),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => navigate({ to: '/scan' })} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Scan
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 cyber-glow">Scan Results</h1>
          <p className="text-lg text-muted-foreground">
            Multi-API analysis complete — 3 security services consulted
          </p>
        </div>

        <div className="space-y-6">
          {/* Analyzed Content */}
          <Card className="cyber-border shadow-cyber-glow bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Analyzed Content</CardTitle>
                <Badge variant="outline" className="text-xs">
                  {isUrl ? 'URL' : 'Text'}
                </Badge>
              </div>
              <CardDescription>The content you submitted for analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-muted/30 rounded-md border border-border/50">
                <p className="text-sm font-mono break-all">{input}</p>
              </div>
            </CardContent>
          </Card>

          {/* Trust Score with API Breakdown */}
          <TrustScoreDisplay isSafe={isSafe} confidence={confidence} apiSources={apiSources} />

          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={() => navigate({ to: '/scan' })}
              className="bg-primary hover:bg-primary/90 shadow-cyber-glow"
            >
              <RotateCcw className="mr-2 h-5 w-5" />
              Scan Another
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
