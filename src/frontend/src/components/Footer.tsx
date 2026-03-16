import { Shield } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const utm = `utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;
  return (
    <footer className="border-t border-primary/20 bg-background/60 py-8">
      <div className="container mx-auto px-4 flex flex-col items-center gap-3 text-center">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <span className="font-semibold cyber-glow">Truth-Lens</span>
        </div>
        <p className="text-xs text-muted-foreground">
          AI-Powered Phishing &amp; Fraud Detection
        </p>
        <p className="text-xs text-muted-foreground/60">
          &copy; {year}. Built with &#10084;&#65039; using{" "}
          <a
            href={`https://caffeine.ai?${utm}`}
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-primary transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}
