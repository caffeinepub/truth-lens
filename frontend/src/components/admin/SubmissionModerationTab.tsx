import { useState } from 'react';
import { useGetAllScanResults, useDeleteSubmission } from '../../hooks/useQueries';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { FileSearch, Trash2, ShieldCheck, ShieldAlert } from 'lucide-react';
import type { ScanResult } from '../../backend';

export default function SubmissionModerationTab() {
  const { data: submissions, isLoading } = useGetAllScanResults();
  const { mutate: deleteSubmission, isPending: isDeleting } = useDeleteSubmission();
  const [deletingKey, setDeletingKey] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const handleDelete = (key: string) => {
    setDeletingKey(key);
    deleteSubmission(key, {
      onSuccess: () => {
        toast.success('Submission deleted successfully');
        setDeletingKey(null);
        setPendingDelete(null);
      },
      onError: (err: Error) => {
        toast.error(err.message || 'Failed to delete submission');
        setDeletingKey(null);
        setPendingDelete(null);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (!submissions || submissions.length === 0) {
    return (
      <div className="text-center py-16">
        <FileSearch className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No scan submissions found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {submissions.length} submission{submissions.length !== 1 ? 's' : ''} total
        </p>
      </div>

      <div className="rounded-md border border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-card/50 hover:bg-card/50">
              <TableHead className="w-[40%]">Content</TableHead>
              <TableHead>Verdict</TableHead>
              <TableHead className="w-[20%]">Confidence</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((submission: ScanResult) => {
              const confidence = Number(submission.confidenceScore);
              const key = submission.urlOrText;
              const isCurrentlyDeleting = deletingKey === key;

              return (
                <TableRow key={key} className="hover:bg-card/30">
                  <TableCell>
                    <span className="font-mono text-xs text-muted-foreground break-all line-clamp-2">
                      {submission.urlOrText.length > 80
                        ? submission.urlOrText.slice(0, 80) + '...'
                        : submission.urlOrText}
                    </span>
                  </TableCell>
                  <TableCell>
                    {submission.isSafe ? (
                      <Badge className="bg-accent/20 text-accent border-accent/40 gap-1">
                        <ShieldCheck className="h-3 w-3" />
                        Safe
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="gap-1">
                        <ShieldAlert className="h-3 w-3" />
                        Unsafe
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{confidence}%</span>
                      </div>
                      <Progress
                        value={confidence}
                        className="h-1.5"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <AlertDialog
                      open={pendingDelete === key}
                      onOpenChange={(open) => { if (!open) setPendingDelete(null); }}
                    >
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-destructive/40 hover:bg-destructive/10 hover:text-destructive text-destructive"
                          onClick={() => setPendingDelete(key)}
                          disabled={isDeleting}
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
                          <AlertDialogTitle>Delete Submission</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this scan submission? This action cannot be undone.
                            <div className="mt-2 p-2 bg-muted/30 rounded text-xs font-mono break-all">
                              {submission.urlOrText.slice(0, 100)}{submission.urlOrText.length > 100 ? '...' : ''}
                            </div>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive hover:bg-destructive/90"
                            onClick={() => handleDelete(key)}
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
    </div>
  );
}
