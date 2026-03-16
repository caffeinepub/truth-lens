import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, ScanSearch } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useScanUrlOrText } from "../hooks/useQueries";

export default function ScanForm() {
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const scanMutation = useScanUrlOrText();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    try {
      const result = await scanMutation.mutateAsync(input.trim());
      sessionStorage.setItem(
        "lastScanResult",
        JSON.stringify({ result, input: input.trim() }),
      );
      navigate({ to: "/results" });
    } catch {
      toast.error("Scan failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="Enter a URL (https://suspicious-site.com) or paste text to analyze..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={4}
        className="cyber-border bg-card/50 font-mono text-sm resize-none focus-visible:ring-primary"
        disabled={scanMutation.isPending}
        data-ocid="scan.textarea"
      />
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-muted-foreground self-center">Try:</span>
        {[
          "https://secure-bank-login.verify-now.com",
          "https://google.com",
          "http://192.168.1.1/phishing",
        ].map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => setInput(ex)}
            className="text-xs px-2 py-1 rounded border border-border/50 hover:border-primary/50 hover:text-primary transition-colors font-mono"
          >
            {ex.length > 38 ? `${ex.slice(0, 38)}...` : ex}
          </button>
        ))}
      </div>
      <Button
        type="submit"
        size="lg"
        disabled={scanMutation.isPending || !input.trim()}
        className="w-full bg-primary hover:bg-primary/90 shadow-cyber-glow text-lg font-semibold"
        data-ocid="scan.submit_button"
      >
        {scanMutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing...
          </>
        ) : (
          <>
            <ScanSearch className="mr-2 h-5 w-5" /> Scan Now
          </>
        )}
      </Button>
      {scanMutation.isPending && (
        <div className="text-center" data-ocid="scan.loading_state">
          <p className="text-sm text-muted-foreground animate-pulse">
            Scanning with Google Safe Browsing, VirusTotal &amp; PhishTank...
          </p>
        </div>
      )}
    </form>
  );
}
