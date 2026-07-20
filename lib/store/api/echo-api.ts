import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type {
  ApiResponse,
  PaginatedResponse,
  AuthResponse,
  RegisterRequest,
  LoginRequest,
  ConnectProcessorRequest,
  LinkMonoRequest,
  InsightQueryRequest,
  ReconciliationFilter,
} from "@/types/api"
import type {
  User,
  PayfacConnection,
  BankStatement,
  LedgerEntry,
  SettlementMatch,
  DashboardMetrics,
  MonoConnection,
  InsightQuery,
  AuditEntry,
} from "@/types"

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as { auth: { token: string } }).auth.token
    if (token) {
      headers.set("authorization", `Bearer ${token}`)
    }
    headers.set("Accept", "application/json")
    return headers
  },
})

export const echoApi = createApi({
  reducerPath: "echoApi",
  baseQuery,
  tagTypes: [
    "Auth",
    "Connections",
    "Statements",
    "Ledger",
    "Settlements",
    "Dashboard",
    "Mono",
    "Insights",
    "Audit",
  ],
  endpoints: (builder) => ({
    // Auth endpoints
    register: builder.mutation<ApiResponse<AuthResponse>, RegisterRequest>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
    login: builder.mutation<ApiResponse<AuthResponse>, LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
    getMe: builder.query<ApiResponse<{ user: User }>, void>({
      query: () => "/auth/me",
      providesTags: ["Auth"],
    }),
    logout: builder.mutation<ApiResponse<void>, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),

    // Payfac Soundboard endpoints
    getConnections: builder.query<ApiResponse<PayfacConnection[]>, void>({
      query: () => "/payfac-connections",
      providesTags: ["Connections"],
    }),
    connectProcessor: builder.mutation<ApiResponse<PayfacConnection>, ConnectProcessorRequest>({
      query: (body) => ({
        url: "/payfac-connections",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Connections"],
    }),
    toggleConnection: builder.mutation<ApiResponse<PayfacConnection>, string>({
      query: (id) => ({
        url: `/payfac-connections/${id}/toggle`,
        method: "PATCH",
      }),
      invalidatesTags: ["Connections"],
    }),
    disconnectProcessor: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/payfac-connections/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Connections"],
    }),

    // Bank Statements endpoints
    getStatements: builder.query<ApiResponse<BankStatement[]>, void>({
      query: () => "/bank-statements",
      providesTags: ["Statements"],
    }),
    getStatement: builder.query<ApiResponse<BankStatement>, string>({
      query: (id) => `/bank-statements/${id}`,
      providesTags: ["Statements"],
    }),
    uploadStatement: builder.mutation<ApiResponse<BankStatement>, FormData>({
      query: (body) => ({
        url: "/bank-statements",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Statements", "Ledger", "Dashboard"],
    }),

    // Ledger endpoints
    getLedgerEntries: builder.query<ApiResponse<LedgerEntry[]>, ReconciliationFilter | void>({
      query: (params) => ({
        url: "/bank-ledger-entries",
        params: params || undefined,
      }),
      providesTags: ["Ledger"],
    }),

    // Mono endpoints
    getMonoConnections: builder.query<ApiResponse<MonoConnection[]>, void>({
      query: () => "/mono/connections",
      providesTags: ["Mono"],
    }),
    linkMonoAccount: builder.mutation<ApiResponse<MonoConnection>, LinkMonoRequest>({
      query: (body) => ({
        url: "/mono/link",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Mono"],
    }),
    syncMonoAccount: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/mono/connections/${id}/sync`,
        method: "POST",
      }),
      invalidatesTags: ["Mono", "Ledger", "Dashboard"],
    }),
    unlinkMonoAccount: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/mono/connections/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Mono"],
    }),

    // Reconciliation endpoints
    runReconciliation: builder.mutation<ApiResponse<void>, void>({
      query: () => ({
        url: "/reconciliation/run",
        method: "POST",
      }),
      invalidatesTags: ["Settlements", "Dashboard", "Ledger"],
    }),
    getDashboardMetrics: builder.query<ApiResponse<DashboardMetrics>, void>({
      query: () => "/dashboard/metrics",
      providesTags: ["Dashboard"],
    }),

    // Insights endpoints
    executeInsightQuery: builder.mutation<ApiResponse<InsightQuery>, InsightQueryRequest>({
      query: (body) => ({
        url: "/insights/query",
        method: "POST",
        body,
      }),
    }),

    // Audit endpoints
    getAuditTrail: builder.query<ApiResponse<AuditEntry[]>, string>({
      query: (settlementId) => `/audit-trail?settlement_id=${settlementId}`,
      providesTags: ["Audit"],
    }),
  }),
})

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetMeQuery,
  useLogoutMutation,
  useGetConnectionsQuery,
  useConnectProcessorMutation,
  useToggleConnectionMutation,
  useDisconnectProcessorMutation,
  useGetStatementsQuery,
  useGetStatementQuery,
  useUploadStatementMutation,
  useGetLedgerEntriesQuery,
  useGetMonoConnectionsQuery,
  useLinkMonoAccountMutation,
  useSyncMonoAccountMutation,
  useUnlinkMonoAccountMutation,
  useRunReconciliationMutation,
  useGetDashboardMetricsQuery,
  useExecuteInsightQueryMutation,
  useGetAuditTrailQuery,
} = echoApi
