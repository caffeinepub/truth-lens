import { ReactNode, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import LoadingSpinner from './LoadingSpinner';
import { Shield, AlertTriangle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const { identity, loginStatus, clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: isAdmin, isLoading, isFetched } = useIsCallerAdmin();

  const isAuthenticated = !!identity;
  const isInitializing = loginStatus === 'initializing';

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      navigate({ to: '/admin/login' });
    }
  }, [isInitializing, isAuthenticated, navigate]);

  if (isInitializing || isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (isFetched && !isAdmin) {
    const handleLogout = async () => {
      await clear();
      queryClient.clear();
      navigate({ to: '/admin/login' });
    };

    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="relative mb-6">
            <Shield className="h-20 w-20 text-muted-foreground/30 mx-auto" />
            <AlertTriangle className="h-8 w-8 text-destructive absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/2" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Access Denied</h2>
          <p className="text-muted-foreground mb-2">
            Your identity does not have administrator privileges to access this area.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Principal:{' '}
            <span className="font-mono text-xs">
              {identity?.getPrincipal().toString().slice(0, 24)}...
            </span>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-destructive/50 hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout &amp; Try Different Account
            </Button>
            <Button onClick={() => navigate({ to: '/' })} variant="ghost">
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
