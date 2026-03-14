import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Download,
  FileSearch,
  ShieldAlert,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { ScanResult } from "../../backend";
import {
  useDeleteSubmission,
  useGetAllScanResults,
} from "../../hooks/useQueries";

type Filter = "all" | "safe" | "unsafe";

export default function SubmissionModerationTab() {
  const { data: submissions, isLoading } = useGetAllScanResults();
  const { mutate: deleteSubmission, isPending: isDeleting } =
    useDeleteSubmission();

  const [deletingKey, setDeletingKey] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const filtered = (submissions || []).filter((s) => {
    if (filter === "safe") return s.isSafe;
    if (filter === "unsafe") return !s.isSafe;
    return true;
  });

  const allSelected =
    filtered.length > 0 && filtered.every((s) => selectedKeys.has(s.urlOrText));
  const someSelected = selectedKeys.size > 0;

  const toggleAll = () => {
    if (allSelected) {
      setSelectedKeys(new Set());
    } else {
      setSelectedKeys(new Set(filtered.map((s) => s.urlOrText)));
    }
  };

  const toggleKey = (key: string) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleDelete = (key: string) => {
    setDeletingKey(key);
    deleteSubmission(key, {
      onSuccess: () => {
        toast.success("Submission deleted");
        setDeletingKey(null);
        setPendingDelete(null);
        setSelectedKeys((prev) => {
          const n = new Set(prev);
          n.delete(key);
          return n;
        });
      },
      onError: (err: Error) => {
        toast.error(err.message || "Failed to delete submission");
        setDeletingKey(null);
        setPendingDelete(null);
      },
    });
  };

  const handleBulkDelete = async () => {
    setIsBulkDeleting(true);
    const keys = Array.from(selectedKeys);
    let successCount = 0;
    for (const key of keys) {
      await new Promise<void>((resolve) => {
        deleteSubmission(key, {
          onSuccess: () => {
            successCount++;
            resolve();
          },
          onError: () => resolve(),
        });
      });
    }
    setSelectedKeys(new Set());
    setBulkDeleteOpen(false);
    setIsBulkDeleting(false);
    toast.success(
      `Deleted ${successCount} submission${successCount !== 1 ? "s" : ""}`,
    );
  };

  const handleExportCSV = () => {
    if (!submissions || submissions.length === 0) {
      toast.error("No data to export");
      return;
    }
    const rows = [
      ["#", "URL/Text", "Verdict", "Confidence"],
      ...submissions.map((s: ScanResult, i: number) => [
        String(i + 1),
        `"${s.urlOrText.replace(/"/g, '""')}"`,
        s.isSafe ? "Safe" : "Unsafe",
        String(Number(s.confidenceScore)),
      ]),
    ];
    const csvContent = rows.map((r) => r.join(",")).join("\n");
    const url = URL.createObjectURL(
      new Blob([csvContent], { type: "text/csv" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "truth-lens-scan-history.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported successfully");
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {["sk1", "sk2", "sk3", "sk4", "sk5"].map((id) => (
          <Skeleton key={id} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (!submissions || submissions.length === 0) {
    return (
      <div className="text-center py-16" data-ocid="submissions.empty_state">
        <FileSearch className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No scan submissions found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Filter toggles */}
        <div className="flex items-center gap-1 rounded-md border border-border/50 p-1 bg-card/30">
          {(["all", "safe", "unsafe"] as Filter[]).map((f) => (
            <button
              type="button"
              key={f}
              onClick={() => {
                setFilter(f);
                setSelectedKeys(new Set());
              }}
              className={`px-3 py-1 rounded text-xs font-mono uppercase tracking-widest transition-colors ${
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-ocid={`submissions.${f}.toggle`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {someSelected && (
            <AlertDialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-destructive/40 hover:bg-destructive/10 text-destructive text-xs font-mono"
                  data-ocid="submissions.delete_button"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete Selected ({selectedKeys.size})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-card border-border">
                <AlertDialogHeader>
                  <AlertDialogTitle>Bulk Delete</AlertDialogTitle>
                  <AlertDialogDescription>
                    Delete {selectedKeys.size} selected submission
                    {selectedKeys.size !== 1 ? "s" : ""}? This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel data-ocid="submissions.bulk_delete.cancel_button">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive hover:bg-destructive/90"
                    onClick={handleBulkDelete}
                    disabled={isBulkDeleting}
                    data-ocid="submissions.bulk_delete.confirm_button"
                  >
                    {isBulkDeleting ? "Deleting..." : "Delete All"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          <Button
            variant="outline"
            size="sm"
            className="border-accent/40 hover:bg-accent/10 text-accent text-xs font-mono"
            onClick={handleExportCSV}
            data-ocid="submissions.upload_button"
          >
            <Download className="h-3 w-3 mr-1" />
            Export CSV
          </Button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground font-mono">
        {filtered.length} submission{filtered.length !== 1 ? "s" : ""}
        {filter !== "all" ? ` (${filter})` : ""}
      </p>

      {filtered.length === 0 ? (
        <div className="text-center py-12" data-ocid="submissions.empty_state">
          <FileSearch className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">
            No {filter} submissions found.
          </p>
        </div>
      ) : (
        <div className="rounded-md border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-card/50 hover:bg-card/50">
                <TableHead className="w-10">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={toggleAll}
                    aria-label="Select all"
                    data-ocid="submissions.checkbox"
                  />
                </TableHead>
                <TableHead className="w-[38%]">Content</TableHead>
                <TableHead>Verdict</TableHead>
                <TableHead className="w-[20%]">Confidence</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((submission: ScanResult, idx: number) => {
                const confidence = Number(submission.confidenceScore);
                const key = submission.urlOrText;
                const isCurrentlyDeleting = deletingKey === key;

                return (
                  <TableRow
                    key={key}
                    className="hover:bg-card/30"
                    data-ocid={`submissions.item.${idx + 1}`}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedKeys.has(key)}
                        onCheckedChange={() => toggleKey(key)}
                        aria-label="Select row"
                        data-ocid={`submissions.checkbox.${idx + 1}`}
                      />
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-xs text-muted-foreground break-all line-clamp-2">
                        {submission.urlOrText.length > 80
                          ? `${submission.urlOrText.slice(0, 80)}...`
                          : submission.urlOrText}
                      </span>
                    </TableCell>
                    <TableCell>
                      {submission.isSafe ? (
                        <Badge className="bg-accent/20 text-accent border-accent/40 gap-1">
                          <ShieldCheck className="h-3 w-3" /> Safe
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="gap-1">
                          <ShieldAlert className="h-3 w-3" /> Unsafe
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">
                          {confidence}%
                        </span>
                        <Progress value={confidence} className="h-1.5" />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <AlertDialog
                        open={pendingDelete === key}
                        onOpenChange={(open) => {
                          if (!open) setPendingDelete(null);
                        }}
                      >
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-destructive/40 hover:bg-destructive/10 hover:text-destructive text-destructive"
                            onClick={() => setPendingDelete(key)}
                            disabled={isDeleting}
                            data-ocid={`submissions.delete_button.${idx + 1}`}
                          >
                            {isCurrentlyDeleting ? (
                              <span className="text-xs">Deleting...</span>
                            ) : (
                              <>
                                <Trash2 className="h-3 w-3 mr-1" />
                                Delete
                              </>
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-card border-border">
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete Submission
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Delete this scan submission? This action cannot be
                              undone.
                              <div className="mt-2 p-2 bg-muted/30 rounded text-xs font-mono break-all">
                                {submission.urlOrText.slice(0, 100)}
                                {submission.urlOrText.length > 100 ? "..." : ""}
                              </div>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel data-ocid="submissions.delete.cancel_button">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive hover:bg-destructive/90"
                              onClick={() => handleDelete(key)}
                              data-ocid="submissions.delete.confirm_button"
                            >
                              Delete Submission
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
