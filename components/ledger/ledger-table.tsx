"use client"

import { useSelector } from "react-redux"
import { motion } from "framer-motion"
import { CheckCircle2, HelpCircle, XCircle } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate, getConfidenceColor } from "@/lib/utils/formatters"
import type { RootState } from "@/lib/store"

export function LedgerTable() {
  const { entries } = useSelector((state: RootState) => state.ledger)

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Bank Name</TableHead>
            <TableHead>Reference</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Confidence</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry, index) => (
            <motion.tr
              key={entry.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.03 }}
              className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
            >
              <TableCell className="font-medium">{formatDate(entry.transaction_date)}</TableCell>
              <TableCell className="max-w-[200px] truncate">{entry.narration}</TableCell>
              <TableCell className="max-w-[200px] truncate">{entry.bank_name}</TableCell>
              <TableCell className="font-mono text-xs">{entry.extracted_reference}</TableCell>
              <TableCell className="text-right">
                <span className={entry.type === "credit" ? "text-signal-green" : "text-signal-red"}>
                  {entry.type === "credit" ? "+" : "-"}{formatCurrency(entry.amount)}
                </span>
              </TableCell>
              <TableCell>
                {entry.reconciled_status ? (
                  <Badge variant="outline" className="bg-signal-green/10 text-signal-green border-signal-green/20">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Matched
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-signal-red/10 text-signal-red border-signal-red/20">
                    <XCircle className="h-3 w-3 mr-1" />
                    Unmatched
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                {entry.confidence ? (
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${getConfidenceColor(entry.confidence)}`}>
                    {entry.confidence}%
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
