import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, XCircle } from "lucide-react";
import type { PhishingScanResult } from "../backend";

interface ScanResultsTableProps {
  results: PhishingScanResult[];
}

export default function ScanResultsTable({ results }: ScanResultsTableProps) {
  if (results.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No scan results available yet.</p>
        <p className="text-sm mt-2">
          Results will appear here as users perform scans.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-border/50">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-muted/50">
            <TableHead className="w-[50%]">Content</TableHead>
            <TableHead className="text-center">Verdict</TableHead>
            <TableHead className="text-center">Trust Score</TableHead>
            <TableHead>Scan Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((result, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: no stable ID on scan results
            <TableRow key={i} className="hover:bg-muted/30">
              <TableCell className="font-mono text-sm">
                <div className="max-w-md truncate">{result.urlOrText}</div>
              </TableCell>
              <TableCell className="text-center">
                {result.verdict === "Safe" ? (
                  <Badge className="bg-accent/20 text-accent border-accent/30">
                    <CheckCircle className="h-3 w-3 mr-1" /> Safe
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <XCircle className="h-3 w-3 mr-1" /> {result.verdict}
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-center font-semibold font-mono">
                {Number(result.trustScore)}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {result.scanDate}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
