"use client"

import { useSelector } from "react-redux"
import { motion } from "framer-motion"
import { Clock, User, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { formatDateTime } from "@/lib/utils/formatters"
import type { RootState } from "@/lib/store"

interface AuditTrailProps {
  settlementId: string
}

export function AuditTrail({ settlementId }: AuditTrailProps) {
  const { auditTrail } = useSelector((state: RootState) => state.unmatched)
  const entries = auditTrail?.filter((a) => a.settlement_id === settlementId)

  if (entries.length === 0) {
    return (
      <div className="text-sm text-muted-foreground text-center py-4">
        No audit history available
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold flex items-center gap-2">
        <Clock className="h-4 w-4 text-primary" />
        Audit Trail
      </h4>
      <div className="space-y-3">
        {entries.map((entry:any, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex gap-3 p-3 rounded-lg bg-muted/50"
          >
            <div className="mt-0.5">
              {entry.action === "match_created" && <CheckCircle2 className="h-4 w-4 text-signal-green" />}
              {entry.action === "match_suggested" && <AlertCircle className="h-4 w-4 text-signal-amber" />}
              {entry.action === "match_rejected" && <XCircle className="h-4 w-4 text-signal-red" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium capitalize">{entry.action.replace(/_/g, " ")}</span>
                <span className="text-xs text-muted-foreground">{formatDateTime(entry.created_at)}</span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <User className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{entry.user_name}</span>
              </div>
              {entry.metadata && (
                <div className="mt-1 text-xs text-muted-foreground">
                  {entry.metadata.confidence && `Confidence: ${entry.metadata.confidence}%`}
                  {entry.metadata.method && ` • Method: ${entry.metadata.method}`}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
