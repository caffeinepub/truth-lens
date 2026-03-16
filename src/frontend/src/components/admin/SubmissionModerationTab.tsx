import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, FileSearch, Loader2, Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useDeleteScanResult,
  useGetAllScanResults,
  useUpdateScanResult,
} from "../../hooks/useQueries";

type Filter = "All" | "Safe" | "Suspicious" | "Phishing";

function VerdictBadge({ verdict }: { verdict: string }) {
  if (verdict === "Safe")
    return (
      <Badge className="bg-accent/20 text-accent border-accent/40">Safe</Badge>
    );
  if (verdict === "Suspicious")
    return (
      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/40">
        Suspicious
      </Badge>
    );
  return (
    <Badge className="bg-destructive/20 text-destructive border-destructive/40">
      Phishing
    </Badge>
  );
}

export default function SubmissionModerationTab() {
  const [filter, setFilter] = useState<Filter>("All");
  const [selected, setSelected] = useState<number[]>([]);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editVerdict, setEditVerdict] = useState("");
  const [editScore, setEditScore] = useState("");

  const { data: scans, isLoading, error } = useGetAllScanResults();
  const deleteScan = useDeleteScanResult();
  const updateScan = useUpdateScanResult();

  const filtered = (scans ?? []).filter(
    (s) => filter === "All" || s.verdict === filter,
  );

  const toggleSelect = (idx: number) =>
    setSelected((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
    );

  const exportCsv = () => {
    const rows = ["URL,Verdict,Trust Score,Scan Date"];
    for (const s of scans ?? [])
      rows.push(`"${s.urlOrText}",${s.verdict},${s.trustScore},${s.scanDate}`);
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "scan-history.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleBulkDelete = () => {
    if (!confirm(`Delete ${selected.length} selected scans?`)) return;
    Promise.all(selected.map((i) => deleteScan.mutateAsync(BigInt(i))))
      .then(() => {
        toast.success(`Deleted ${selected.length} scans`);
        setSelected([]);
      })
      .catch(() => toast.error("Some deletions failed"));
  };

  const handleSaveEdit = (idx: number) => {
    updateScan.mutate(
      {
        index: BigInt(idx),
        verdict: editVerdict,
        trustScore: BigInt(editScore || "0"),
      },
      {
        onSuccess: () => {
          toast.success("Scan result updated");
          setEditIdx(null);
        },
        onError: () => toast.error("Update failed"),
      },
    );
  };

  if (isLoading)
    return (
      <div
        className="flex items-center justify-center py-12"
        data-ocid="scans.loading_state"
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  if (error)
    return (
      <Alert variant="destructive" data-ocid="scans.error_state">
        <AlertDescription>Failed to load scan results.</AlertDescription>
      </Alert>
    );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1" data-ocid="scans.filter.tab">
          {(["All", "Safe", "Suspicious", "Phishing"] as Filter[]).map((f) => (
            <Button
              key={f}
              size="sm"
              variant={filter === f ? "default" : "outline"}
              onClick={() => setFilter(f)}
              className={filter === f ? "bg-primary" : "border-border/50"}
            >
              {f}
            </Button>
          ))}
        </div>
        <div className="ml-auto flex gap-2">
          {selected.length > 0 && (
            <Button
              size="sm"
              variant="destructive"
              onClick={handleBulkDelete}
              disabled={deleteScan.isPending}
              data-ocid="scans.delete_button"
            >
              <Trash2 className="h-3 w-3 mr-1" /> Delete {selected.length}
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={exportCsv}
            className="border-primary/30 hover:border-primary"
            data-ocid="scans.export.button"
          >
            <Download className="h-3 w-3 mr-1" /> Export CSV
          </Button>
        </div>
      </div>
      {filtered.length === 0 ? (
        <div
          className="text-center py-12 text-muted-foreground"
          data-ocid="scans.empty_state"
        >
          <FileSearch className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p>No scan results found.</p>
        </div>
      ) : (
        <div
          className="rounded-lg border border-border/50 overflow-hidden"
          data-ocid="scans.table"
        >
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 bg-muted/20">
                <TableHead className="w-10" />
                <TableHead>#</TableHead>
                <TableHead>URL / Text</TableHead>
                <TableHead>Verdict</TableHead>
                <TableHead>Trust Score</TableHead>
                <TableHead>Scan Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((scan, idx) => (
                <TableRow
                  key={`${scan.urlOrText}-${idx}`}
                  className="border-border/30 hover:bg-muted/10"
                  data-ocid={`scans.row.${idx + 1}`}
                >
                  <TableCell>
                    <Checkbox
                      checked={selected.includes(idx)}
                      onCheckedChange={() => toggleSelect(idx)}
                      data-ocid={`scans.checkbox.${idx + 1}`}
                    />
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono text-xs">
                    {idx + 1}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate font-mono text-xs">
                    {scan.urlOrText}
                  </TableCell>
                  <TableCell>
                    {editIdx === idx ? (
                      <Select
                        value={editVerdict}
                        onValueChange={setEditVerdict}
                      >
                        <SelectTrigger
                          className="h-7 w-28"
                          data-ocid={`scans.verdict.select.${idx + 1}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Safe">Safe</SelectItem>
                          <SelectItem value="Suspicious">Suspicious</SelectItem>
                          <SelectItem value="Phishing">Phishing</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <VerdictBadge verdict={scan.verdict} />
                    )}
                  </TableCell>
                  <TableCell>
                    {editIdx === idx ? (
                      <input
                        type="number"
                        value={editScore}
                        onChange={(e) => setEditScore(e.target.value)}
                        className="w-16 h-7 px-2 text-sm rounded border border-border bg-background"
                        min={0}
                        max={100}
                      />
                    ) : (
                      <span className="font-mono">
                        {Number(scan.trustScore)}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {scan.scanDate}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {editIdx === idx ? (
                        <>
                          <Button
                            size="sm"
                            className="bg-accent hover:bg-accent/90 h-7 px-2"
                            onClick={() => handleSaveEdit(idx)}
                            disabled={updateScan.isPending}
                            data-ocid={`scans.save.button.${idx + 1}`}
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2"
                            onClick={() => setEditIdx(null)}
                            data-ocid={`scans.cancel.button.${idx + 1}`}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 hover:text-primary"
                            onClick={() => {
                              setEditIdx(idx);
                              setEditVerdict(scan.verdict);
                              setEditScore(String(scan.trustScore));
                            }}
                            data-ocid={`scans.edit_button.${idx + 1}`}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 hover:text-destructive"
                            onClick={() => {
                              if (confirm("Delete this scan result?"))
                                deleteScan.mutate(BigInt(idx), {
                                  onSuccess: () => toast.success("Deleted"),
                                  onError: () => toast.error("Failed"),
                                });
                            }}
                            data-ocid={`scans.delete_button.${idx + 1}`}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
