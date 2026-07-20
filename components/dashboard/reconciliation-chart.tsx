"use client"

import { useSelector } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import type { RootState } from "@/lib/store"

const COLORS = {
  matched: "#10b981",
  unmatched: "#ef4444",
  review: "#f59e0b",
}

export function ReconciliationChart() {
  const { metrics } = useSelector((state: RootState) => state.dashboard)

  if (!metrics) return null

  const data = [
     {
      name: "Matched",
      value: metrics.counts.settlements_settled,
      color: COLORS.matched,
    },
    {
      name: "Unmatched",
      value: metrics.counts.settlements_mismatch,
      color: COLORS.unmatched,
    },
    {
      name: "Needs Review",
      value: metrics.counts.settlements_pending * 10000,
      color: COLORS.review,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Settlement Distribution</CardTitle>
        <p className="text-xs text-muted-foreground">Signal → Resonance → Echo</p>
      </CardHeader>
      <CardContent>
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => `₦${value.toLocaleString()}`}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid hsl(var(--border))",
                  background: "hsl(var(--card))",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
