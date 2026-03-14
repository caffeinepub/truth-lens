import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "@tanstack/react-router";
import { Calendar, LogOut, Scan, Shield, UserCircle } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  type CurrentUser,
  getCurrentUser,
  logoutUser,
} from "../utils/userAuth";

export default function UserProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    const current = getCurrentUser();
    if (!current) {
      navigate({ to: "/login" });
      return;
    }
    setUser(current);
  }, [navigate]);

  const handleLogout = () => {
    logoutUser();
    navigate({ to: "/" });
  };

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const joinDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Shield className="h-8 w-8 text-primary cyber-glow mx-auto mb-3" />
          <h1 className="text-3xl font-bold cyber-glow tracking-tight">
            Your Profile
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Truth-Lens member dashboard
          </p>
        </div>

        {/* Profile Card */}
        <Card
          className="cyber-border shadow-cyber-glow bg-card/50 backdrop-blur-sm overflow-hidden"
          data-ocid="profile.card"
        >
          {/* Glowing top bar */}
          <div
            className="h-1.5 w-full"
            style={{
              background:
                "linear-gradient(90deg, oklch(var(--primary)) 0%, oklch(var(--accent)) 100%)",
            }}
          />

          <CardContent className="pt-8 pb-8 px-8">
            {/* Avatar */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-4">
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(var(--primary) / 0.2), oklch(var(--accent) / 0.15))",
                    border: "2px solid oklch(var(--primary) / 0.5)",
                    boxShadow:
                      "0 0 24px oklch(var(--primary) / 0.35), 0 0 48px oklch(var(--primary) / 0.15)",
                    color: "oklch(var(--primary))",
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                >
                  {initials || <UserCircle className="w-12 h-12" />}
                </div>
                {/* Online indicator */}
                <span
                  className="absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-card"
                  style={{ background: "oklch(var(--accent))" }}
                />
              </div>

              <h2 className="text-xl font-bold text-foreground text-center">
                {user.name}
              </h2>
              <p
                className="text-sm font-mono mt-0.5"
                style={{ color: "oklch(var(--primary))" }}
              >
                @{user.username}
              </p>

              <div className="flex items-center gap-2 mt-3">
                <Badge
                  className="px-3 py-0.5 text-xs font-semibold tracking-wider"
                  style={{
                    background: "oklch(var(--primary) / 0.15)",
                    color: "oklch(var(--primary))",
                    border: "1px solid oklch(var(--primary) / 0.35)",
                  }}
                >
                  MEMBER
                </Badge>
                <Badge
                  className="px-3 py-0.5 text-xs font-semibold tracking-wider"
                  style={{
                    background: "oklch(var(--accent) / 0.12)",
                    color: "oklch(var(--accent))",
                    border: "1px solid oklch(var(--accent) / 0.3)",
                  }}
                >
                  VERIFIED
                </Badge>
              </div>
            </div>

            <Separator
              className="mb-6"
              style={{ background: "oklch(var(--primary) / 0.15)" }}
            />

            {/* Info rows */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-sm">
                <UserCircle
                  className="h-4 w-4 flex-shrink-0"
                  style={{ color: "oklch(var(--primary))" }}
                />
                <span className="text-muted-foreground w-20 flex-shrink-0">
                  Full name
                </span>
                <span className="text-foreground font-medium">{user.name}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield
                  className="h-4 w-4 flex-shrink-0"
                  style={{ color: "oklch(var(--primary))" }}
                />
                <span className="text-muted-foreground w-20 flex-shrink-0">
                  Username
                </span>
                <span
                  className="font-mono font-medium"
                  style={{ color: "oklch(var(--accent))" }}
                >
                  {user.username}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar
                  className="h-4 w-4 flex-shrink-0"
                  style={{ color: "oklch(var(--primary))" }}
                />
                <span className="text-muted-foreground w-20 flex-shrink-0">
                  Joined
                </span>
                <span className="text-foreground">{joinDate}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                size="lg"
                className="w-full shadow-cyber-glow font-semibold"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(var(--primary)), oklch(var(--accent)))",
                  color: "oklch(var(--primary-foreground))",
                }}
                onClick={() => navigate({ to: "/scan" })}
                data-ocid="profile.scan.button"
              >
                <Scan className="mr-2 h-5 w-5" />
                Go to Scanner
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full"
                style={{
                  borderColor: "oklch(var(--destructive) / 0.4)",
                  color: "oklch(var(--destructive))",
                }}
                onClick={handleLogout}
                data-ocid="profile.logout.button"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
