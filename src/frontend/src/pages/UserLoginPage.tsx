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
import { Link, useNavigate } from "@tanstack/react-router";
import { AlertCircle, Eye, EyeOff, Lock, Shield } from "lucide-react";
import { useState } from "react";
import { loginUser } from "../utils/userAuth";

export default function UserLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    setTimeout(() => {
      const result = loginUser(username.trim(), password);
      if ("err" in result) {
        setError(result.err);
        setIsLoading(false);
      } else {
        navigate({ to: "/scan" });
      }
    }, 300);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Shield className="h-16 w-16 text-primary cyber-glow" />
              <Lock className="h-6 w-6 text-accent absolute -bottom-1 -right-1 bg-card rounded-full p-0.5" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2 cyber-glow">Welcome Back</h1>
          <p className="text-muted-foreground">
            Sign in to your Truth-Lens account
          </p>
        </div>

        <Card className="cyber-border shadow-cyber-glow bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>User Login</CardTitle>
            <CardDescription>
              Enter your credentials to access the scanner.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="cyber-border bg-background/50"
                  disabled={isLoading}
                  autoComplete="username"
                  data-ocid="login.input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="cyber-border bg-background/50 pr-10"
                    disabled={isLoading}
                    autoComplete="current-password"
                    data-ocid="login.password.input"
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
                <Alert variant="destructive" data-ocid="login.error_state">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                size="lg"
                disabled={isLoading || !username.trim() || !password.trim()}
                className="w-full bg-primary hover:bg-primary/90 shadow-cyber-glow"
                data-ocid="login.submit_button"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing In...
                  </span>
                ) : (
                  <>
                    <Shield className="mr-2 h-5 w-5" /> Sign In
                  </>
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground pt-2">
                Don&apos;t have an account?{" "}
                <Link
                  to="/register"
                  className="text-primary hover:underline"
                  data-ocid="login.register.link"
                >
                  Create one here
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
