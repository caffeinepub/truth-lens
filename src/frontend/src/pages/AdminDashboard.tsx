import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  ClipboardList,
  FileSearch,
  LogOut,
  Settings,
  Users,
} from "lucide-react";
import { useEffect } from "react";
import AnalyticsTab from "../components/admin/AnalyticsTab";
import SiteConfigurationTab from "../components/admin/SiteConfigurationTab";
import SubmissionModerationTab from "../components/admin/SubmissionModerationTab";
import UserManagementTab from "../components/admin/UserManagementTab";
import { useGetAdminLog, useGetSystemStats } from "../hooks/useQueries";

function StatCard({
  label,
  value,
  color,
}: { label: string; value: string | number; color: string }) {
  return (
    <Card
      className="bg-card/40 backdrop-blur-sm"
      style={{ borderColor: color, boxShadow: `0 0 12px ${color}30` }}
    >
      <CardContent className="pt-4 pb-4">
        <div className="text-2xl font-bold font-mono" style={{ color }}>
          {value}
        </div>
        <div className="text-xs text-muted-foreground mt-1">{label}</div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { data: stats } = useGetSystemStats();
  const { data: auditLog, isLoading: logLoading } = useGetAdminLog();

  useEffect(() => {
    if (localStorage.getItem("isAdminLoggedIn") !== "true")
      navigate({ to: "/admin/login" });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    navigate({ to: "/admin/login" });
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: "url(/assets/generated/hero-bg.dim_1920x1080.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="min-h-screen bg-background/90 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <img
                src="/assets/generated/icon-shield-transparent.dim_128x128.png"
                alt="Admin shield icon"
                className="h-10 w-10 drop-shadow-[0_0_10px_oklch(var(--primary)/0.7)]"
              />
              <div>
                <h1 className="text-3xl font-bold cyber-glow">
                  Admin Dashboard
                </h1>
                <p className="text-xs text-muted-foreground">
                  Truth-Lens Control Center
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
              data-ocid="admin.logout.button"
            >
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>

          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
              <StatCard
                label="Total Scans"
                value={Number(stats.totalScans)}
                color="oklch(var(--primary))"
              />
              <StatCard
                label="Safe"
                value={Number(stats.safeCount)}
                color="oklch(var(--accent))"
              />
              <StatCard
                label="Suspicious"
                value={Number(stats.suspiciousCount)}
                color="#eab308"
              />
              <StatCard
                label="Phishing"
                value={Number(stats.phishingCount)}
                color="oklch(var(--destructive))"
              />
              <StatCard
                label="Total Users"
                value={Number(stats.totalUsers)}
                color="oklch(var(--primary))"
              />
            </div>
          )}

          <Tabs defaultValue="users" className="space-y-4">
            <TabsList className="bg-card/50 border border-primary/20 p-1 h-auto gap-1 flex-wrap">
              <TabsTrigger
                value="users"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2"
                data-ocid="admin.users.tab"
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Users</span>
              </TabsTrigger>
              <TabsTrigger
                value="scans"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2"
                data-ocid="admin.scans.tab"
              >
                <FileSearch className="h-4 w-4" />
                <span className="hidden sm:inline">Scan History</span>
              </TabsTrigger>
              <TabsTrigger
                value="config"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2"
                data-ocid="admin.config.tab"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Config</span>
              </TabsTrigger>
              <TabsTrigger
                value="audit"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2"
                data-ocid="admin.audit.tab"
              >
                <ClipboardList className="h-4 w-4" />
                <span className="hidden sm:inline">Audit Log</span>
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2"
                data-ocid="admin.analytics.tab"
              >
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users">
              <div className="rounded-xl border border-primary/20 bg-card/50 backdrop-blur-sm p-6">
                <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                  <Users className="h-5 w-5 text-primary" /> User Management
                </h2>
                <UserManagementTab />
              </div>
            </TabsContent>
            <TabsContent value="scans">
              <div className="rounded-xl border border-primary/20 bg-card/50 backdrop-blur-sm p-6">
                <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                  <FileSearch className="h-5 w-5 text-primary" /> Submission
                  Moderation
                </h2>
                <SubmissionModerationTab />
              </div>
            </TabsContent>
            <TabsContent value="config">
              <div className="rounded-xl border border-primary/20 bg-card/50 backdrop-blur-sm p-6">
                <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                  <Settings className="h-5 w-5 text-primary" /> Site
                  Configuration
                </h2>
                <SiteConfigurationTab />
              </div>
            </TabsContent>
            <TabsContent value="audit">
              <div className="rounded-xl border border-primary/20 bg-card/50 backdrop-blur-sm p-6">
                <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                  <ClipboardList className="h-5 w-5 text-primary" /> Audit Log
                </h2>
                {logLoading ? (
                  <div
                    className="flex items-center justify-center py-12"
                    data-ocid="audit.loading_state"
                  >
                    <div className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  </div>
                ) : !auditLog || auditLog.length === 0 ? (
                  <div
                    className="text-center py-12 text-muted-foreground"
                    data-ocid="audit.empty_state"
                  >
                    <ClipboardList className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p>No audit log entries yet.</p>
                  </div>
                ) : (
                  <div className="space-y-2" data-ocid="audit.list">
                    {auditLog.map((entry, i) => (
                      <div
                        key={`${entry.timestamp}-${i}`}
                        className="flex items-start justify-between rounded-lg border border-border/30 bg-muted/10 px-4 py-3"
                        data-ocid={`audit.item.${i + 1}`}
                      >
                        <div className="flex items-center gap-3">
                          <Badge className="bg-primary/10 text-primary border-primary/30 font-mono text-xs">
                            ACTION
                          </Badge>
                          <span className="text-sm">{entry.action}</span>
                        </div>
                        <span className="text-xs text-muted-foreground font-mono shrink-0 ml-4">
                          {entry.timestamp}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="analytics">
              <div className="rounded-xl border border-primary/20 bg-card/50 backdrop-blur-sm p-6">
                <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                  <BarChart3 className="h-5 w-5 text-primary" /> Analytics
                </h2>
                <AnalyticsTab />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
