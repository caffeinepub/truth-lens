import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import { AlertCircle, FileText, Link as LinkIcon } from "lucide-react";
import { useState } from "react";
import { useScanAnalysis } from "../hooks/useQueries";
import LoadingSpinner from "./LoadingSpinner";

export default function ScanForm() {
  const [urlInput, setUrlInput] = useState("");
  const [textInput, setTextInput] = useState("");
  const [activeTab, setActiveTab] = useState("url");
  const navigate = useNavigate();

  const { mutate: scanContent, isPending, error } = useScanAnalysis();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const input = activeTab === "url" ? urlInput : textInput;

    if (!input.trim()) {
      return;
    }

    scanContent(input, {
      onSuccess: (data) => {
        // Store result in sessionStorage for retrieval on results page
        sessionStorage.setItem(
          "lastScanResult",
          JSON.stringify({ result: data, input }),
        );
        navigate({ to: "/results" });
      },
    });
  };

  const isFormValid =
    activeTab === "url"
      ? urlInput.trim().length > 0
      : textInput.trim().length > 0;

  return (
    <Card className="cyber-border shadow-cyber-glow bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl cyber-glow">Analyze Content</CardTitle>
        <CardDescription>
          Choose your input method and scan for potential threats
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList
              className="grid w-full grid-cols-2 mb-6"
              data-ocid="scan.tab"
            >
              <TabsTrigger value="url" className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4" />
                URL Scan
              </TabsTrigger>
              <TabsTrigger value="text" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Text Analysis
              </TabsTrigger>
            </TabsList>

            <TabsContent value="url" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url-input">Suspicious URL</Label>
                <Input
                  id="url-input"
                  type="text"
                  placeholder="https://example.com or paste any suspicious link"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="cyber-border"
                  disabled={isPending}
                  data-ocid="scan.url_input"
                />
              </div>
            </TabsContent>

            <TabsContent value="text" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="text-input">Text Content</Label>
                <Textarea
                  id="text-input"
                  placeholder="Paste suspicious text, email content, or message to analyze..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="cyber-border min-h-[150px]"
                  disabled={isPending}
                />
              </div>
            </TabsContent>
          </Tabs>

          {error && (
            <Alert
              variant="destructive"
              className="mt-4"
              data-ocid="scan.error_state"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error.message || "Failed to scan content. Please try again."}
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            size="lg"
            disabled={!isFormValid || isPending}
            className="w-full mt-6 bg-primary hover:bg-primary/90 shadow-cyber-glow text-lg"
            data-ocid="scan.submit_button"
          >
            {isPending ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Analyzing...
              </>
            ) : (
              "Scan Now"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
