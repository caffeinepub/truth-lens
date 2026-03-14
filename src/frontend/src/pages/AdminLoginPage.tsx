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
import { AlertCircle, Eye, EyeOff, Lock, Shield, Terminal } from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [terminalText, setTerminalText] = useState("");

  const terminalLines = [
    "[SYS] Truth-Lens Security Core v3.7",
    "[SYS] Initializing admin auth module...",
    "[SYS] Encryption layer: AES-256 ✓",
    "[SYS] Identity verification: READY",
    "[SYS] Awaiting administrator credentials...",
  ];

  useEffect(() => {
    let lineIdx = 0;
    let charIdx = 0;
    let text = "";
    const interval = setInterval(() => {
      if (lineIdx >= terminalLines.length) {
        clearInterval(interval);
        return;
      }
      const line = terminalLines[lineIdx];
      if (charIdx < line.length) {
        text += line[charIdx];
        charIdx++;
      } else {
        text += "\n";
        lineIdx++;
        charIdx = 0;
      }
      setTerminalText(text);
    }, 18);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    setTimeout(() => {
      if (username === "KiranManvi@2023" && password === "Kirankumar@2004") {
        localStorage.setItem("isAdminLoggedIn", "true");
        navigate({ to: "/admin/dashboard" });
      } else {
        setError(
          "Invalid credentials. Please check your username and password.",
        );
        setIsLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(oklch(0.65 0.25 220 / 0.4) 1px, transparent 1px),
              linear-gradient(90deg, oklch(0.65 0.25 220 / 0.4) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ background: "oklch(0.65 0.25 220)" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-10"
          style={{ background: "oklch(0.7 0.28 160)" }}
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative inline-flex items-center justify-center mb-5">
            <div
              className="absolute inset-0 rounded-full blur-xl opacity-40"
              style={{
                background: "oklch(0.65 0.25 220)",
                transform: "scale(1.5)",
              }}
            />
            <div
              className="relative flex items-center justify-center w-20 h-20 rounded-full border"
              style={{
                borderColor: "oklch(0.65 0.25 220 / 0.5)",
                background: "oklch(0.16 0.03 240)",
                boxShadow:
                  "0 0 30px oklch(0.65 0.25 220 / 0.3), inset 0 0 20px oklch(0.65 0.25 220 / 0.05)",
              }}
            >
              <Shield
                className="h-9 w-9"
                style={{ color: "oklch(0.65 0.25 220)" }}
              />
              <Lock
                className="h-4 w-4 absolute -bottom-1 -right-1 rounded-full p-0.5"
                style={{
                  background: "oklch(0.16 0.03 240)",
                  color: "oklch(0.7 0.28 160)",
                }}
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-1 cyber-glow tracking-tight font-mono">
            ADMIN ACCESS
          </h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span
              className="h-px flex-1 max-w-[60px]"
              style={{ background: "oklch(0.65 0.25 220 / 0.4)" }}
            />
            <p className="text-xs text-muted-foreground tracking-widest uppercase">
              Restricted Area
            </p>
            <span
              className="h-px flex-1 max-w-[60px]"
              style={{ background: "oklch(0.65 0.25 220 / 0.4)" }}
            />
          </div>
        </div>

        {/* Terminal block */}
        <div
          className="mb-5 rounded-md border p-3 font-mono text-xs leading-5"
          style={{
            borderColor: "oklch(0.7 0.28 160 / 0.3)",
            background: "oklch(0.1 0.02 240)",
            color: "oklch(0.7 0.28 160)",
            minHeight: "5rem",
            boxShadow: "0 0 16px oklch(0.7 0.28 160 / 0.1)",
          }}
        >
          <div
            className="flex items-center gap-1.5 mb-2 border-b pb-1.5"
            style={{ borderColor: "oklch(0.7 0.28 160 / 0.2)" }}
          >
            <Terminal className="h-3 w-3" />
            <span className="text-[10px] tracking-widest opacity-70">
              SYSTEM TERMINAL
            </span>
            <span className="ml-auto inline-block w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          </div>
          <pre className="whitespace-pre-wrap break-all">
            {terminalText}
            <span className="animate-pulse">█</span>
          </pre>
        </div>

        <Card
          className="cyber-border bg-card/50 backdrop-blur-sm"
          style={{ boxShadow: "0 0 40px oklch(0.65 0.25 220 / 0.15)" }}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Lock
                className="h-4 w-4"
                style={{ color: "oklch(0.65 0.25 220)" }}
              />
              Administrator Login
            </CardTitle>
            <CardDescription>
              Enter your credentials to access the secure dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="admin-username"
                  className="text-xs uppercase tracking-widest text-muted-foreground"
                >
                  Username
                </Label>
                <Input
                  id="admin-username"
                  type="text"
                  placeholder="admin@username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="cyber-border bg-background/50 font-mono"
                  disabled={isLoading}
                  autoComplete="username"
                  data-ocid="admin.login.input"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="admin-password"
                  className="text-xs uppercase tracking-widest text-muted-foreground"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="cyber-border bg-background/50 pr-10 font-mono"
                    disabled={isLoading}
                    autoComplete="current-password"
                    data-ocid="admin.password.input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
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
                disabled={isLoading || !username.trim() || !password.trim()}
                className="w-full shadow-cyber-glow font-mono tracking-widest uppercase text-sm"
                style={{
                  background: "oklch(0.65 0.25 220)",
                  color: "oklch(0.98 0 0)",
                }}
                data-ocid="admin.login.submit_button"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verifying Identity...
                  </span>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Authenticate
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground pt-1">
                Unauthorized access attempts are logged and monitored.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
