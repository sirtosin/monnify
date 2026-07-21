"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { BookOpen } from "lucide-react"
import { LedgerTable } from "@/components/ledger/ledger-table"
import { EmptyState } from "@/components/shared/empty-state"
import { useGetLedgerEntriesQuery } from "@/lib/store/api/echo-api"
import { setEntries } from "@/lib/store/slices/ledger-slice"
import type { RootState } from "@/lib/store"

export default function LedgerPage() {
  const dispatch = useDispatch()
  const { entries: localEntries } = useSelector((state: RootState) => state.ledger)

  // RTK Query hook
  const { data: apiEntries } = useGetLedgerEntriesQuery()
  // Sync API data to Redux store
  useEffect(() => {
    if (apiEntries?.data) {
      dispatch(setEntries(apiEntries.data))
    }
  }, [apiEntries, dispatch])

  const entries = apiEntries?.data || localEntries

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Bank Ledger</h2>
        <p className="text-muted-foreground">
          All imported bank statement entries
        </p>
      </div>

      {entries.length === 0 ? (
        <EmptyState
          title="No ledger entries"
          description="Upload a bank statement to begin reconciliation. Echo will extract deposits and match them against your Monnify transactions."
          icon={BookOpen}
        />
      ) : (
        <LedgerTable />
      )}
    </div>
  )
}
