"use client"

import { useSelector, useDispatch } from "react-redux"
import { usePathname } from "next/navigation"
import { Menu, Bell, Sun, Moon, RotateCcw } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { setSidebarOpen, setDemoMode } from "@/lib/store/slices/ui-slice"
import { useAuth } from "@/lib/hooks/use-auth"
import { useToast } from "@/lib/hooks/use-toast"
import { resetDashboard } from "@/lib/store/slices/dashboard-slice"
import { resetSoundboard } from "@/lib/store/slices/soundboard-slice"
import { resetStatements } from "@/lib/store/slices/statements-slice"
import { resetLedger } from "@/lib/store/slices/ledger-slice"
import { resetUnmatched } from "@/lib/store/slices/unmatched-slice"
import { resetInsights } from "@/lib/store/slices/insights-slice"
import type { RootState } from "@/lib/store"
import { MobileNav } from "./mobile-nav"

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/dashboard/": { title: "Dashboard", subtitle: "Dashboard Overview" },
  "/dashboard/soundboard": {
    title: "Payment Gateways",
    subtitle: "Payment Connections",
  },
  "/dashboard/statements": {
    title: "Statements",
    subtitle: "Bank Statement Upload",
  },
  "/dashboard/ledger": { title: "Ledger", subtitle: "Bank Ledger Entries" },
  "/dashboard/transactions": {
    title: "Transactions",
    subtitle: "transactions",
  },
  "/dashboard/insights": {
    title: "Insights",
    subtitle: "Natural Language Query",
  },
  "/dashboard/settings": { title: "Settings", subtitle: "Configuration" },
};

export function Header() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { user } = useAuth()
  const { success } = useToast()
  const dispatch = useDispatch()
  const pageInfo = pageTitles[pathname] || { title: "Echo", subtitle: "" }


  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[260px] p-0">
          <MobileNav />
        </SheetContent>
      </Sheet>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">{pageInfo.title}</h1>
          <span className="hidden text-sm text-muted-foreground sm:inline">— {pageInfo.subtitle}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
     
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>

        <div className="flex items-center gap-2 pl-2 border-l">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
              {user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:flex flex-col">
            <span className="text-sm font-medium leading-none">{user?.name || "User"}</span>
            <span className="text-xs text-muted-foreground">{user?.merchant?.name || "Merchant"}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
