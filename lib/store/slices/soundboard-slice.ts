"use client"

import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { PayfacConnection } from "@/types"
import { demoConnections } from "@/lib/utils/demo-data"

interface SoundboardState {
  connections: PayfacConnection[]
  selectedConnection: PayfacConnection | null
  isLoading: boolean
}

const initialState: SoundboardState = {
  connections: demoConnections,
  selectedConnection: null,
  isLoading: false,
}

const soundboardSlice = createSlice({
  name: "soundboard",
  initialState,
  reducers: {
    setConnections: (state, action: PayloadAction<PayfacConnection[]>) => {
      state.connections = action.payload
    },
    addConnection: (state, action: PayloadAction<PayfacConnection>) => {
      state.connections.push(action.payload)
    },
    updateConnection: (state, action: PayloadAction<PayfacConnection>) => {
      const index = state.connections.findIndex((c) => c.id === action.payload.id)
      if (index !== -1) {
        state.connections[index] = action.payload
      }
    },
    removeConnection: (state, action: PayloadAction<string>) => {
      state.connections = state.connections.filter((c) => c.id !== action.payload)
    },
    setSelectedConnection: (state, action: PayloadAction<PayfacConnection | null>) => {
      state.selectedConnection = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    resetSoundboard: (state) => {
      state.connections = demoConnections
      state.selectedConnection = null
    },
  },
})

export const {
  setConnections,
  addConnection,
  updateConnection,
  removeConnection,
  setSelectedConnection,
  setLoading,
  resetSoundboard,
} = soundboardSlice.actions
export default soundboardSlice.reducer
