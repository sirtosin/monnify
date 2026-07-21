// API Request/Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Matches the actual API shape: { success, message, data: [...], pagination: {...} }
export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
  };
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  merchant_name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    merchant_id: string;
    merchant: {
      id: string;
      name: string;
      slug: string;
      email: string;
      is_active: boolean;
      created_at: string;
    };
    created_at: string;
  };
}

export interface ConnectProcessorRequest {
  payfac_source: "MONNIFY" | "PAYSTACK" | "FLUTTERWAVE";
  environment: "SANDBOX" | "LIVE";
  api_key: string;
  secret_key: string;
  contract_code: string;
  ingest_mode?: "WEBHOOK" | "API_PULL";
  pull_interval_minutes?: number | null;
}

export interface UpdatePayfacConnectionRequest {
  ingest_mode?: "WEBHOOK" | "API_PULL";
  pull_interval_minutes?: number | null;
}

export interface PullTransactionsResponse {
  imported: number;
  last_pulled_at: string;
}

export interface UploadStatementRequest {
  bank_name: string;
  statement: File;
}

export interface LinkMonoRequest {
  code: string;
}

// Single canonical filter type for GET /bank-ledger-entries
export interface ReconciliationFilter {
  reconciled?: boolean;
  bank_name?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
  page?: number;
  per_page?: number;
}

export interface RunReconciliationResponse {
  processed: number;
  settled: number;
  mismatched: number;
  unmatched: number;
}

export interface ReconciliationSchedule {
  reconciliation_times: string[];
  timezone: string;
}

export interface InsightQueryRequest {
  query: string;
}

// Dashboard metrics — matches the ACTUAL API response, not the aspirational
// echo.txt shape. Extend this once the backend adds richer fields.
export interface DashboardMetricsResponse {
  cleared_echo_cash: number;
  escrow_resonance: number;
  distorted_signals: {
    count: number;
    total_variance: number;
  };
  counts: {
    settlements_settled: number;
    settlements_pending: number;
    settlements_mismatch: number;
    unreconciled_entries: number;
  };
}
