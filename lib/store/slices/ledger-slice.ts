"use client"

import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { LedgerEntry } from "@/types"
import { demoLedgerEntries } from "@/lib/utils/demo-data"

interface LedgerState {
  entries: LedgerEntry[]
  filters: {
    reconciled?: boolean
    bankName?: string
    startDate?: string
    endDate?: string
  }
  isLoading: boolean
}

const initialState: LedgerState = {
  entries: demoLedgerEntries,
  filters: {},
  isLoading: false,
}

const ledgerSlice = createSlice({
  name: "ledger",
  initialState,
  reducers: {
    setEntries: (state, action: PayloadAction<LedgerEntry[]>) => {
      state.entries = action.payload
    },
    setFilters: (state, action: PayloadAction<LedgerState["filters"]>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = {}
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    resetLedger: (state) => {
      state.entries = demoLedgerEntries
      state.filters = {}
    },
  },
})

export const { setEntries, setFilters, clearFilters, setLoading, resetLedger } = ledgerSlice.actions
export default ledgerSlice.reducer
