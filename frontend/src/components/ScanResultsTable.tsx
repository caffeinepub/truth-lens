import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';
import type { ScanResult } from '../backend';

interface ScanResultsTableProps {
  results: ScanResult[];
}

export default function ScanResultsTable({ results }: ScanResultsTableProps) {
  if (results.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No scan results available yet.</p>
        <p className="text-sm mt-2">Results will appear here as users perform scans.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-border/50">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-muted/50">
            <TableHead className="w-[50%]">Content</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Confidence</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((result, index) => (
            <TableRow key={index} className="hover:bg-muted/30">
              <TableCell className="font-mono text-sm">
                <div className="max-w-md truncate">{result.urlOrText}</div>
              </TableCell>
              <TableCell className="text-center">
                {result.isSafe ? (
                  <Badge variant="default" className="bg-accent/20 text-accent border-accent/30">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Safe
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <XCircle className="h-3 w-3 mr-1" />
                    Unsafe
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-center font-semibold">{Number(result.confidenceScore)}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
