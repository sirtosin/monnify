"use client"

import { useSelector } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPercentage, getStatusColor } from "@/lib/utils/formatters"
import type { RootState } from "@/lib/store"

export function StatusOverview() {
  const { metrics } = useSelector((state: RootState) => state.dashboard)
  const { connections } = useSelector((state: RootState) => state.soundboard)

  if (!metrics) return null

  const total =
    metrics.counts.unreconciled_entries + metrics.counts.settlements_mismatch;
  const reconciledPercent =
    total > 0 ? (metrics.counts.settlements_settled / total) * 100 : 0;


  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Connection Health</CardTitle>
        <p className="text-xs text-muted-foreground">Live payment processor status</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {connections.map((conn:any) => (
          <div key={conn.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div
                  className={`h-3 w-3 rounded-full ${
                    conn.status === "connected"
                      ? "bg-emerald-500 animate-pulse"
                      : conn.status === "connecting"
                      ? "bg-amber-500 animate-pulse"
                      : conn.status === "disconnected"
                      ? "bg-muted-foreground"
                      : "bg-red-500 animate-pulse"
                  }`}
                />
              </div>
              <div>
                <p className="text-sm font-medium">{conn.payfac_source}</p>
                <p className="text-xs text-muted-foreground">{conn.environment}</p>
              </div>
            </div>
            <Badge variant="outline" className={getStatusColor(conn.status)}>
              {conn.status}
            </Badge>
          </div>
        ))}

        <div className="pt-4 border-t">
          <div className="flex justify-between text-sm mb-2">
            <span>Settlement Success Rate</span>
            <span className="font-medium">
              {/* {formatPercentage(metrics.\)} */}
            </span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-1000"
              style={{ width: `${reconciledPercent}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
