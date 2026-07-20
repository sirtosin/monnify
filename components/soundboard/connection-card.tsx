"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Power, Trash2, Copy, Check, Radio } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusIndicator } from "./status-indicator";
import { useToast } from "@/lib/hooks/use-toast";
import type { PayfacConnection } from "@/types";

interface ConnectionCardProps {
  connection: PayfacConnection;
  onToggle: (id: string) => void;
  onDisconnect: (id: string) => void;
}

export function ConnectionCard({
  connection,
  onToggle,
  onDisconnect,
}: ConnectionCardProps) {
  const [copied, setCopied] = useState(false);
  const { success } = useToast();

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(connection.webhook_url);
    setCopied(true);
    success("Webhook URL copied");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-[320px] sm::w-fit"
    >
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Radio className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold truncate">
                  {connection.payfac_source}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {connection.environment}
                </p>
              </div>
            </div>
            <StatusIndicator status={connection.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
            <code className="flex-1 min-w-0 text-xs truncate">
              {connection.webhook_url}
            </code>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0"
              onClick={handleCopyWebhook}
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>

          <div className="flex flex-col gap-2 xs:flex-row">
            <Button
              variant="outline"
              size="sm"
              className="w-full xs:flex-1"
              onClick={() => onToggle(connection.id)}
            >
              <Power className="h-3.5 w-3.5 mr-1" />
              {connection.is_active ? "Deactivate" : "Activate"}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="w-full xs:w-auto"
              onClick={() => onDisconnect(connection.id)}
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Disconnect
            </Button>
          </div>

          {connection.last_sync_at && (
            <p className="text-xs text-muted-foreground">
              Last sync: {new Date(connection.last_sync_at).toLocaleString()}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
