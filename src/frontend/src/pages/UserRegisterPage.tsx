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
import { AlertCircle, Eye, EyeOff, Shield, UserPlus } from "lucide-react";
import { useState } from "react";
import { loginUser, registerUser } from "../utils/userAuth";

export default function UserRegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !username.trim() || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const regResult = registerUser(name.trim(), username.trim(), password);
      if ("err" in regResult) {
        setError(regResult.err);
        setIsLoading(false);
        return;
      }
      loginUser(username.trim(), password);
      navigate({ to: "/profile" });
    }, 300);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Shield className="h-16 w-16 text-primary cyber-glow" />
              <UserPlus className="h-6 w-6 text-accent absolute -bottom-1 -right-1 bg-card rounded-full p-0.5" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2 cyber-glow">Create Account</h1>
          <p className="text-muted-foreground">
            Join Truth-Lens and stay protected
          </p>
        </div>

        <Card className="cyber-border shadow-cyber-glow bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>User Registration</CardTitle>
            <CardDescription>
              Create your free account to start scanning URLs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full-name">Full Name</Label>
                <Input
                  id="full-name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="cyber-border bg-background/50"
                  disabled={isLoading}
                  autoComplete="name"
                  data-ocid="register.name.input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-username">Username</Label>
                <Input
                  id="reg-username"
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="cyber-border bg-background/50"
                  disabled={isLoading}
                  autoComplete="username"
                  data-ocid="register.input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-password">Password</Label>
                <div className="relative">
                  <Input
                    id="reg-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password (min. 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="cyber-border bg-background/50 pr-10"
                    disabled={isLoading}
                    autoComplete="new-password"
                    data-ocid="register.password.input"
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
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Repeat your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="cyber-border bg-background/50 pr-10"
                    disabled={isLoading}
                    autoComplete="new-password"
                    data-ocid="register.confirm.input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirm ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
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
                  isLoading ||
                  !name.trim() ||
                  !username.trim() ||
                  !password ||
                  !confirmPassword
                }
                className="w-full bg-primary hover:bg-primary/90 shadow-cyber-glow"
                data-ocid="register.submit_button"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating Account...
                  </span>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-5 w-5" /> Create Account
                  </>
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground pt-2">
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
