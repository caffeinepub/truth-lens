import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, ScanSearch, ShieldCheck, User } from "lucide-react";
import { useEffect } from "react";
import { getCurrentUser, logoutUser } from "../utils/userAuth";

export default function UserProfilePage() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    if (!user) navigate({ to: "/login" });
  }, [user, navigate]);
  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = () => {
    logoutUser();
    window.dispatchEvent(new Event("tl-auth-change"));
    navigate({ to: "/" });
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
        <Card className="cyber-border bg-card/70 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <div className="relative inline-flex mx-auto mb-4 group cursor-default">
              <div className="h-24 w-24 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center shadow-cyber-glow transition-all group-hover:shadow-[0_0_30px_oklch(var(--accent)/0.5)]">
                <span className="text-3xl font-bold text-primary cyber-glow">
                  {initials}
                </span>
              </div>
              <div className="absolute inset-0 rounded-full bg-background/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="text-center">
                  <User className="h-5 w-5 text-accent mx-auto mb-1" />
                  <span className="text-xs text-accent">@{user.username}</span>
                </div>
              </div>
            </div>
            <CardTitle className="text-2xl cyber-glow">{user.name}</CardTitle>
            <p className="text-muted-foreground text-sm">@{user.username}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 py-3 border-y border-border/40">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Username</span>
                <span className="text-sm font-mono">@{user.username}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Role</span>
                <Badge className="bg-accent/20 text-accent border-accent/40 gap-1">
                  <ShieldCheck className="h-3 w-3" /> User
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className="text-sm text-accent">&#9679; Active</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Link to="/scan">
                <Button
                  className="w-full bg-primary hover:bg-primary/90 shadow-cyber-glow"
                  data-ocid="profile.scan.button"
                >
                  <ScanSearch className="mr-2 h-4 w-4" /> Go to Scanner
                </Button>
              </Link>
              <Button
                variant="outline"
                className="w-full border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
                onClick={handleLogout}
                data-ocid="profile.logout.button"
              >
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
