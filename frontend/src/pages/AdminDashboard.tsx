import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdminLogout } from '../hooks/useQueries';
import { Shield, LogOut, Users, FileSearch, Settings } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import UserManagementTab from '../components/admin/UserManagementTab';
import SubmissionModerationTab from '../components/admin/SubmissionModerationTab';
import SiteConfigurationTab from '../components/admin/SiteConfigurationTab';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate: logout, isPending: isLoggingOut } = useAdminLogout();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        queryClient.clear();
        navigate({ to: '/admin/login' });
      },
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary cyber-glow" />
            <div>
              <h1 className="text-4xl font-bold cyber-glow">Admin Dashboard</h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                Manage users, moderate submissions, and configure the platform
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="border-destructive/50 hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </Button>
        </div>

        {/* Tabbed Interface */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-card/50 border border-border/50 p-1 h-auto gap-1">
            <TabsTrigger
              value="users"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2"
            >
              <Users className="h-4 w-4" />
              User Management
            </TabsTrigger>
            <TabsTrigger
              value="submissions"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2"
            >
              <FileSearch className="h-4 w-4" />
              Submission Moderation
            </TabsTrigger>
            <TabsTrigger
              value="config"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2"
            >
              <Settings className="h-4 w-4" />
              Site Configuration
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-0">
            <div className="rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm p-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  User Management
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  View, ban, or remove registered users from the platform.
                </p>
              </div>
              <UserManagementTab />
            </div>
          </TabsContent>

          <TabsContent value="submissions" className="mt-0">
            <div className="rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm p-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <FileSearch className="h-5 w-5 text-primary" />
                  Submission Moderation
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Review and moderate all scan submissions. Delete inappropriate or erroneous entries.
                </p>
              </div>
              <SubmissionModerationTab />
            </div>
          </TabsContent>

          <TabsContent value="config" className="mt-0">
            <div className="rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm p-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  Site Configuration
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage global platform settings and feature flags.
                </p>
              </div>
              <SiteConfigurationTab />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
