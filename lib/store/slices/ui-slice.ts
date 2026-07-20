"use client"

import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface UIState {
  sidebarOpen: boolean
  theme: "light" | "dark" | "system"
  demoMode: boolean
  toasts: Array<{
    id: string
    type: "success" | "error" | "warning" | "info"
    title: string
    message: string
  }>
}

const initialState: UIState = {
  sidebarOpen: true,
  theme: "light",
  demoMode: true,
  toasts: [],
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },
    setTheme: (state, action: PayloadAction<"light" | "dark" | "system">) => {
      state.theme = action.payload
    },
    setDemoMode: (state, action: PayloadAction<boolean>) => {
      state.demoMode = action.payload
    },
    addToast: (
      state,
      action: PayloadAction<{
        id: string
        type: "success" | "error" | "warning" | "info"
        title: string
        message: string
      }>
    ) => {
      state.toasts.push(action.payload)
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload)
    },
    resetUI: (state) => {
      state.sidebarOpen = true
      state.toasts = []
    },
  },
})

export const {
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  setDemoMode,
  addToast,
  removeToast,
  resetUI,
} = uiSlice.actions
export default uiSlice.reducer
