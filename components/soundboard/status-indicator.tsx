"use client"

interface StatusIndicatorProps {
  status: "connected" | "connecting" | "disconnected" | "error"
  showLabel?: boolean
}

export function StatusIndicator({ status, showLabel = true }: StatusIndicatorProps) {
  const config = {
    connected: {
      color: "bg-emerald-500",
      animation: "animate-pulse",
      label: "Connected",
      description: "Receiving webhooks",
    },
    connecting: {
      color: "bg-amber-500",
      animation: "animate-pulse",
      label: "Connecting",
      description: "Establishing connection",
    },
    disconnected: {
      color: "bg-muted-foreground",
      animation: "",
      label: "Disconnected",
      description: "Not receiving data",
    },
    error: {
      color: "bg-red-500",
      animation: "animate-pulse",
      label: "Error",
      description: "Connection failed",
    },
  }

  const cfg = config[status]

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className={`h-2.5 w-2.5 rounded-full ${cfg?.color} ${cfg?.animation}`} />
        {status === "connected" && (
          <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-20" />
        )}
      </div>
      {showLabel && (
        <div className="flex flex-col">
          <span className="text-xs font-medium">{cfg?.label}</span>
          <span className="text-[10px] text-muted-foreground">{cfg?.description}</span>
        </div>
      )}
    </div>
  )
}
