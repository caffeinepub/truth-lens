import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { LogIn, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import ScanForm from "../components/ScanForm";
import type { CurrentUser } from "../utils/userAuth";
import { getCurrentUser } from "../utils/userAuth";

export default function ScanDashboard() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(
    getCurrentUser(),
  );

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  if (!currentUser) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <Shield className="h-16 w-16 text-primary mx-auto mb-4 cyber-glow" />
          <h2 className="text-2xl font-bold mb-4">Login Required</h2>
          <p className="text-muted-foreground mb-6">
            Please sign in to access the scan dashboard and analyze URLs.
          </p>
          <div className="flex gap-3 justify-center">
            <Link to="/login">
              <Button
                className="bg-primary hover:bg-primary/90 shadow-cyber-glow gap-1.5"
                data-ocid="scan.login.button"
              >
                <LogIn className="h-4 w-4" /> Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button
                variant="outline"
                className="border-primary/40 hover:bg-primary/10"
                data-ocid="scan.register.button"
              >
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 cyber-glow">
            Scan Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Welcome back,{" "}
            <span className="text-foreground font-medium">
              {currentUser.name}
            </span>
            . Enter a suspicious URL or paste text content to analyze for
            potential threats.
          </p>
        </div>
        <ScanForm />
      </div>
    </div>
  );
}
