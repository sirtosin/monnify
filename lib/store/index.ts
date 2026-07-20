"use client"

import { configureStore, combineReducers } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist"
import storage from "redux-persist/lib/storage"
import { echoApi } from "./api/echo-api"
import authReducer from "./slices/auth-slice"
import dashboardReducer from "./slices/dashboard-slice"
import soundboardReducer from "./slices/soundboard-slice"
import statementsReducer from "./slices/statements-slice"
import ledgerReducer from "./slices/ledger-slice"
import unmatchedReducer from "./slices/unmatched-slice"
import insightsReducer from "./slices/insights-slice"
import uiReducer from "./slices/ui-slice"

const persistConfig = {
  key: "echo-root",
  version: 1,
  storage,
  whitelist: ["auth", "dashboard", "soundboard", "statements", "ledger", "unmatched", "insights"],
  blacklist: ["ui"],
}

const rootReducer = combineReducers({
  [echoApi.reducerPath]: echoApi.reducer,
  auth: authReducer,
  dashboard: dashboardReducer,
  soundboard: soundboardReducer,
  statements: statementsReducer,
  ledger: ledgerReducer,
  unmatched: unmatchedReducer,
  insights: insightsReducer,
  ui: uiReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(echoApi.middleware),
})

export const persistor = persistStore(store)

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch