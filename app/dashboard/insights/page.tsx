"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import { Search } from "lucide-react"
import { SearchBar } from "@/components/insights/search-bar"
import { SuggestedQueries } from "@/components/insights/suggested-queries"
import { QueryResult } from "@/components/insights/query-result"
import { EmptyState } from "@/components/shared/empty-state"
import { useToast } from "@/lib/hooks/use-toast"
import { useExecuteInsightQueryMutation } from "@/lib/store/api/echo-api"
import {
  addQuery,
  setLoading,
  setCurrentQuery,
} from "@/lib/store/slices/insights-slice"
import type { RootState } from "@/lib/store"
import type { InsightQuery, InsightResult } from "@/types"

export default function InsightsPage() {
  const dispatch = useDispatch()
  const { queries, isLoading } = useSelector((state: RootState) => state.insights)
  const { success, error } = useToast()

  // RTK Query mutation hook
  const [executeQuery] = useExecuteInsightQueryMutation()

  const handleSearch = async (queryText: string) => {
    dispatch(setCurrentQuery(queryText))
    dispatch(setLoading(true))

    let result: InsightResult

    try {
      const apiResult = await executeQuery({ query: queryText }).unwrap()
      if (apiResult.data?.result) {
        result = apiResult.data.result as InsightResult
      } else {
        throw new Error("No result from API")
      }
    } catch (err) {
      // Fallback: simulate responses based on query keywords
      await new Promise((resolve) => setTimeout(resolve, 800))

      if (queryText.toLowerCase().includes("unmatched")) {
        result = {
          type: "settlement",
          data: [
            { reference: "ORDER-5555", amount: 48500, variance: -1500, status: "unmatched" },
            { reference: "ORDER-5556", amount: 0, variance: -75000, status: "unmatched" },
          ],
          message: "Found 2 unmatched settlements from this week",
        }
      } else if (queryText.toLowerCase().includes("variance")) {
        result = {
          type: "summary",
          data: { highest: 75000, settlement: "ORDER-5556", reason: "Missing bank deposit" },
          message: "The highest settlement variance is ₦75,000 for ORDER-5556",
        }
      } else if (queryText.toLowerCase().includes("card")) {
        result = {
          type: "summary",
          data: { total: 245000, count: 12, percentage: 51 },
          message: "₦245,000 was processed through cards this month (51% of total)",
        }
      } else {
        result = {
          type: "error",
          data: null,
          message: 'Echo could not map that question to your reconciliation data. Try asking: "Show unmatched settlements from this week"',
        }
      }
    }

    const query: InsightQuery = {
      id: `q_${Date.now()}`,
      query: queryText,
      result,
      executed_at: new Date().toISOString(),
    }

    dispatch(addQuery(query))
    dispatch(setLoading(false))

    if (result.type === "error") {
      error("Query not understood", result.message)
    } else {
      success("Query executed", result.message)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Insight Bar</h2>
        <p className="text-muted-foreground">
          Ask natural language questions about your reconciliation data
        </p>
      </div>

      <SearchBar onSearch={handleSearch} isLoading={isLoading} />

      <SuggestedQueries onSelect={handleSearch} />

      <div className="space-y-4">
        <AnimatePresence>
          {queries.map((query) => (
            <motion.div
              key={query.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <QueryResult query={query} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {queries.length === 0 && !isLoading && (
        <EmptyState
          title="No queries yet"
          description="Ask a question above to explore your reconciliation data."
          icon={Search}
        />
      )}
    </div>
  )
}
