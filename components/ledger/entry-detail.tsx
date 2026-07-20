"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { formatCurrency, formatDate } from "@/lib/utils/formatters"
import type { LedgerEntry } from "@/types"

interface EntryDetailProps {
  entry: LedgerEntry | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EntryDetail({ entry, open, onOpenChange }: EntryDetailProps) {
  if (!entry) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[440px]">
        <SheetHeader>
          <SheetTitle>Ledger Entry Details</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Date</p>
              <p className="text-sm font-medium">{formatDate(entry.transaction_date)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Type</p>
              <p className="text-sm font-medium capitalize">{entry.type}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Description</p>
            <p className="text-sm font-medium">{entry.narration}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Reference</p>
            <p className="text-sm font-mono">{entry.extracted_reference}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Amount</p>
            <p className={`text-lg font-bold ${entry.type === "credit" ? "text-emerald-500" : "text-red-500"}`}>
              {entry.type === "credit" ? "+" : "-"}{formatCurrency(entry.amount)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Status</p>
            <p className="text-sm font-medium">{entry.reconciled_status ? "Reconciled" : "Unmatched"}</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
