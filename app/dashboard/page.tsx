"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Wallet,
  Loader2,
  XCircleIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  useGetDashboardMetricsQuery,
  useGetConnectionsQuery,
  useGetLedgerEntriesQuery,
  useRunReconciliationMutation,
} from "@/lib/store/api/echo-api";
import { setMetrics } from "@/lib/store/slices/dashboard-slice";
import {
  formatCurrency,
  formatRelativeTime,
  getStatusColor,
} from "@/lib/utils/formatters";
import type { RootState } from "@/lib/store";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { data: metricsData, isLoading: metricsLoading } =
    useGetDashboardMetricsQuery();
  const { data: connectionsData } = useGetConnectionsQuery();
  const { data: unmatchedEntries } = useGetLedgerEntriesQuery({
    reconciled: false,
  });
  const [runReconciliation] = useRunReconciliationMutation();

  useEffect(() => {
    runReconciliation();
    if (metricsData?.data) {
      dispatch(setMetrics(metricsData.data));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metricsData, dispatch]);

  const metrics = metricsData?.data;
  const connections = connectionsData?.data || [];
  const exceptions = unmatchedEntries?.data || [];

  if (metricsLoading && !metrics) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!metrics) return null;

  // ---- Executive Summary (per echo.txt §1), mapped to real API fields ----
  const summaryCards = [
    {
      title: "Cleared Volume",
      subtitle: "Confirmed in bank",
      value: formatCurrency(metrics.cleared_echo_cash),
      icon: CheckCircle2,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "Escrow / In Transit",
      subtitle: "Awaiting settlement confirmation",
      value: formatCurrency(metrics.escrow_resonance),
      icon: Wallet,
      color: "text-sky-600",
      bgColor: "bg-sky-500/10",
    },
    {
      title: "Unreconciled Entries",
      subtitle: "Bank credits with no match yet",
      value: metrics.counts.unreconciled_entries,
      icon: HelpCircle,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      title: "Unmatched Variance",
      subtitle: `${metrics.distorted_signals.count} affected settlement(s)`,
      value: formatCurrency(Math.abs(metrics.distorted_signals.total_variance)),
      icon: AlertTriangle,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
  ];
console.log('metrics', metrics)
  // ---- Settlement funnel (per echo.txt §3), mapped to real counts ----
  const settlementCards = [
    {
      title: "Settlements Settled",
      value: metrics.counts.settlements_settled,
      icon: CheckCircle2,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "Settlements Pending",
      value: metrics.counts.settlements_pending,
      icon: HelpCircle,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      title: "Settlements Mismatched",
      value: metrics.counts.settlements_mismatch,
      icon: XCircleIcon,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your reconciliation signals.
        </p>
      </div>

      {/* Executive Summary */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div key={index} variants={item}>
              <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {card.title}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground/70">
                      {card.subtitle}
                    </p>
                  </div>
                  <div className={`rounded-lg p-2 ${card.bgColor}`}>
                    <Icon className={`h-4 w-4 ${card.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Settlement funnel */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Settlements</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {settlementCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </CardTitle>
                  <div className={`rounded-lg p-2 ${card.bgColor}`}>
                    <Icon className={`h-4 w-4 ${card.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Connection Health */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Connection Health
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Live payment gateway status
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {connections.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No processors connected yet.
              </p>
            )}
            {connections.map((conn:any) => (
              <div key={conn.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      conn.is_active
                        ? "bg-emerald-500 animate-pulse"
                        : "bg-muted-foreground"
                    }`}
                  />
                  <div>
                    <p className="text-sm font-medium">{conn.payfac_source}</p>
                    <p className="text-xs text-muted-foreground">
                      {conn.environment}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={getStatusColor(
                    conn.is_active ? "connected" : "disconnected",
                  )}
                >
                  {conn.is_active ? "active" : "inactive"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Needs Review — closest real proxy for echo.txt's exceptions table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Needs Review</CardTitle>
            <p className="text-xs text-muted-foreground">
              Bank credits without a matching settlement
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {exceptions.length === 0 && (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Nothing to review right now.
              </p>
            )}
            {exceptions.slice(0, 6).map((entry:any) => (
              <div
                key={entry.id}
                className="flex items-center justify-between border-b pb-2 last:border-0"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate max-w-[220px]">
                    {entry.narration}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {entry.bank_name} · {formatRelativeTime(entry.created_at)}
                  </p>
                </div>
                <div className="text-sm font-medium shrink-0">
                  {formatCurrency(Number(entry.amount))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
