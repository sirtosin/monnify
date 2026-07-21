"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Radio,
  FileSpreadsheet,
  BookOpen,
  AlertTriangle,
  Search,
  Settings,
  Waves,
} from "lucide-react"
import { cn } from "@/lib/utils/cn"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Radio,
  FileSpreadsheet,
  BookOpen,
  AlertTriangle,
  Search,
  Settings,
}

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard",
    themeLabel: "Echo Console",
  },
  {
    label: "Payment Gateways",
    href: "/dashboard/soundboard",
    icon: "Radio",
    themeLabel: "Payment Connections",
  },
  {
    label: "Statements",
    href: "/dashboard/statements",
    icon: "FileSpreadsheet",
    themeLabel: "Bank Statements",
  },
  {
    label: "Ledger",
    href: "/dashboard/ledger",
    icon: "BookOpen",
    themeLabel: "Bank Ledger",
  },
  {
    label: "Transactions",
    href: "/dashboard/transactions",
    icon: "AlertTriangle",
    themeLabel: "transactions",
  },
  // {
  //   label: "Distortions",
  //   href: "/dashboard/unmatched",
  //   icon: "AlertTriangle",
  //   themeLabel: "Unmatched Settlements",
  // },
  // {
  //   label: "Insights",
  //   href: "/dashboard/insights",
  //   icon: "Search",
  //   themeLabel: "Insight Bar",
  // },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: "Settings",
    themeLabel: "Configuration",
  },
];

export function MobileNav() {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-3 border-b px-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Waves className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold leading-tight">Echo</span>
          <span className="text-[10px] text-muted-foreground">Reconciliation Engine</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon]
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary")} />
              <div className="flex flex-col">
                <span>{item.label}</span>
                <span className="text-[10px] text-muted-foreground">{item.themeLabel}</span>
              </div>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
