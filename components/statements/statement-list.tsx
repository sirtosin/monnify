"use client"

import { motion } from "framer-motion"
import { FileSpreadsheet, CheckCircle2, AlertTriangle, HelpCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDateTime } from "@/lib/utils/formatters"
import type { BankStatement } from "@/types"

interface StatementListProps {
  statements: BankStatement[]
}

export function StatementList({ statements }: StatementListProps) {
  return (
    <div className="space-y-3">
      {statements.map((statement, index) => (
        <motion.div
          key={statement.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <FileSpreadsheet className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{statement.file_name}</p>
                    <p className="text-xs text-muted-foreground">{statement.bank_name} • {formatDateTime(statement.created_at)}</p>
                  </div>
                </div>
                <Badge variant={statement.status === "completed" ? "default" : "secondary"}>
                  {statement.status}
                </Badge>
              </div>

              <div className="grid grid-cols-4 gap-3 mt-3 pt-3 border-t">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold">{statement.imported_rows}</span>
                  <span className="text-[10px] text-muted-foreground">rows</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-signal-green" />
                  <span className="text-sm font-medium">{statement.matched_count}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <HelpCircle className="h-3.5 w-3.5 text-signal-amber" />
                  <span className="text-sm font-medium">{statement.review_count}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-signal-red" />
                  <span className="text-sm font-medium">{statement.unmatched_count}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
