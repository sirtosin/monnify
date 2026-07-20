"use client";

import { useSelector } from "react-redux";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils/cn";
import type { RootState } from "@/lib/store";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarOpen } = useSelector((state: RootState) => state.ui);

  return (
    <TooltipProvider delayDuration={0}>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <div
          className={cn(
            "transition-all duration-300",
            sidebarOpen ? "lg:ml-[260px]" : "lg:ml-[72px]",
          )}
        >
          <Header />
          <main className="p-4 lg:p-6">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
