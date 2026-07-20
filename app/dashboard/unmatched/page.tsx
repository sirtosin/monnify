"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, HelpCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MismatchCard } from "@/components/unmatched/mismatch-card"
import { DetailPanel } from "@/components/unmatched/detail-panel"
import { EmptyState } from "@/components/shared/empty-state"
import { useToast } from "@/lib/hooks/use-toast"
import {
  setUnmatched,
  setNeedsReview,
  setSelectedSettlement,
  approveMatch,
  rejectMatch,
} from "@/lib/store/slices/unmatched-slice"
import type { RootState } from "@/lib/store"
import type { SettlementMatch } from "@/types"

export default function UnmatchedPage() {
  const dispatch = useDispatch()
  const { unmatched, needsReview, selectedSettlement } = useSelector(
    (state: RootState) => state.unmatched
  )
  const { success } = useToast()
  const [detailOpen, setDetailOpen] = useState(false)
console.log('unm', unmatched)
  const handleSelect = (settlement: SettlementMatch) => {
    dispatch(setSelectedSettlement(settlement))
    setDetailOpen(true)
  }

  const handleApprove = (id: string) => {
    dispatch(approveMatch(id))
    success("Match approved", "The settlement has been marked as matched.")
    setDetailOpen(false)
  }

  const handleReject = (id: string) => {
    dispatch(rejectMatch(id))
    success("Match rejected", "The settlement has been moved to unmatched.")
    setDetailOpen(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Distorted Signals</h2>
        <p className="text-muted-foreground">
          Unmatched settlements requiring investigation
        </p>
      </div>

      <Tabs defaultValue="unmatched" className="space-y-4">
        <TabsList>
          <TabsTrigger value="unmatched" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            Unmatched ({unmatched.length})
          </TabsTrigger>
          <TabsTrigger value="review" className="gap-2">
            <HelpCircle className="h-4 w-4" />
            Needs Review ({needsReview.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="unmatched" className="space-y-4">
          {unmatched.length === 0 ? (
            <EmptyState
              title="No distorted signals detected"
              description="All processed settlements currently match their expected amounts."
              icon={AlertTriangle}
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <AnimatePresence mode="popLayout">
                {unmatched.map((settlement) => (
                  <MismatchCard
                    key={settlement.id}
                    settlement={settlement}
                    onClick={() => handleSelect(settlement)}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </TabsContent>

        <TabsContent value="review" className="space-y-4">
          {needsReview.length === 0 ? (
            <EmptyState
              title="No pending reviews"
              description="All suggested matches have been processed."
              icon={HelpCircle}
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <AnimatePresence mode="popLayout">
                {needsReview.map((settlement) => (
                  <MismatchCard
                    key={settlement.id}
                    settlement={settlement}
                    onClick={() => handleSelect(settlement)}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <DetailPanel
        settlement={selectedSettlement}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  )
}
