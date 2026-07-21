export const APP_NAME = "Echo"
export const APP_TAGLINE = "End-to-End Reconciliation Engine"

export const NAV_ITEMS = [
  { label: "Dashboard", href: "/", icon: "LayoutDashboard", themeLabel: "Echo Console" },
  { label: "Soundboard", href: "/soundboard", icon: "Radio", themeLabel: "Payment Connections" },
  { label: "Statements", href: "/statements", icon: "FileSpreadsheet", themeLabel: "Bank Statements" },
  { label: "Ledger", href: "/ledger", icon: "BookOpen", themeLabel: "Bank Ledger" },
  { label: "Distortions", href: "/unmatched", icon: "AlertTriangle", themeLabel: "Unmatched Settlements" },
  { label: "Insights", href: "/insights", icon: "Search", themeLabel: "Insight Bar" },
  { label: "Settings", href: "/settings", icon: "Settings", themeLabel: "Configuration" },
]

export const PROCESSING_STEPS = [
  { id: "validate", label: "Validating file format", description: "Checking CSV/Excel structure" },
  { id: "normalize", label: "Normalizing dates", description: "Converting date formats to ISO 8601" },
  { id: "extract", label: "Extracting references", description: "Parsing bank references and narrations" },
  { id: "match", label: "Matching transactions", description: "Comparing with Monnify records" },
  { id: "fees", label: "Calculating fees", description: "Applying fee rules and settlement variances" },
  { id: "insights", label: "Generating insights", description: "Building reconciliation report" },
]

export const SUGGESTED_QUERIES = [
  "Show unmatched settlements from this week",
  "What caused the highest settlement variance?",
  "Show failed bank transfers from yesterday",
  "How much was processed through cards this month?",
  "Which settlements still need review?",
  "Show all fee deductions from last week",
]

export const BANKS = [
  "GTBANK", "ZENITH", "ACCESS", "UBA", "FIRST_BANK",
  "FIDELITY", "ECOBANK", "UNION", "STANBIC", "WEMA",
]

export const PAYFAC_SOURCES = [
  { value: "MONNIFY", label: "Monnify", color: "#0ea5e9" },
  // { value: "PAYSTACK", label: "Paystack", color: "#10b981" },
  // { value: "FLUTTERWAVE", label: "Flutterwave", color: "#8b5cf6" },
]

export const CONNECTION_STATUS_CONFIG = {
  connected: {
    label: "Connected",
    color: "bg-emerald-500",
    animation: "animate-pulse",
    icon: "CheckCircle2",
  },
  connecting: {
    label: "Connecting",
    color: "bg-amber-500",
    animation: "animate-pulse",
    icon: "Loader2",
  },
  disconnected: {
    label: "Disconnected",
    color: "bg-muted-foreground",
    animation: "",
    icon: "PowerOff",
  },
  error: {
    label: "Connection Error",
    color: "bg-red-500",
    animation: "animate-pulse",
    icon: "AlertCircle",
  },
}

export const DEMO_DATA = {
  merchant: {
    name: "Bright Store",
    email: "ada@brightstore.ng",
  },
  dashboard: {
    total_reconciled: 480000,
    total_unmatched: 20000,
    total_needs_review: 1,
    uncleared_amount: 20000,
    reconciled_volume: 480000,
    total_transactions: 42,
    settlement_success_rate: 92.3,
  },
}
