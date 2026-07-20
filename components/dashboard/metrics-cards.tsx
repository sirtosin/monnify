"use client"

import { useSelector } from "react-redux"
import { motion } from "framer-motion"
import {
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Wallet,
  XCircleIcon,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  formatCurrency,
  formatPercentage,
} from "@/lib/utils/formatters"
import type { RootState } from "@/lib/store"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function MetricsCards() {
  const { metrics } = useSelector((state: RootState) => state.dashboard)

  if (!metrics) return null

  const cards = [
    {
      title: "Reconciled Volume",
      subtitle: "Echo Volume",
      value: formatCurrency(metrics.escrow_resonance || 0),
      icon: CheckCircle2,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      // trend: `+${formatPercentage(metrics.settlement_success_rate)}`,
    },
    {
      title: "Unmatched",
      subtitle: "Distorted Signals",
      value: metrics.counts.unreconciled_entries || 0,
      icon: AlertTriangle,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      // trend: `${metrics.recent_matches?.filter((m) => m.status === "unmatched").length || 0} settlements`,
    },
    {
      title: "Needs Review",
      subtitle: "Pending Verification",
      value: metrics.counts.settlements_pending?.toString(),
      icon: HelpCircle,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      trend: "Requires attention",
    },
    // {
    //   title: "Settled",
    //   subtitle: "All Good",
    //   value: metrics.counts.settlements_settled?.toString(),
    //   icon: CheckCircle2,
    //   color: "text-emerald-500",
    //   bgColor: "bg-emerald-500/10",
    //   trend: "",
    // },
    {
      title: "Mismatched",
      subtitle: "Check transactions",
      value: metrics.counts.settlements_mismatch?.toString(),
      icon: XCircleIcon,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      trend: "Requires attention",
    },
    {
      title: "Uncleared Amount",
      subtitle: "Outstanding Balance",
      value: metrics.counts.unreconciled_entries || 0,
      icon: Wallet,
      color: "text-sky-600",
      bgColor: "bg-sky-500/10",
      trend: "Awaiting settlement",
    },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <motion.div key={index} variants={item}>
            <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground/70">
                    {card.subtitle}
                  </p>
                </div>
                <div className={`rounded-lg p-2 ${card.bgColor}`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{card.trend}</p>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
