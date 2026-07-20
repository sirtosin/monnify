import { format, formatDistanceToNow, parseISO } from "date-fns"

export function formatCurrency(amount: number, currency = "NGN"): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatCompactNumber(num: number): string {
  return new Intl.NumberFormat("en-NG", {
    notation: "compact",
    compactDisplay: "short",
  }).format(num)
}

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? parseISO(date) : date
  return format(d, "MMM d, yyyy")
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === "string" ? parseISO(date) : date
  return format(d, "MMM d, yyyy h:mm a")
}

export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === "string" ? parseISO(date) : date
  return formatDistanceToNow(d, { addSuffix: true })
}

export function formatPercentage(value: number, decimals = 1): string {
  return `${value?.toFixed(decimals)}%`
}

export function formatVariance(amount: number): string {
  const prefix = amount >= 0 ? "+" : ""
  return `${prefix}${formatCurrency(amount)}`
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text?.slice(0, maxLength) + "..."
}

export function getConfidenceColor(confidence: number): string {
  if (confidence >= 90) return "text-emerald-600 bg-emerald-500/10"
  if (confidence >= 80) return "text-sky-600 bg-sky-500/10"
  if (confidence >= 70) return "text-amber-600 bg-amber-500/10"
  return "text-red-600 bg-red-500/10"
}

export function getConfidenceLabel(confidence: number): string {
  if (confidence >= 90) return "High confidence"
  if (confidence >= 80) return "Likely match"
  if (confidence >= 70) return "Needs review"
  return "Low confidence"
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "matched":
    case "connected":
      return "text-emerald-600 bg-emerald-500/10 border-emerald-500/20"
    case "unmatched":
    case "disconnected":
      return "text-red-600 bg-red-500/10 border-red-500/20"
    case "needs_review":
    case "connecting":
      return "text-amber-600 bg-amber-500/10 border-amber-500/20"
    case "error":
      return "text-red-600 bg-red-500/10 border-red-500/20"
    default:
      return "text-muted-foreground bg-muted border-border"
  }
}
