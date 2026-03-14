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
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Principal } from "@dfinity/principal";
import { ArrowUpDown, Ban, Search, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useBanUser,
  useDeleteUser,
  useGetAllScanResults,
  useGetAllUsers,
} from "../../hooks/useQueries";

type SortField = "name" | "principal" | "scans";
type SortDir = "asc" | "desc";

export default function UserManagementTab() {
  const { data: users, isLoading: usersLoading } = useGetAllUsers();
  const { data: scanResults } = useGetAllScanResults();
  const { mutate: banUser, isPending: isBanning } = useBanUser();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingAction, setPendingAction] = useState<{
    type: "ban" | "delete";
    principal: Principal;
  } | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const getScanCount = (_principal: Principal): number => {
    if (!scanResults) return 0;
    return scanResults.length;
  };

  const filteredUsers = (users || []).filter(([, profile]) =>
    profile.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const sortedUsers = [...filteredUsers].sort(
    ([pA, profileA], [pB, profileB]) => {
      let cmp = 0;
      if (sortField === "name")
        cmp = profileA.name.localeCompare(profileB.name);
      else if (sortField === "principal")
        cmp = pA.toString().localeCompare(pB.toString());
      else if (sortField === "scans") cmp = getScanCount(pA) - getScanCount(pB);
      return sortDir === "asc" ? cmp : -cmp;
    },
  );

  const handleBan = (principal: Principal) => {
    banUser(principal, {
      onSuccess: () => {
        toast.success("User banned successfully");
        setPendingAction(null);
      },
      onError: (err: Error) => {
        toast.error(err.message || "Failed to ban user");
        setPendingAction(null);
      },
    });
  };

  const handleDelete = (principal: Principal) => {
    deleteUser(principal, {
      onSuccess: () => {
        toast.success("User deleted successfully");
        setPendingAction(null);
      },
      onError: (err: Error) => {
        toast.error(err.message || "Failed to delete user");
        setPendingAction(null);
      },
    });
  };

  if (usersLoading) {
    return (
      <div className="space-y-3">
        {["sk1", "sk2", "sk3", "sk4", "sk5"].map((id) => (
          <Skeleton key={id} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 cyber-border bg-background/50"
          data-ocid="users.search_input"
        />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground font-mono">
          {sortedUsers.length} / {users?.length ?? 0} user
          {users?.length !== 1 ? "s" : ""}
        </p>
      </div>

      {!users || users.length === 0 ? (
        <div className="text-center py-16" data-ocid="users.empty_state">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No registered users found.</p>
        </div>
      ) : sortedUsers.length === 0 ? (
        <div className="text-center py-12" data-ocid="users.empty_state">
          <Search className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">
            No users match &quot;{searchQuery}&quot;
          </p>
        </div>
      ) : (
        <div className="rounded-md border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-card/50 hover:bg-card/50">
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 font-semibold hover:text-primary"
                    onClick={() => handleSort("name")}
                  >
                    Name <ArrowUpDown className="ml-1 h-3 w-3 inline" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 font-semibold hover:text-primary"
                    onClick={() => handleSort("principal")}
                  >
                    Principal ID <ArrowUpDown className="ml-1 h-3 w-3 inline" />
                  </Button>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedUsers.map(([principal, profile], idx) => (
                <TableRow
                  key={principal.toString()}
                  className="hover:bg-card/30"
                  data-ocid={`users.item.${idx + 1}`}
                >
                  <TableCell className="font-medium">{profile.name}</TableCell>
                  <TableCell>
                    <span className="font-mono text-xs text-muted-foreground">
                      {principal.toString().slice(0, 24)}...
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="text-accent border-accent/40 text-xs"
                    >
                      Active
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <AlertDialog
                        open={
                          pendingAction?.type === "ban" &&
                          pendingAction.principal.toString() ===
                            principal.toString()
                        }
                        onOpenChange={(open) => {
                          if (!open) setPendingAction(null);
                        }}
                      >
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-yellow-500/40 hover:bg-yellow-500/10 hover:text-yellow-400 text-yellow-500"
                            onClick={() =>
                              setPendingAction({ type: "ban", principal })
                            }
                            disabled={isBanning || isDeleting}
                            data-ocid={`users.toggle.${idx + 1}`}
                          >
                            <Ban className="h-3 w-3 mr-1" /> Ban
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-card border-border">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Ban User</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to ban{" "}
                              <strong>{profile.name}</strong>? They will no
                              longer be able to perform scans or update their
                              profile.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel data-ocid="users.ban.cancel_button">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-yellow-600 hover:bg-yellow-700"
                              onClick={() => handleBan(principal)}
                              data-ocid="users.ban.confirm_button"
                            >
                              {isBanning ? "Banning..." : "Ban User"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <AlertDialog
                        open={
                          pendingAction?.type === "delete" &&
                          pendingAction.principal.toString() ===
                            principal.toString()
                        }
                        onOpenChange={(open) => {
                          if (!open) setPendingAction(null);
                        }}
                      >
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-destructive/40 hover:bg-destructive/10 hover:text-destructive text-destructive"
                            onClick={() =>
                              setPendingAction({ type: "delete", principal })
                            }
                            disabled={isBanning || isDeleting}
                            data-ocid={`users.delete_button.${idx + 1}`}
                          >
                            <Trash2 className="h-3 w-3 mr-1" /> Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-card border-border">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete User</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to permanently delete{" "}
                              <strong>{profile.name}</strong>? This action
                              cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel data-ocid="users.delete.cancel_button">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive hover:bg-destructive/90"
                              onClick={() => handleDelete(principal)}
                              data-ocid="users.delete.confirm_button"
                            >
                              {isDeleting ? "Deleting..." : "Delete User"}
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
      )}
    </div>
  );
}
