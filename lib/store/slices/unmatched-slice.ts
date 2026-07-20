"use client"

import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { SettlementMatch, AuditEntry } from "@/types"
import { demoUnmatchedSettlements, demoNeedsReview, demoAuditTrail } from "@/lib/utils/demo-data"

interface UnmatchedState {
  unmatched: SettlementMatch[]
  needsReview: SettlementMatch[]
  selectedSettlement: SettlementMatch | null
  auditTrail: AuditEntry[]
  isLoading: boolean
}

const initialState: UnmatchedState = {
  unmatched: demoUnmatchedSettlements,
  needsReview: demoNeedsReview,
  selectedSettlement: null,
  auditTrail: demoAuditTrail,
  isLoading: false,
}

const unmatchedSlice = createSlice({
  name: "unmatched",
  initialState,
  reducers: {
    setUnmatched: (state, action: PayloadAction<SettlementMatch[]>) => {
      state.unmatched = action.payload
    },
    setNeedsReview: (state, action: PayloadAction<SettlementMatch[]>) => {
      state.needsReview = action.payload
    },
    setSelectedSettlement: (state, action: PayloadAction<SettlementMatch | null>) => {
      state.selectedSettlement = action.payload
    },
    approveMatch: (state, action: PayloadAction<string>) => {
      const match = state.needsReview.find((m) => m.id === action.payload)
      if (match) {
        match.status = "matched"
        state.needsReview = state.needsReview.filter((m) => m.id !== action.payload)
      }
    },
    rejectMatch: (state, action: PayloadAction<string>) => {
      const match = state.needsReview.find((m) => m.id === action.payload)
      if (match) {
        match.status = "unmatched"
        state.needsReview = state.needsReview.filter((m) => m.id !== action.payload)
        state.unmatched.push(match)
      }
    },
    setAuditTrail: (state, action: PayloadAction<AuditEntry[]>) => {
      state.auditTrail = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    resetUnmatched: (state) => {
      state.unmatched = demoUnmatchedSettlements
      state.needsReview = demoNeedsReview
      state.selectedSettlement = null
      state.auditTrail = demoAuditTrail
    },
  },
})

export const {
  setUnmatched,
  setNeedsReview,
  setSelectedSettlement,
  approveMatch,
  rejectMatch,
  setAuditTrail,
  setLoading,
  resetUnmatched,
} = unmatchedSlice.actions
export default unmatchedSlice.reducer
