"use client"

import { motion } from "framer-motion"
import { Search, AlertCircle, CheckCircle2, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils/formatters"
import type { InsightQuery } from "@/types"

interface QueryResultProps {
  query: InsightQuery
}

export function QueryResult({ query }: QueryResultProps) {
  const { result }:any = query

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 shrink-0">
            <Search className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{query.query}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {new Date(query.executed_at).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="mt-4 pl-11">
          {result.type === "error" ? (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-signal-red/5 border border-signal-red/20">
              <AlertCircle className="h-4 w-4 text-signal-red shrink-0 mt-0.5" />
              <p className="text-sm text-signal-red">{result.message}</p>
            </div>
          ) : result.type === "summary" ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-signal-green" />
                <p className="text-sm font-medium">{result.message}</p>
              </div>
              {result.data && typeof result.data === "object" && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {Object.entries(result.data).map(([key, value]) => (
                    <div key={key} className="p-2 rounded bg-muted/50">
                      <p className="text-[10px] text-muted-foreground uppercase">{key.replace(/_/g, " ")}</p>
                      <p className="text-sm font-medium">
                        {typeof value === "number" ? formatCurrency(value) : String(value)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-signal-green" />
                <p className="text-sm font-medium">{result.message}</p>
              </div>
              {Array.isArray(result.data) && (
                <div className="space-y-2 mt-2">
                  {result.data.map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded bg-muted/50 text-sm">
                      <span>{item.reference || item.name || `Item ${i + 1}`}</span>
                      <span className="font-medium">
                        {typeof item.amount === "number" ? formatCurrency(item.amount) : ""}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
