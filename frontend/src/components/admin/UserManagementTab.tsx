import { useState } from 'react';
import { useGetAllUsers, useBanUser, useDeleteUser, useGetAllScanResults } from '../../hooks/useQueries';
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
import { Users, Ban, Trash2, ArrowUpDown } from 'lucide-react';
import type { Principal } from '@dfinity/principal';

type SortField = 'name' | 'principal' | 'scans';
type SortDir = 'asc' | 'desc';

export default function UserManagementTab() {
  const { data: users, isLoading: usersLoading } = useGetAllUsers();
  const { data: scanResults } = useGetAllScanResults();
  const { mutate: banUser, isPending: isBanning } = useBanUser();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [pendingAction, setPendingAction] = useState<{ type: 'ban' | 'delete'; principal: Principal } | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const getScanCount = (principal: Principal): number => {
    if (!scanResults) return 0;
    // Count scans — backend doesn't track per-user, so we show total as placeholder
    return scanResults.length;
  };

  const sortedUsers = [...(users || [])].sort(([pA, profileA], [pB, profileB]) => {
    let cmp = 0;
    if (sortField === 'name') {
      cmp = profileA.name.localeCompare(profileB.name);
    } else if (sortField === 'principal') {
      cmp = pA.toString().localeCompare(pB.toString());
    } else if (sortField === 'scans') {
      cmp = getScanCount(pA) - getScanCount(pB);
    }
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const handleBan = (principal: Principal) => {
    banUser(principal, {
      onSuccess: () => {
        toast.success('User banned successfully');
        setPendingAction(null);
      },
      onError: (err: Error) => {
        toast.error(err.message || 'Failed to ban user');
        setPendingAction(null);
      },
    });
  };

  const handleDelete = (principal: Principal) => {
    deleteUser(principal, {
      onSuccess: () => {
        toast.success('User deleted successfully');
        setPendingAction(null);
      },
      onError: (err: Error) => {
        toast.error(err.message || 'Failed to delete user');
        setPendingAction(null);
      },
    });
  };

  if (usersLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="text-center py-16">
        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No registered users found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {users.length} registered user{users.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="rounded-md border border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-card/50 hover:bg-card/50">
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 font-semibold hover:text-primary"
                  onClick={() => handleSort('name')}
                >
                  Name <ArrowUpDown className="ml-1 h-3 w-3 inline" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 font-semibold hover:text-primary"
                  onClick={() => handleSort('principal')}
                >
                  Principal ID <ArrowUpDown className="ml-1 h-3 w-3 inline" />
                </Button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedUsers.map(([principal, profile]) => (
              <TableRow key={principal.toString()} className="hover:bg-card/30">
                <TableCell className="font-medium">{profile.name}</TableCell>
                <TableCell>
                  <span className="font-mono text-xs text-muted-foreground">
                    {principal.toString().slice(0, 24)}...
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-accent border-accent/40 text-xs">
                    Active
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* Ban User */}
                    <AlertDialog
                      open={pendingAction?.type === 'ban' && pendingAction.principal.toString() === principal.toString()}
                      onOpenChange={(open) => { if (!open) setPendingAction(null); }}
                    >
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-yellow-500/40 hover:bg-yellow-500/10 hover:text-yellow-400 text-yellow-500"
                          onClick={() => setPendingAction({ type: 'ban', principal })}
                          disabled={isBanning || isDeleting}
                        >
                          <Ban className="h-3 w-3 mr-1" />
                          Ban
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-card border-border">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Ban User</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to ban <strong>{profile.name}</strong>? They will no longer be able to perform scans or update their profile.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-yellow-600 hover:bg-yellow-700"
                            onClick={() => handleBan(principal)}
                          >
                            {isBanning ? 'Banning...' : 'Ban User'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    {/* Delete User */}
                    <AlertDialog
                      open={pendingAction?.type === 'delete' && pendingAction.principal.toString() === principal.toString()}
                      onOpenChange={(open) => { if (!open) setPendingAction(null); }}
                    >
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-destructive/40 hover:bg-destructive/10 hover:text-destructive text-destructive"
                          onClick={() => setPendingAction({ type: 'delete', principal })}
                          disabled={isBanning || isDeleting}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-card border-border">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete User</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to permanently delete <strong>{profile.name}</strong>? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive hover:bg-destructive/90"
                            onClick={() => handleDelete(principal)}
                          >
                            {isDeleting ? 'Deleting...' : 'Delete User'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
