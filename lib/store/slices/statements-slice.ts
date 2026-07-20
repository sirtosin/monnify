"use client"

import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { BankStatement } from "@/types"
import { demoStatements } from "@/lib/utils/demo-data"

interface StatementsState {
  statements: BankStatement[]
  selectedStatement: BankStatement | null
  isUploading: boolean
  uploadProgress: number
  uploadSteps: Array<{
    id: string
    label: string
    description: string
    status: "pending" | "active" | "completed"
  }>
  isLoading: boolean
}

const initialState: StatementsState = {
  statements: demoStatements,
  selectedStatement: null,
  isUploading: false,
  uploadProgress: 0,
  uploadSteps: [],
  isLoading: false,
}

const statementsSlice = createSlice({
  name: "statements",
  initialState,
  reducers: {
    setStatements: (state, action: PayloadAction<BankStatement[]>) => {
      state.statements = action.payload
    },
    addStatement: (state, action: PayloadAction<BankStatement>) => {
      state.statements.unshift(action.payload)
    },
    setSelectedStatement: (state, action: PayloadAction<BankStatement | null>) => {
      state.selectedStatement = action.payload
    },
    setUploading: (state, action: PayloadAction<boolean>) => {
      state.isUploading = action.payload
      if (!action.payload) {
        state.uploadProgress = 0
        state.uploadSteps = []
      }
    },
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload
    },
    setUploadSteps: (
      state,
      action: PayloadAction<
        Array<{ id: string; label: string; description: string; status: "pending" | "active" | "completed" }>
      >
    ) => {
      state.uploadSteps = action.payload
    },
    updateUploadStep: (
      state,
      action: PayloadAction<{ id: string; status: "pending" | "active" | "completed" }>
    ) => {
      const step = state.uploadSteps.find((s) => s.id === action.payload.id)
      if (step) {
        step.status = action.payload.status
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    resetStatements: (state) => {
      state.statements = demoStatements
      state.selectedStatement = null
      state.isUploading = false
      state.uploadProgress = 0
      state.uploadSteps = []
    },
  },
})

export const {
  setStatements,
  addStatement,
  setSelectedStatement,
  setUploading,
  setUploadProgress,
  setUploadSteps,
  updateUploadStep,
  setLoading,
  resetStatements,
} = statementsSlice.actions
export default statementsSlice.reducer
