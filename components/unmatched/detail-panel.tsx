"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckCircle2, XCircle, FileText, ArrowRight } from "lucide-react"
import { ConfidenceBadge } from "./confidence-badge"
import { AuditTrail } from "./audit-trail"
import { formatCurrency, formatDateTime, getStatusColor } from "@/lib/utils/formatters"
import type { SettlementMatch } from "@/types"

interface DetailPanelProps {
  settlement: SettlementMatch | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onApprove: (id: string) => void
  onReject: (id: string) => void
}

export function DetailPanel({ settlement, open, onOpenChange, onApprove, onReject }: DetailPanelProps) {
  if (!settlement) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[540px] overflow-hidden">
        <SheetHeader className="pb-4">
          <div className="flex items-center gap-2">
            <SheetTitle className="text-lg">Settlement Details</SheetTitle>
            <Badge variant="outline" className={getStatusColor(settlement.status)}>
              {settlement.status.replace("_", " ")}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{settlement.payment_reference}</p>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="space-y-6 pr-4">
            {/* Amount Comparison */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">Expected</p>
                <p className="text-lg font-semibold">{formatCurrency(settlement.expected_amount)}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">Received</p>
                <p className="text-lg font-semibold">{formatCurrency(settlement.received_amount)}</p>
              </div>
              <div className={`p-4 rounded-lg ${settlement.variance < 0 ? "bg-red-500/10" : "bg-emerald-500/10"}`}>
                <p className="text-xs text-muted-foreground mb-1">Variance</p>
                <p className={`text-lg font-semibold ${settlement.variance < 0 ? "text-red-500" : "text-emerald-500"}`}>
                  {settlement.variance >= 0 ? "+" : ""}{formatCurrency(settlement.variance)}
                </p>
              </div>
            </div>

            {/* Confidence */}
            {settlement.confidence > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Matching Confidence:</span>
                <ConfidenceBadge confidence={settlement.confidence} />
              </div>
            )}

            {/* Echo Diagnosis */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Echo Diagnosis
              </h4>
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                <p className="text-sm leading-relaxed">{settlement.diagnosis}</p>
              </div>
            </div>

            {/* Recommended Action */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-primary" />
                Recommended Action
              </h4>
              <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
                <p className="text-sm leading-relaxed">{settlement.recommended_action}</p>
              </div>
            </div>

            {/* Fee Rule */}
            {settlement.fee_rule_applied && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold">Fee Rule Applied</h4>
                <div className="p-3 rounded-lg bg-muted/50 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Name</span>
                    <span>{settlement.fee_rule_applied.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Type</span>
                    <span className="capitalize">{settlement.fee_rule_applied.type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Value</span>
                    <span>{settlement.fee_rule_applied.value}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Payment Method</span>
                    <span>{settlement.fee_rule_applied.payment_method}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Transaction Details */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Transaction Information</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Reference</span>
                  <span className="font-mono text-xs">{settlement.transaction_reference}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Payment Ref</span>
                  <span className="font-mono text-xs">{settlement.payment_reference}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Created</span>
                  <span>{formatDateTime(settlement.created_at)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span>{formatDateTime(settlement.updated_at)}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Audit Trail */}
            <AuditTrail settlementId={settlement.id} />

            {/* Actions */}
            {settlement.status === "needs_review" && (
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1 border-red-500/30 hover:bg-red-500/10" onClick={() => onReject(settlement.id)}>
                  <XCircle className="h-4 w-4 mr-2 text-red-500" />
                  Reject Match
                </Button>
                <Button className="flex-1 bg-emerald-500 hover:bg-emerald-500/90" onClick={() => onApprove(settlement.id)}>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Approve Match
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
