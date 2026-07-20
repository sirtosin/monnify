"use client"

import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ConfidenceBadge } from "./confidence-badge"
import { formatCurrency, getStatusColor } from "@/lib/utils/formatters"
import type { SettlementMatch } from "@/types"

interface MismatchCardProps {
  settlement: SettlementMatch
  onClick: () => void
}

export function MismatchCard({ settlement, onClick }: MismatchCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className="cursor-pointer"
      onClick={onClick}
    >
      <Card className="hover:shadow-md transition-shadow border-l-4 border-l-red-500">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className={getStatusColor(settlement.status)}>
                  {settlement.status.replace("_", " ")}
                </Badge>
                {settlement.confidence > 0 && (
                  <ConfidenceBadge confidence={settlement.confidence} showLabel={false} />
                )}
              </div>
              <h4 className="font-medium text-sm truncate">{settlement.payment_reference}</h4>
              <p className="text-xs text-muted-foreground mt-0.5">{settlement.transaction_reference}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
          </div>

          <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase">Expected</p>
              <p className="text-sm font-semibold">{formatCurrency(settlement.expected_amount)}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase">Received</p>
              <p className="text-sm font-semibold">{formatCurrency(settlement.received_amount)}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase">Variance</p>
              <p className={`text-sm font-semibold ${settlement.variance < 0 ? "text-red-500" : "text-emerald-500"}`}>
                {settlement.variance >= 0 ? "+" : ""}{formatCurrency(settlement.variance)}
              </p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{settlement.diagnosis}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
