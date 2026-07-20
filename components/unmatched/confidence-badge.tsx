"use client"

import { getConfidenceColor } from "@/lib/utils/formatters"

interface ConfidenceBadgeProps {
  confidence: number
  showLabel?: boolean
}

export function ConfidenceBadge({ confidence, showLabel = true }: ConfidenceBadgeProps) {
  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${getConfidenceColor(confidence)}`}>
      <div className={`h-1.5 w-1.5 rounded-full ${
        confidence >= 90 ? "bg-emerald-500" :
        confidence >= 80 ? "bg-sky-500" :
        confidence >= 70 ? "bg-amber-500" : "bg-red-500"
      }`} />
      <span>{confidence}%</span>
      {showLabel && <span className="hidden sm:inline">— {confidence >= 90 ? "High confidence" : confidence >= 80 ? "Likely match" : confidence >= 70 ? "Needs review" : "Low confidence"}</span>}
    </div>
  )
}
