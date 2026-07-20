"use client"

import { motion } from "framer-motion"
import { Lightbulb } from "lucide-react"
import { SUGGESTED_QUERIES } from "@/lib/utils/constants"

interface SuggestedQueriesProps {
  onSelect: (query: string) => void
}

export function SuggestedQueries({ onSelect }: SuggestedQueriesProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Lightbulb className="h-4 w-4" />
        <span>Try asking:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {SUGGESTED_QUERIES.map((query, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelect(query)}
            className="px-3 py-1.5 rounded-full text-sm bg-muted hover:bg-primary/10 hover:text-primary transition-colors border"
          >
            {query}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
