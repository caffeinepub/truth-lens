import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { LogIn, ScanSearch } from "lucide-react";
import ScanForm from "../components/ScanForm";
import { getCurrentUser } from "../utils/userAuth";

export default function ScanDashboard() {
  const user = getCurrentUser();
  return (
    <div
      className="relative min-h-[80vh] flex items-center justify-center px-4 py-12"
      style={{
        backgroundImage: "url(/assets/generated/hero-bg.dim_1920x1080.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-background/85" />
      <div className="relative z-10 w-full max-w-2xl">
        <div className="text-center mb-10">
          <ScanSearch className="h-12 w-12 text-primary mx-auto mb-4 drop-shadow-[0_0_10px_oklch(var(--primary)/0.7)]" />
          <h1 className="text-4xl font-bold cyber-glow mb-2">URL Scanner</h1>
          <p className="text-muted-foreground">
            Enter any suspicious URL or text to analyze for phishing and fraud.
          </p>
        </div>
        {user ? (
          <div className="rounded-xl border border-primary/20 bg-card/60 backdrop-blur-sm p-6">
            <ScanForm />
          </div>
        ) : (
          <div
            className="rounded-xl border border-primary/20 bg-card/60 backdrop-blur-sm p-10 text-center"
            data-ocid="scan.empty_state"
          >
            <LogIn className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Login Required</h2>
            <p className="text-muted-foreground mb-6">
              Please sign in to use the URL scanner.
            </p>
            <div className="flex gap-3 justify-center">
              <Link to="/login">
                <Button
                  className="bg-primary hover:bg-primary/90 shadow-cyber-glow"
                  data-ocid="scan.login.button"
                >
                  <LogIn className="mr-2 h-4 w-4" /> Login
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  variant="outline"
                  className="border-primary/40 hover:border-primary"
                  data-ocid="scan.register.button"
                >
                  Register
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
