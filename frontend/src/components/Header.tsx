import { Link, useNavigate } from '@tanstack/react-router';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';

export default function Header() {
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: '/' });
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <img src="/assets/generated/logo.dim_256x256.png" alt="Truth-Lens" className="h-10 w-10" />
            <span className="text-2xl font-bold cyber-glow group-hover:cyber-glow-green transition-all">
              Truth-Lens
            </span>
          </Link>

          <nav className="flex items-center gap-4">
            <Link to="/scan">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                Scan
              </Button>
            </Link>
            <Link to="/admin/login">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                Admin
              </Button>
            </Link>
            <Button
              onClick={handleAuth}
              disabled={isLoggingIn}
              variant={isAuthenticated ? 'outline' : 'default'}
              className={
                isAuthenticated
                  ? 'border-primary/50 hover:bg-primary/10'
                  : 'bg-primary hover:bg-primary/90 shadow-cyber-glow'
              }
            >
              {isLoggingIn ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login'}
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
