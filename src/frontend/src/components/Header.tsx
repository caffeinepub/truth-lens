import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { LogIn, LogOut, ShieldCheck, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { getCurrentUser, logoutUser } from "../utils/userAuth";

export default function Header() {
  const [user, setUser] = useState(getCurrentUser());

  useEffect(() => {
    const sync = () => setUser(getCurrentUser());
    window.addEventListener("storage", sync);
    window.addEventListener("tl-auth-change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("tl-auth-change", sync);
    };
  }, []);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    window.dispatchEvent(new Event("tl-auth-change"));
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 border-b border-primary/20 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          to="/"
          className="flex items-center gap-3 group"
          data-ocid="nav.link"
        >
          <img
            src="/assets/generated/logo-transparent.dim_256x256.png"
            alt="Truth-Lens"
            className="h-10 w-10 drop-shadow-[0_0_8px_oklch(var(--primary)/0.8)] transition-transform group-hover:scale-110"
          />
          <span className="text-xl font-bold tracking-tight cyber-glow hidden sm:inline">
            Truth-Lens
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link to="/" data-ocid="nav.home.link">
            <Button variant="ghost" size="sm">
              Home
            </Button>
          </Link>
          <Link to="/scan" data-ocid="nav.scan.link">
            <Button variant="ghost" size="sm">
              Scanner
            </Button>
          </Link>
          {user ? (
            <>
              <Link to="/profile" data-ocid="nav.profile.link">
                <Button variant="ghost" size="sm" className="text-accent">
                  Hi, {user.name.split(" ")[0]}
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
                data-ocid="nav.logout.button"
              >
                <LogOut className="mr-1 h-4 w-4" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" data-ocid="nav.login.link">
                <Button variant="ghost" size="sm">
                  <LogIn className="mr-1 h-4 w-4" /> Login
                </Button>
              </Link>
              <Link to="/register" data-ocid="nav.register.link">
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 shadow-cyber-glow"
                >
                  <UserPlus className="mr-1 h-4 w-4" /> Register
                </Button>
              </Link>
            </>
          )}
          <Link to="/admin/login" data-ocid="nav.admin.link">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-primary"
            >
              <ShieldCheck className="mr-1 h-4 w-4" />
              <span className="hidden sm:inline">Admin</span>
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
