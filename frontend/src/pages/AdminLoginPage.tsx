import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminLogin } from '../hooks/useQueries';
import { AlertCircle, Shield, Lock, LogOut } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import LoadingSpinner from '../components/LoadingSpinner';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { mutate: adminLogin, isPending, error, reset } = useAdminLogin();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleAdminAccess = () => {
    if (!isAuthenticated) return;

    adminLogin(undefined, {
      onSuccess: () => {
        toast.success('Admin access granted');
        navigate({ to: '/admin/dashboard' });
      },
      onError: (err: Error) => {
        toast.error(err.message || 'Access denied. Your identity does not have admin privileges.');
      },
    });
  };

  const handleInternetIdentityLogin = async () => {
    try {
      await login();
    } catch (err: any) {
      console.error('Login error:', err);
    }
  };

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    reset();
  };

  const isAccessDenied = !!error && error.message?.includes('Unauthorized');

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <Shield className="h-16 w-16 text-primary mx-auto mb-4 cyber-glow" />
          <h1 className="text-4xl font-bold mb-2 cyber-glow">Admin Access</h1>
          <p className="text-muted-foreground">
            Restricted area — authorized administrators only
          </p>
        </div>

        <Card className="cyber-border shadow-cyber-glow bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Administrator Login</CardTitle>
            <CardDescription>
              Admin access is granted based on your Internet Identity principal. Only principals
              registered as administrators can access the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isAuthenticated ? (
              <div className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Please authenticate with Internet Identity first to verify your admin privileges.
                  </AlertDescription>
                </Alert>
                <Button
                  onClick={handleInternetIdentityLogin}
                  disabled={isLoggingIn}
                  className="w-full bg-primary hover:bg-primary/90 shadow-cyber-glow"
                  size="lg"
                >
                  {isLoggingIn ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Authenticating...
                    </>
                  ) : (
                    'Login with Internet Identity'
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-accent/10 border border-accent/30 rounded-lg">
                  <Lock className="h-5 w-5 text-accent flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-accent">Identity Verified</p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate font-mono">
                      {identity?.getPrincipal().toString().slice(0, 28)}...
                    </p>
                  </div>
                </div>

                {isAccessDenied ? (
                  <div className="space-y-3">
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Access Denied.</strong> Your identity does not have administrator
                        privileges. Please log out and try with an authorized account.
                      </AlertDescription>
                    </Alert>
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="w-full border-destructive/50 hover:bg-destructive/10 hover:text-destructive"
                      size="lg"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout &amp; Try Different Account
                    </Button>
                  </div>
                ) : (
                  <>
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          {error.message || 'Authentication failed. Please try again.'}
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button
                      onClick={handleAdminAccess}
                      size="lg"
                      disabled={isPending}
                      className="w-full bg-primary hover:bg-primary/90 shadow-cyber-glow"
                    >
                      {isPending ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-2" />
                          Verifying Admin Privileges...
                        </>
                      ) : (
                        <>
                          <Shield className="mr-2 h-5 w-5" />
                          Access Admin Dashboard
                        </>
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="w-full text-muted-foreground hover:text-foreground"
                      size="sm"
                    >
                      <LogOut className="mr-2 h-3 w-3" />
                      Logout &amp; use different account
                    </Button>
                  </>
                )}

                <p className="text-xs text-center text-muted-foreground">
                  Access is restricted to authorized administrators only.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
