"use client"

import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { InsightQuery } from "@/types"

interface InsightsState {
  queries: InsightQuery[]
  currentQuery: string
  isLoading: boolean
  suggestions: string[]
}

const initialState: InsightsState = {
  queries: [],
  currentQuery: "",
  isLoading: false,
  suggestions: [
    "Show unmatched settlements from this week",
    "What caused the highest settlement variance?",
    "Show failed bank transfers from yesterday",
    "How much was processed through cards this month?",
    "Which settlements still need review?",
  ],
}

const insightsSlice = createSlice({
  name: "insights",
  initialState,
  reducers: {
    setQueries: (state, action: PayloadAction<InsightQuery[]>) => {
      state.queries = action.payload
    },
    addQuery: (state, action: PayloadAction<InsightQuery>) => {
      state.queries.unshift(action.payload)
    },
    setCurrentQuery: (state, action: PayloadAction<string>) => {
      state.currentQuery = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    resetInsights: (state) => {
      state.queries = []
      state.currentQuery = ""
      state.isLoading = false
    },
  },
})

export const { setQueries, addQuery, setCurrentQuery, setLoading, resetInsights } = insightsSlice.actions
export default insightsSlice.reducer
