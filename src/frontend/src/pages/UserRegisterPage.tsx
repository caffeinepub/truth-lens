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
import { AlertCircle, Eye, EyeOff, Loader2, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { getCurrentUser, loginUser, registerUser } from "../utils/userAuth";

export default function UserRegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getCurrentUser()) navigate({ to: "/profile" });
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPw) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const result = registerUser(name.trim(), username.trim(), password);
      if ("ok" in result) {
        loginUser(username.trim(), password);
        window.dispatchEvent(new Event("tl-auth-change"));
        navigate({ to: "/profile" });
      } else {
        setError(result.err);
        setLoading(false);
      }
    }, 300);
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
      <div className="absolute inset-0 bg-background/80" />
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <img
            src="/assets/generated/logo-transparent.dim_256x256.png"
            alt="Truth-Lens"
            className="h-20 w-20 mx-auto mb-4 drop-shadow-[0_0_16px_oklch(var(--primary)/0.7)]"
          />
          <h1 className="text-3xl font-bold cyber-glow">Create Account</h1>
          <p className="text-muted-foreground mt-1">
            Join Truth-Lens to start scanning URLs
          </p>
        </div>
        <Card className="cyber-border bg-card/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>
              Create your free account in seconds.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reg-name">Full Name</Label>
                <Input
                  id="reg-name"
                  placeholder="Kiran Manvi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="cyber-border bg-background/50"
                  disabled={loading}
                  data-ocid="register.name.input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-username">Username</Label>
                <Input
                  id="reg-username"
                  placeholder="kiran_manvi"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="cyber-border bg-background/50"
                  disabled={loading}
                  autoComplete="username"
                  data-ocid="register.input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-password">Password</Label>
                <div className="relative">
                  <Input
                    id="reg-password"
                    type={showPw ? "text" : "password"}
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="cyber-border bg-background/50 pr-10"
                    disabled={loading}
                    autoComplete="new-password"
                    data-ocid="register.password.input"
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
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Repeat password"
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  className="cyber-border bg-background/50"
                  disabled={loading}
                  autoComplete="new-password"
                  data-ocid="register.confirm.input"
                />
              </div>
              {error && (
                <Alert variant="destructive" data-ocid="register.error_state">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button
                type="submit"
                size="lg"
                disabled={
                  loading ||
                  !name.trim() ||
                  !username.trim() ||
                  !password.trim() ||
                  !confirmPw.trim()
                }
                className="w-full bg-primary hover:bg-primary/90 shadow-cyber-glow"
                data-ocid="register.submit_button"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Creating...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" /> Create Account
                  </>
                )}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary hover:underline"
                  data-ocid="register.login.link"
                >
                  Sign in here
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
