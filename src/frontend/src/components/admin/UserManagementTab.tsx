import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Ban, Search, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useBanUser,
  useGetAllUsers,
  useRemoveUser,
} from "../../hooks/useQueries";

export default function UserManagementTab() {
  const [search, setSearch] = useState("");
  const { data: users, isLoading, error } = useGetAllUsers();
  const banUser = useBanUser();
  const removeUser = useRemoveUser();

  const filtered = (users ?? []).filter(
    ([, profile]) =>
      profile.name.toLowerCase().includes(search.toLowerCase()) ||
      profile.username.toLowerCase().includes(search.toLowerCase()),
  );

  if (isLoading)
    return (
      <div
        className="flex items-center justify-center py-12"
        data-ocid="users.loading_state"
      >
        <div className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  if (error)
    return (
      <Alert variant="destructive" data-ocid="users.error_state">
        <AlertDescription>
          Failed to load users. You may need to log in via Internet Identity
          first.
        </AlertDescription>
      </Alert>
    );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 cyber-border bg-background/50"
          data-ocid="users.search_input"
        />
      </div>
      {filtered.length === 0 ? (
        <div
          className="text-center py-12 text-muted-foreground"
          data-ocid="users.empty_state"
        >
          <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p>No users found.</p>
        </div>
      ) : (
        <div
          className="rounded-lg border border-border/50 overflow-hidden"
          data-ocid="users.table"
        >
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 bg-muted/20">
                <TableHead>#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Principal</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(([principal, profile], idx) => (
                <TableRow
                  key={principal.toString()}
                  className="border-border/30 hover:bg-muted/10"
                  data-ocid={`users.row.${idx + 1}`}
                >
                  <TableCell className="text-muted-foreground font-mono text-xs">
                    {idx + 1}
                  </TableCell>
                  <TableCell className="font-medium">{profile.name}</TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    @{profile.username}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        profile.role === "admin"
                          ? "bg-primary/20 text-primary border-primary/40"
                          : "bg-accent/10 text-accent border-accent/30"
                      }
                    >
                      {profile.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {principal.toString().slice(0, 16)}...
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-yellow-500/40 hover:bg-yellow-500/10 hover:text-yellow-400 text-yellow-500"
                        disabled={banUser.isPending}
                        onClick={() =>
                          banUser.mutate(principal, {
                            onSuccess: () =>
                              toast.success(`Banned ${profile.name}`),
                            onError: () => toast.error("Failed to ban user"),
                          })
                        }
                        data-ocid={`users.ban.button.${idx + 1}`}
                      >
                        <Ban className="h-3 w-3 mr-1" /> Ban
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
                        disabled={removeUser.isPending}
                        onClick={() => {
                          if (confirm(`Remove user "${profile.name}"?`))
                            removeUser.mutate(principal, {
                              onSuccess: () =>
                                toast.success(`Removed ${profile.name}`),
                              onError: () =>
                                toast.error("Failed to remove user"),
                            });
                        }}
                        data-ocid={`users.delete_button.${idx + 1}`}
                      >
                        <Trash2 className="h-3 w-3 mr-1" /> Remove
                      </Button>
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
