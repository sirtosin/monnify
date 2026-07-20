"use client"

import { Search } from "lucide-react"

export function InsightsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
        <Search className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-1">No queries yet</h3>
      <p className="text-sm text-muted-foreground">Ask a question above to explore your reconciliation data.</p>
    </div>
  )
}
