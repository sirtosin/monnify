"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AnimatePresence } from "framer-motion"
import { ConnectDialog } from "@/components/soundboard/connect-dialog"
import { ConnectionCard } from "@/components/soundboard/connection-card"
import { EmptyState } from "@/components/shared/empty-state"
import { useToast } from "@/lib/hooks/use-toast"
import {
  useGetConnectionsQuery,
  useConnectProcessorMutation,
  useToggleConnectionMutation,
  useDisconnectProcessorMutation,
} from "@/lib/store/api/echo-api"
import {
  setConnections,
  addConnection,
  updateConnection,
  removeConnection,
} from "@/lib/store/slices/soundboard-slice"
import type { RootState } from "@/lib/store"
import type { PayfacConnection } from "@/types"

export default function SoundboardPage() {
  const dispatch = useDispatch()
  const { connections: localConnections } = useSelector(
    (state: RootState) => state.soundboard
  )
  const { success, error } = useToast()

  // RTK Query hooks
  const { data: apiConnections, isLoading } = useGetConnectionsQuery()
  const [connectProcessor] = useConnectProcessorMutation()
  const [toggleConnection] = useToggleConnectionMutation()
  const [disconnectProcessor] = useDisconnectProcessorMutation()

  // Sync API data to Redux store
  useEffect(() => {
    if (apiConnections?.data) {
      dispatch(setConnections(apiConnections.data))
    }
  }, [apiConnections, dispatch])

  // Use local store data (which may include demo data if API fails)
  const connections = apiConnections?.data || localConnections

  const handleConnect = async (data: any) => {
    try {
      const result = await connectProcessor(data).unwrap()
      if (result.data) {
        dispatch(addConnection(result.data))
        success("Connection created", "Your payment processor is being connected.")
      }
    } catch (err: any) {
      // Fallback: create demo connection
   
    }
  }

  const handleToggle = async (id: string) => {
    try {
      const result = await toggleConnection(id).unwrap()
      if (result.data) {
        dispatch(updateConnection(result.data))
        success(result.data.is_active ? "Connection activated" : "Connection deactivated")
      }
    } catch (err) {
      // Fallback
      const conn = connections.find((c) => c.id === id)
      if (conn) {
        dispatch(updateConnection({ ...conn, is_active: !conn.is_active }))
        success(conn.is_active ? "Connection deactivated" : "Connection activated")
      }
    }
  }

  const handleDisconnect = async (id: string) => {
    try {
      await disconnectProcessor(id).unwrap()
      dispatch(removeConnection(id))
      success("Connection removed")
    } catch (err) {
      dispatch(removeConnection(id))
      success("Connection removed (demo mode)")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Payment Gateways
          </h2>
          <p className="text-muted-foreground">
            Manage your payment processor connections
          </p>
        </div>
        <ConnectDialog onConnect={handleConnect} />
      </div>

      {connections.length === 0 ? (
        <EmptyState
          title="No connections yet"
          description="Connect your Monnify, Paystack, or Flutterwave account to start receiving transaction signals."
          actionLabel="Connect Processor"
          actionHref="#"
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {connections.map((connection) => (
              <ConnectionCard
                key={connection.id}
                connection={connection}
                onToggle={handleToggle}
                onDisconnect={handleDisconnect}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
