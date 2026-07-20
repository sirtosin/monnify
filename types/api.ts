// API Request/Response Types
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  password_confirmation: string
  merchant_name: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: {
    id: string
    name: string
    email: string
    merchant: {
      id: string
      name: string
    }
  }
}

export interface ConnectProcessorRequest {
  payfac_source: 'MONNIFY' | 'PAYSTACK' | 'FLUTTERWAVE'
  environment: 'SANDBOX' | 'LIVE'
  api_key: string
  secret_key: string
  contract_code: string
}

export interface UploadStatementRequest {
  bank_name: string
  statement: File
}

export interface LinkMonoRequest {
  code: string
}

export interface ReconciliationFilter {
  reconciled?: boolean
  bank_name?: string
  start_date?: string
  end_date?: string
  status?: string
}

export interface InsightQueryRequest {
  query: string
}
