"use client";

import { RefreshCw, Unlink, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/lib/hooks/use-toast";
import {
  useSyncMonoAccountMutation,
  useUnlinkMonoAccountMutation,
} from "@/lib/store/api/echo-api";
import type { MonoConnection } from "@/types";

interface MonoConnectionsListProps {
  connections: MonoConnection[];
}

export function MonoConnectionsList({ connections }: MonoConnectionsListProps) {
  const { success, error } = useToast();
  const [syncMonoAccount, { isLoading: isSyncing }] =
    useSyncMonoAccountMutation();
  const [unlinkMonoAccount, { isLoading: isUnlinking }] =
    useUnlinkMonoAccountMutation();

  const handleSync = async (id: string) => {
    try {
      await syncMonoAccount(id).unwrap();
      success("Sync started", "Pulling the latest statement from your bank.");
    } catch {
      error("Sync failed", "Could not sync this account right now.");
    }
  };

  const handleUnlink = async (id: string) => {
    try {
      await unlinkMonoAccount(id).unwrap();
      success("Account unlinked", "The bank connection was removed.");
    } catch {
      error("Unlink failed", "Could not remove this connection.");
    }
  };

  if (connections.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No bank accounts linked via Mono yet.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {connections.map((connection:any) => (
        <Card key={connection?.id}>
          <CardContent className="flex items-center justify-between gap-4 p-4">
            <div className="flex items-center gap-3">
              <Landmark className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{connection?.bank_name}</p>
                <p className="text-xs text-muted-foreground">
                  {connection?.account_number ?? connection?.id}
                </p>
              </div>
              <Badge
                variant={
                  connection?.status === "active" ? "default" : "secondary"
                }
              >
                {connection?.status}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleSync(connection?.id)}
                disabled={isSyncing}
              >
                <RefreshCw className="mr-1 h-3.5 w-3.5" />
                Sync
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleUnlink(connection?.id)}
                disabled={isUnlinking}
              >
                <Unlink className="mr-1 h-3.5 w-3.5" />
                Unlink
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
