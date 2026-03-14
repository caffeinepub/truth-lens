import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "@tanstack/react-router";
import {
  BarChart2,
  FileSearch,
  LogOut,
  Settings,
  Shield,
  Users,
} from "lucide-react";
import AnalyticsTab from "../components/admin/AnalyticsTab";
import SiteConfigurationTab from "../components/admin/SiteConfigurationTab";
import SubmissionModerationTab from "../components/admin/SubmissionModerationTab";
import UserManagementTab from "../components/admin/UserManagementTab";
import { useGetAllScanResults, useGetAllUsers } from "../hooks/useQueries";

function StatCard({
  label,
  value,
  icon,
  colorClass,
  glowColor,
  isLoading,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  colorClass: string;
  glowColor: string;
  isLoading: boolean;
}) {
  return (
    <Card
      className="bg-card/50 backdrop-blur-sm border"
      style={{
        borderColor: `${glowColor}30`,
        boxShadow: `0 0 20px ${glowColor}15`,
      }}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
              {label}
            </p>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className={`text-3xl font-bold font-mono ${colorClass}`}>
                {value}
              </p>
            )}
          </div>
          <div
            className="p-2 rounded-lg"
            style={{ background: `${glowColor}15`, color: glowColor }}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { data: scanResults, isLoading: scansLoading } = useGetAllScanResults();
  const { data: users, isLoading: usersLoading } = useGetAllUsers();

  const totalScans = scanResults?.length ?? 0;
  const safeScans = scanResults?.filter((s) => s.isSafe).length ?? 0;
  const unsafeScans = totalScans - safeScans;
  const totalUsers = users?.length ?? 0;
  const threatRate =
    totalScans > 0 ? Math.round((unsafeScans / totalScans) * 100) : 0;
  const statsLoading = scansLoading || usersLoading;

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    navigate({ to: "/admin/login" });
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-lg"
              style={{ background: "oklch(0.65 0.25 220 / 0.15)" }}
            >
              <Shield
                className="h-7 w-7 cyber-glow"
                style={{ color: "oklch(0.65 0.25 220)" }}
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold cyber-glow font-mono tracking-tight">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground text-xs mt-0.5 tracking-wide">
                Truth-Lens Security Control Center
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-destructive/40 hover:bg-destructive/10 hover:text-destructive text-destructive/80 font-mono text-xs"
            data-ocid="admin.logout.button"
          >
            <LogOut className="mr-2 h-4 w-4" />
            LOGOUT
          </Button>
        </div>

        {/* Stats Row */}
        <div
          className="grid grid-cols-2 md:grid-cols-5 gap-4"
          data-ocid="admin.stats.panel"
        >
          <StatCard
            label="Total Scans"
            value={totalScans}
            icon={<FileSearch className="h-5 w-5" />}
            colorClass="text-primary"
            glowColor="oklch(0.65 0.25 220)"
            isLoading={statsLoading}
          />
          <StatCard
            label="Safe"
            value={safeScans}
            icon={<Shield className="h-5 w-5" />}
            colorClass="text-accent"
            glowColor="oklch(0.7 0.28 160)"
            isLoading={statsLoading}
          />
          <StatCard
            label="Threats"
            value={unsafeScans}
            icon={<Shield className="h-5 w-5" />}
            colorClass="text-destructive"
            glowColor="oklch(0.6 0.25 25)"
            isLoading={statsLoading}
          />
          <StatCard
            label="Total Users"
            value={totalUsers}
            icon={<Users className="h-5 w-5" />}
            colorClass="text-yellow-400"
            glowColor="oklch(0.8 0.18 80)"
            isLoading={statsLoading}
          />
          <StatCard
            label="Threat Rate"
            value={`${threatRate}%`}
            icon={<BarChart2 className="h-5 w-5" />}
            colorClass={
              threatRate > 30 ? "text-destructive" : "text-muted-foreground"
            }
            glowColor={
              threatRate > 30 ? "oklch(0.6 0.25 25)" : "oklch(0.5 0.05 240)"
            }
            isLoading={statsLoading}
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-card/50 border border-border/50 p-1 h-auto gap-1 flex-wrap">
            <TabsTrigger
              value="users"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 font-mono text-xs uppercase tracking-wider"
              data-ocid="admin.users.tab"
            >
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger
              value="submissions"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 font-mono text-xs uppercase tracking-wider"
              data-ocid="admin.scans.tab"
            >
              <FileSearch className="h-4 w-4" />
              Submissions
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 font-mono text-xs uppercase tracking-wider"
              data-ocid="admin.analytics.tab"
            >
              <BarChart2 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="config"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 font-mono text-xs uppercase tracking-wider"
              data-ocid="admin.config.tab"
            >
              <Settings className="h-4 w-4" />
              Config
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-0">
            <div className="rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm p-6">
              <div className="mb-5">
                <h2 className="text-lg font-semibold flex items-center gap-2 font-mono">
                  <Users
                    className="h-5 w-5"
                    style={{ color: "oklch(0.65 0.25 220)" }}
                  />
                  User Management
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  View, ban, or remove registered users.
                </p>
              </div>
              <UserManagementTab />
            </div>
          </TabsContent>

          <TabsContent value="submissions" className="mt-0">
            <div className="rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm p-6">
              <div className="mb-5">
                <h2 className="text-lg font-semibold flex items-center gap-2 font-mono">
                  <FileSearch
                    className="h-5 w-5"
                    style={{ color: "oklch(0.65 0.25 220)" }}
                  />
                  Submission Moderation
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Review, filter, bulk delete, or export scan submissions.
                </p>
              </div>
              <SubmissionModerationTab />
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-0">
            <div className="rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm p-6">
              <div className="mb-5">
                <h2 className="text-lg font-semibold flex items-center gap-2 font-mono">
                  <BarChart2
                    className="h-5 w-5"
                    style={{ color: "oklch(0.65 0.25 220)" }}
                  />
                  Analytics
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Scan verdict breakdown and confidence score distribution.
                </p>
              </div>
              <AnalyticsTab />
            </div>
          </TabsContent>

          <TabsContent value="config" className="mt-0">
            <div className="rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm p-6">
              <div className="mb-5">
                <h2 className="text-lg font-semibold flex items-center gap-2 font-mono">
                  <Settings
                    className="h-5 w-5"
                    style={{ color: "oklch(0.65 0.25 220)" }}
                  />
                  Site Configuration
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
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
