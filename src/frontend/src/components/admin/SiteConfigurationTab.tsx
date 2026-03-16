import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useGetSiteConfig, useSaveConfigValue } from "../../hooks/useQueries";

const CONFIG_KEYS = [
  { key: "siteName", label: "Site Name", placeholder: "Truth-Lens" },
  {
    key: "scanLimit",
    label: "Daily Scan Limit (per user)",
    placeholder: "100",
  },
  {
    key: "apiKeyGSB",
    label: "Google Safe Browsing API Key",
    placeholder: "AIzaSy...",
  },
  { key: "apiKeyVT", label: "VirusTotal API Key", placeholder: "abc123..." },
  { key: "apiKeyPhishTank", label: "PhishTank API Key", placeholder: "ph_..." },
];

function ConfigField({
  configKey,
  label,
  placeholder,
}: { configKey: string; label: string; placeholder: string }) {
  const { data, isLoading } = useGetSiteConfig(configKey);
  const saveConfig = useSaveConfigValue();
  const [value, setValue] = useState("");
  const [initialized, setInitialized] = useState(false);

  if (!initialized && data !== undefined) {
    setValue(data ?? "");
    setInitialized(true);
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          value={isLoading ? "" : value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={isLoading ? "Loading..." : placeholder}
          disabled={isLoading || saveConfig.isPending}
          className="cyber-border bg-background/50 flex-1"
          data-ocid={`config.${configKey}.input`}
        />
        <Button
          onClick={() =>
            saveConfig.mutate(
              { key: configKey, value },
              {
                onSuccess: () => toast.success(`Saved ${label}`),
                onError: () => toast.error("Save failed"),
              },
            )
          }
          disabled={isLoading || saveConfig.isPending}
          className="bg-primary hover:bg-primary/90 shrink-0"
          data-ocid={`config.${configKey}.save_button`}
        >
          {saveConfig.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Save className="h-4 w-4 mr-1" /> Save
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default function SiteConfigurationTab() {
  return (
    <div className="space-y-6 max-w-2xl">
      <p className="text-sm text-muted-foreground">
        Manage global platform settings. API keys are stored on-chain.
      </p>
      {CONFIG_KEYS.map((c) => (
        <ConfigField
          key={c.key}
          configKey={c.key}
          label={c.label}
          placeholder={c.placeholder}
        />
      ))}
    </div>
  );
}
