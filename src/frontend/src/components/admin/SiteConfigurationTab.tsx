import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Save, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useActor } from "../../hooks/useActor";
import { useSaveSiteConfig } from "../../hooks/useQueries";

interface ConfigField {
  key: string;
  label: string;
  description: string;
  placeholder: string;
}

const CONFIG_FIELDS: ConfigField[] = [
  {
    key: "maxScansPerUser",
    label: "Max Scans Per User",
    description: "Maximum number of scans allowed per user account.",
    placeholder: "100",
  },
  {
    key: "scanRateLimitSeconds",
    label: "Scan Rate Limit (seconds)",
    description: "Minimum seconds between scans for a single user.",
    placeholder: "5",
  },
  {
    key: "maintenanceMode",
    label: "Maintenance Mode",
    description:
      'Set to "true" to enable maintenance mode (disables scanning for regular users).',
    placeholder: "false",
  },
  {
    key: "welcomeMessage",
    label: "Welcome Message",
    description: "Custom welcome message displayed on the landing page.",
    placeholder: "Welcome to Truth-Lens",
  },
];

export default function SiteConfigurationTab() {
  const { actor, isFetching: actorFetching } = useActor();
  const { mutate: saveConfig, isPending: isSaving } = useSaveSiteConfig();

  const [values, setValues] = useState<Record<string, string>>({});
  const [loadingKeys, setLoadingKeys] = useState<Set<string>>(new Set());
  const [dirty, setDirty] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!actor || actorFetching) return;

    const fetchAll = async () => {
      const newLoadingKeys = new Set(CONFIG_FIELDS.map((f) => f.key));
      setLoadingKeys(newLoadingKeys);

      const results = await Promise.allSettled(
        CONFIG_FIELDS.map(async (field) => {
          const val = await actor.readConfigValue(field.key);
          return { key: field.key, value: val ?? "" };
        }),
      );

      const newValues: Record<string, string> = {};
      for (const result of results) {
        if (result.status === "fulfilled") {
          newValues[result.value.key] = result.value.value;
        }
      }

      setValues(newValues);
      setLoadingKeys(new Set());
    };

    fetchAll();
  }, [actor, actorFetching]);

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setDirty((prev) => new Set(prev).add(key));
  };

  const handleSave = async () => {
    const dirtyKeys = Array.from(dirty);
    if (dirtyKeys.length === 0) {
      toast.info("No changes to save.");
      return;
    }

    let successCount = 0;
    let errorCount = 0;

    await Promise.allSettled(
      dirtyKeys.map(
        (key) =>
          new Promise<void>((resolve) => {
            saveConfig(
              { key, value: values[key] ?? "" },
              {
                onSuccess: () => {
                  successCount++;
                  resolve();
                },
                onError: () => {
                  errorCount++;
                  resolve();
                },
              },
            );
          }),
      ),
    );

    if (successCount > 0) {
      toast.success(
        `${successCount} setting${successCount > 1 ? "s" : ""} saved successfully`,
      );
      setDirty(new Set());
    }
    if (errorCount > 0) {
      toast.error(
        `Failed to save ${errorCount} setting${errorCount > 1 ? "s" : ""}`,
      );
    }
  };

  const isLoading = actorFetching || loadingKeys.size > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Configure global application settings. Changes take effect
          immediately.
        </p>
        <Button
          onClick={handleSave}
          disabled={isSaving || isLoading || dirty.size === 0}
          className="bg-primary hover:bg-primary/90 shadow-cyber-glow"
        >
          {isSaving ? (
            <>
              <Save className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes {dirty.size > 0 ? `(${dirty.size})` : ""}
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CONFIG_FIELDS.map((field) => (
          <Card
            key={field.key}
            className="cyber-border bg-card/50 backdrop-blur-sm"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-semibold">
                  {field.label}
                </CardTitle>
                {dirty.has(field.key) && (
                  <span className="text-xs text-yellow-400 ml-auto">
                    ● Modified
                  </span>
                )}
              </div>
              <CardDescription className="text-xs">
                {field.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading && loadingKeys.has(field.key) ? (
                <Skeleton className="h-9 w-full" />
              ) : (
                <div className="space-y-1">
                  <Label htmlFor={field.key} className="sr-only">
                    {field.label}
                  </Label>
                  <Input
                    id={field.key}
                    value={values[field.key] ?? ""}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="bg-background/50 border-border/50 focus:border-primary"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
