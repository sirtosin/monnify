import type { 
  DashboardMetrics, 
  SettlementMatch, 
  PayfacConnection, 
  BankStatement, 
  LedgerEntry,
  MonoConnection,
  AuditEntry,
  User,
  DashboardMetrics2
} from "@/types"

export const demoUser: User = {
  id: "usr_001",
  name: "Ada Founder",
  email: "ada@brightstore.ng",
  merchant: {
    id: "mer_001",
    name: "Bright Store",
    email: "ada@brightstore.ng",
    created_at: "2026-01-15T10:00:00Z",
  },
}

export const demoConnections: PayfacConnection[] = [

]

export const demoStatements: BankStatement[] = [
  {
    id: "stmt_001",
    bank_name: "GTBANK",
    file_name: "gtbank_statement_july_2026.csv",
    imported_rows: 42,
    matched_count: 38,
    review_count: 3,
    unmatched_count: 1,
    status: "completed",
    created_at: "2026-07-19T10:00:00Z",
  },
]

export const demoLedgerEntries: LedgerEntry[] = [
  {
    id: "led_001",
    statement_id: "stmt_001",
    transaction_date: "2026-07-18",
    narration: "Monnify Settlement - ORDER-5551",
    amount: 48500,
    type: "credit",
    extracted_reference: "MNFY|T|20260718|0001",
    reconciled_status: true,
    matched_transaction_id: "txn_001",
    confidence: 98,
    created_at: "2026-07-19T10:00:00Z",
    bank_name:'Access'
  },
  {
    id: "led_002",
    statement_id: "stmt_001",
    transaction_date: "2026-07-18",
    narration: "Monnify Settlement - ORDER-5552",
    amount: 49250,
    type: "credit",
    extracted_reference: "MNFY|T|20260718|0002",
    reconciled_status: true,
    matched_transaction_id: "txn_002",
    confidence: 95,
    created_at: "2026-07-19T10:00:00Z",
    bank_name:'Access'

  },
  {
    id: "led_003",
    statement_id: "stmt_001",
    transaction_date: "2026-07-18",
    narration: "Transfer from Monnify - ORDER-5553",
    amount: 47500,
    type: "credit",
    extracted_reference: "MNFY|T|20260718|0003",
    reconciled_status: true,
    matched_transaction_id: "txn_003",
    confidence: 84,
    created_at: "2026-07-19T10:00:00Z",
    bank_name:'Access'

  },
  {
    id: "led_004",
    statement_id: "stmt_001",
    transaction_date: "2026-07-18",
    narration: "Monnify Settlement - ORDER-5554",
    amount: 48500,
    type: "credit",
    extracted_reference: "MNFY|T|20260718|0004",
    reconciled_status: false,
    matched_transaction_id: null,
    confidence: null,
    created_at: "2026-07-19T10:00:00Z",
    bank_name:'Access'

  },
]

export const demoUnmatchedSettlements: SettlementMatch[] = [
  {
    id: "set_001",
    transaction_reference: "MNFY|T|20260718|0005",
    payment_reference: "ORDER-5555",
    expected_amount: 50000,
    received_amount: 48500,
    variance: -1500,
    status: "unmatched",
    confidence: 0,
    payfac_connection_id: "conn_001",
    bank_statement_id: "stmt_001",
    fee_rule_applied: {
      id: "fee_001",
      name: "Card Processing Fee",
      type: "percentage",
      value: 1.5,
      payment_method: "CARD",
      applies_to: "all",
    },
    diagnosis: "The amount received is ₦1,500 lower than expected. This may be caused by a fee deduction or a missing transaction. Review the fee configuration and the transactions included in this settlement.",
    recommended_action: "Confirm the applicable fee rule or inspect the related Monnify webhook payload.",
    created_at: "2026-07-18T09:15:00Z",
    updated_at: "2026-07-19T10:00:00Z",
  },
  {
    id: "set_002",
    transaction_reference: "MNFY|T|20260718|0006",
    payment_reference: "ORDER-5556",
    expected_amount: 75000,
    received_amount: 0,
    variance: -75000,
    status: "unmatched",
    confidence: 0,
    payfac_connection_id: "conn_001",
    bank_statement_id: "stmt_001",
    fee_rule_applied: null,
    diagnosis: "No bank deposit was found for this settlement. The transaction was marked as PAID in Monnify but no corresponding credit appears in the bank statement.",
    recommended_action: "Verify if the settlement is delayed. Check Monnify dashboard for settlement status and expected date.",
    created_at: "2026-07-18T11:30:00Z",
    updated_at: "2026-07-19T10:00:00Z",
  },
]

export const demoNeedsReview: SettlementMatch[] = [
  {
    id: "set_003",
    transaction_reference: "MNFY|T|20260718|0007",
    payment_reference: "ORDER-5557",
    expected_amount: 32000,
    received_amount: 31520,
    variance: -480,
    status: "needs_review",
    confidence: 74,
    payfac_connection_id: "conn_001",
    bank_statement_id: "stmt_001",
    fee_rule_applied: {
      id: "fee_002",
      name: "Transfer Fee",
      type: "fixed",
      value: 50,
      payment_method: "BANK_TRANSFER",
      applies_to: "all",
    },
    diagnosis: "Amounts match approximately. Settlement dates are one day apart, and the narration contains the Monnify extracted_reference. Confidence is 74% due to slight amount variance.",
    recommended_action: "Review and approve if the variance matches expected fees. Reject if the amount difference is unexplained.",
    created_at: "2026-07-18T14:00:00Z",
    updated_at: "2026-07-19T10:00:00Z",
  },
]

export const demoMetrics: DashboardMetrics2 = {
  total_reconciled: 480000,
  total_unmatched: 20000,
  total_needs_review: 1,
  uncleared_amount: 20000,
  reconciled_volume: 480000,
  total_transactions: 42,
  settlement_success_rate: 92.3,
  recent_matches: [...demoUnmatchedSettlements, ...demoNeedsReview],
}

export const demoMonoConnections: MonoConnection[] = [

]

export const demoAuditTrail: AuditEntry[] = [
  {
    id: "aud_001",
    settlement_id: "set_001",
    action: "match_created",
    previous_status: "pending",
    current_status: "unmatched",
    user_id: "system",
    user_name: "System",
    metadata: { confidence: 0, method: "auto" },
    created_at: "2026-07-19T10:00:00Z",
  },
  {
    id: "aud_002",
    settlement_id: "set_003",
    action: "match_suggested",
    previous_status: "pending",
    current_status: "needs_review",
    user_id: "system",
    user_name: "System",
    metadata: { confidence: 74, method: "semantic" },
    created_at: "2026-07-19T10:00:00Z",
  },
]

export function resetDemoData() {
  // In a real app, this would reset the Redux store and localStorage
  return {
    user: demoUser,
    connections: demoConnections,
    statements: demoStatements,
    ledger: demoLedgerEntries,
    unmatched: demoUnmatchedSettlements,
    needsReview: demoNeedsReview,
    metrics: demoMetrics,
    monoConnections: demoMonoConnections,
    auditTrail: demoAuditTrail,
  }
}
