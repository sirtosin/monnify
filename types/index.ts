// Echo Theme Types
export interface Merchant {
  id: string
  name: string
  email: string
  created_at: string
}

export interface User {
  id: string
  name: string
  email: string
  merchant: Merchant
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Connection Types
export type PayfacSource = 'MONNIFY' | 'PAYSTACK' | 'FLUTTERWAVE'
export type Environment = 'SANDBOX' | 'LIVE'
export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'error'

export interface PayfacConnection {
  id: string
  payfac_source: PayfacSource
  environment: Environment
  api_key: string
  secret_key: string
  contract_code: string
  webhook_url: string
  status: ConnectionStatus
  is_active: boolean
  last_sync_at: string | null
  last_webhook_at: string | null
  created_at: string
}

// Statement Types
export interface BankStatement {
  id: string
  bank_name: string
  file_name: string
  imported_rows: number
  matched_count: number
  review_count: number
  unmatched_count: number
  status: 'processing' | 'completed' | 'failed'
  created_at: string
}

export interface LedgerEntry {
  id: string
  statement_id: string
  transaction_date: string
  bank_name: string
  narration: string
  amount: number
  type: 'credit' | 'debit'
  extracted_reference: string
  reconciled_status: boolean
  matched_transaction_id: string | null
  confidence: number | null
  created_at: string
}

// Reconciliation Types
export interface SettlementMatch {
  id: string
  transaction_reference: string
  payment_reference: string
  expected_amount: number
  received_amount: number
  variance: number
  status: 'matched' | 'unmatched' | 'needs_review'
  confidence: number
  payfac_connection_id: string
  bank_statement_id: string
  fee_rule_applied: FeeRule | null
  diagnosis: string
  recommended_action: string
  created_at: string
  updated_at: string
}

export interface FeeRule {
  id: string
  name: string
  type: 'fixed' | 'percentage' | 'cap' | 'minimum' | 'vat'
  value: number
  payment_method: string
  applies_to: string
}

export interface DashboardMetrics2 {
  total_reconciled: number
  total_unmatched: number
  total_needs_review: number
  uncleared_amount: number
  reconciled_volume: number
  total_transactions: number
  settlement_success_rate: number
  recent_matches: SettlementMatch[]
}
export interface DashboardMetrics {
  cleared_echo_cash: number
  escrow_resonance: number
  distorted_signals: DistortedSignals
  counts: Counts
}

export interface DistortedSignals {
  count: number
  total_variance: number
}

export interface Counts {
  settlements_settled: number
  settlements_pending: number
  settlements_mismatch: number
  unreconciled_entries: number
}


// Insight Types
export interface InsightQuery {
  id: string
  query: string
  result: InsightResult
  executed_at: string
}

export interface InsightResult {
  type: 'settlement' | 'transaction' | 'summary' | 'error'
  data: unknown
  message: string
}

// Mono Types
export interface MonoConnection {
  id: string
  institution: string
  account_number: string
  account_name: string
  status: ConnectionStatus
  last_sync_at: string | null
  created_at: string
}

// Audit Types
export interface AuditEntry {
  id: string
  settlement_id: string
  action: string
  previous_status: string
  current_status: string
  user_id: string
  user_name: string
  metadata: Record<string, unknown>
  created_at: string
}

// UI Types
export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
}

export type ProcessingStep = {
  id: string
  label: string
  description: string
  status: 'pending' | 'active' | 'completed'
}
