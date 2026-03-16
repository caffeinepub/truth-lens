import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { AlertCircle, Eye, EyeOff, Loader2, Lock, Shield } from "lucide-react";
import { useEffect, useState } from "react";

const ADMIN_USERNAME = "KiranManvi@2023";
const ADMIN_PASSWORD = "Kirankumar@2004";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("isAdminLoggedIn") === "true")
      navigate({ to: "/admin/dashboard" });
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        localStorage.setItem("isAdminLoggedIn", "true");
        navigate({ to: "/admin/dashboard" });
      } else {
        setError("Invalid credentials. Check your username and password.");
        setLoading(false);
      }
    }, 400);
  };

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
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="relative inline-block mb-4">
            <img
              src="/assets/generated/icon-shield-transparent.dim_128x128.png"
              alt="Admin"
              className="h-20 w-20 drop-shadow-[0_0_16px_oklch(var(--primary)/0.7)]"
            />
            <Lock className="h-6 w-6 text-accent absolute -bottom-1 -right-1 bg-card rounded-full p-1" />
          </div>
          <h1 className="text-3xl font-bold cyber-glow">Admin Access</h1>
          <p className="text-muted-foreground mt-1">
            Restricted area - authorized administrators only
          </p>
        </div>
        <Card className="cyber-border bg-card/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Administrator Login</CardTitle>
            <CardDescription>
              Enter your administrator credentials.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-user">Username</Label>
                <Input
                  id="admin-user"
                  type="text"
                  placeholder="Admin username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="cyber-border bg-background/50"
                  disabled={loading}
                  autoComplete="username"
                  data-ocid="admin.login.input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-pass">Password</Label>
                <div className="relative">
                  <Input
                    id="admin-pass"
                    type={showPw ? "text" : "password"}
                    placeholder="Admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="cyber-border bg-background/50 pr-10"
                    disabled={loading}
                    autoComplete="current-password"
                    data-ocid="admin.login.password.input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showPw ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              {error && (
                <Alert
                  variant="destructive"
                  data-ocid="admin.login.error_state"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button
                type="submit"
                size="lg"
                disabled={loading || !username.trim() || !password.trim()}
                className="w-full bg-primary hover:bg-primary/90 shadow-cyber-glow"
                data-ocid="admin.login.submit_button"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Verifying...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" /> Access Admin Dashboard
                  </>
                )}
              </Button>
              <p className="text-xs text-center text-muted-foreground pt-2">
                Access restricted to authorized administrators only.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
