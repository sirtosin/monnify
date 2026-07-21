"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Radio,
  FileSpreadsheet,
  BookOpen,
  AlertTriangle,
  Search,
  Settings,
  ChevronLeft,
  ChevronRight,
  Waves,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toggleSidebar } from "@/lib/store/slices/ui-slice";
import type { RootState } from "@/lib/store";
import { useEffect } from "react";
import { useAuth } from "@/lib/hooks/use-auth";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Radio,
  FileSpreadsheet,
  BookOpen,
  AlertTriangle,
  Search,
  Settings,
  ArrowLeftRight,
};

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
    icon: "ArrowLeftRight",
    themeLabel: "transactions",
  },
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

export function Sidebar() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const route = useRouter();
  const { sidebarOpen } = useSelector((state: RootState) => state.ui);
  useEffect(() => {
    !user?.email && route.push("/login");
  }, [user?.email]);
  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarOpen ? 260 : 72 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r bg-card/95 backdrop-blur-xl hidden lg:flex flex-col",
        sidebarOpen ? "w-[260px]" : "w-[72px]",
      )}
    >
      <div className="flex h-16 items-center px-4 border-b">
        <Link href="/" className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Waves className="h-5 w-5" />
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col"
              >
                <span className="text-lg font-bold leading-tight">Echo</span>
                <span className="text-[10px] text-muted-foreground leading-tight">
                  Reconciliation Engine
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Tooltip key={item.href} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 shrink-0",
                      isActive && "text-primary",
                    )}
                  />
                  <AnimatePresence>
                    {sidebarOpen && (
                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col overflow-hidden"
                      >
                        <span className="whitespace-nowrap">{item.label}</span>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                          {item.themeLabel}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {isActive && sidebarOpen && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute left-0 h-8 w-1 rounded-r-full bg-primary"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              </TooltipTrigger>
              {!sidebarOpen && (
                <TooltipContent side="right" className="flex flex-col">
                  <span className="font-medium">{item.label}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {item.themeLabel}
                  </span>
                </TooltipContent>
              )}
            </Tooltip>
          );
        })}
      </nav>

      <div className="border-t p-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => dispatch(toggleSidebar())}
          className="w-full"
        >
          {sidebarOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>
    </motion.aside>
  );
}
