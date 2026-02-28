import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import ScanForm from '../components/ScanForm';
import ProfileSetupDialog from '../components/ProfileSetupDialog';
import LoadingSpinner from '../components/LoadingSpinner';
import { Shield } from 'lucide-react';

export default function ScanDashboard() {
  const { identity, loginStatus } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const isInitializing = loginStatus === 'initializing';

  if (isInitializing || profileLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <Shield className="h-16 w-16 text-primary mx-auto mb-4 cyber-glow" />
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-muted-foreground mb-6">Please log in to access the scan dashboard and analyze URLs.</p>
        </div>
      </div>
    );
  }

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <div className="container mx-auto px-4 py-12">
      <ProfileSetupDialog open={showProfileSetup} />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 cyber-glow">Scan Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Enter a suspicious URL or paste text content to analyze for potential threats
          </p>
        </div>

        <ScanForm />
      </div>
    </div>
  );
}
