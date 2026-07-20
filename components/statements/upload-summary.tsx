"use client"

import { motion } from "framer-motion"
import { CheckCircle2, AlertTriangle, HelpCircle, FileCheck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { BankStatement } from "@/types"

interface UploadSummaryProps {
  statement: BankStatement
  onViewLedger: () => void
}

export function UploadSummary({ statement, onViewLedger }: UploadSummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-emerald-500/30 bg-emerald-500/5">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
              <FileCheck className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <h3 className="font-semibold text-emerald-600">Statement processed successfully</h3>
              <p className="text-sm text-muted-foreground">{statement.file_name}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-background">
              <span className="text-2xl font-bold">{statement.imported_rows}</span>
              <span className="text-xs text-muted-foreground">rows imported</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-background">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <div>
                <span className="text-lg font-bold">{statement.matched_count}</span>
                <span className="text-xs text-muted-foreground ml-1">matched</span>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-background">
              <HelpCircle className="h-4 w-4 text-amber-500" />
              <div>
                <span className="text-lg font-bold">{statement.review_count}</span>
                <span className="text-xs text-muted-foreground ml-1">need review</span>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-background">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <div>
                <span className="text-lg font-bold">{statement.unmatched_count}</span>
                <span className="text-xs text-muted-foreground ml-1">unmatched</span>
              </div>
            </div>
          </div>

          <Button onClick={onViewLedger} className="w-full">View Ledger Entries</Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
