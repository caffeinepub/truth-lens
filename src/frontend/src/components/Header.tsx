import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import { LogIn, LogOut, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { getCurrentUser, logoutUser } from "../utils/userAuth";

export default function Header() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(getCurrentUser());

  // Re-check on focus (user may have logged in/out in another tab)
  useEffect(() => {
    const onFocus = () => setCurrentUser(getCurrentUser());
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    navigate({ to: "/" });
  };

  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="/assets/generated/logo-transparent.dim_256x256.png"
              alt="Truth-Lens"
              className="h-10 w-10"
            />
            <span className="text-2xl font-bold cyber-glow group-hover:cyber-glow-green transition-all">
              Truth-Lens
            </span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link to="/scan">
              <Button
                variant="ghost"
                className="text-foreground hover:text-primary"
                data-ocid="header.scan.link"
              >
                Scan
              </Button>
            </Link>
            {currentUser ? (
              <>
                <span className="text-sm text-muted-foreground hidden sm:block px-2">
                  Hi,{" "}
                  <span className="text-foreground font-medium">
                    {currentUser.name}
                  </span>
                </span>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="border-primary/40 hover:bg-primary/10 gap-1.5"
                  data-ocid="header.logout.button"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="border border-border/50 hover:border-primary/50 gap-1.5"
                    data-ocid="header.login.button"
                  >
                    <LogIn className="h-4 w-4" /> Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    variant="default"
                    className="bg-primary/90 hover:bg-primary shadow-cyber-glow gap-1.5"
                    data-ocid="header.register.button"
                  >
                    <UserPlus className="h-4 w-4" /> Register
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
