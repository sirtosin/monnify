"use client"

import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { DashboardMetrics, DashboardMetrics2 } from "@/types"
import { demoMetrics } from "@/lib/utils/demo-data"

interface DashboardState {
  metrics: DashboardMetrics | null
  isLoading: boolean
  lastUpdated: string | null
}

const initialState: DashboardState = {
  metrics: null,
  isLoading: false,
  lastUpdated: new Date().toISOString(),
}

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setMetrics: (state, action: PayloadAction<DashboardMetrics>) => {
      state.metrics = action.payload
      state.lastUpdated = new Date().toISOString()
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    resetDashboard: (state) => {
      state.metrics = null
      state.lastUpdated = new Date().toISOString()
    },
  },
})

export const { setMetrics, setLoading, resetDashboard } = dashboardSlice.actions
export default dashboardSlice.reducer
