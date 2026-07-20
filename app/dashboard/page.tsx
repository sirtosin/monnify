"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Wallet,
  TrendingUp,
  Activity,
  Loader2,
  XCircleIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import {
  useGetDashboardMetricsQuery,
  useGetConnectionsQuery,
  useRunReconciliationMutation,
} from "@/lib/store/api/echo-api";
import { setMetrics } from "@/lib/store/slices/dashboard-slice";
import {
  formatCurrency,
  formatPercentage,
  formatRelativeTime,
  getStatusColor,
} from "@/lib/utils/formatters";
import type { RootState } from "@/lib/store";

const COLORS = {
  matched: "#10b981",
  unmatched: "#ef4444",
  review: "#f59e0b",
};

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
  const [runReconciliation] = useRunReconciliationMutation();
  const { metrics: localMetrics } = useSelector(
    (state: RootState) => state.dashboard,
  );
  const runRecon = async () => {
    const resp = await runReconciliation();
    console.log("resp", resp);
  };
  console.log("metricsData", metricsData);
  // Sync RTK Query data to Redux store for components that read from store
  useEffect(() => {
    runRecon();
    if (metricsData?.data) {
      dispatch(setMetrics(metricsData.data));
    }
  }, [metricsData, dispatch]);

  const metrics = metricsData?.data;
  const connections = connectionsData?.data || [];

  if (metricsLoading && !metrics) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!metrics) return null;

  const cards = [
    {
      title: "Reconciled Volume",
      subtitle: "Echo Volume",
      value: formatCurrency(metrics.escrow_resonance || 0),
      icon: CheckCircle2,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      // trend: `+${formatPercentage(metrics.settlement_success_rate)}`,
    },
    {
      title: "Unmatched",
      subtitle: "Distorted Signals",
      value: metrics.counts.unreconciled_entries || 0,
      icon: AlertTriangle,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      // trend: `${metrics.recent_matches?.filter((m) => m.status === "unmatched").length || 0} settlements`,
    },
    {
      title: "Needs Review",
      subtitle: "Pending Verification",
      value: metrics.counts.settlements_pending?.toString(),
      icon: HelpCircle,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      trend: "Requires attention",
    },
    // {
    //   title: "Settled",
    //   subtitle: "All Good",
    //   value: metrics.counts.settlements_settled?.toString(),
    //   icon: CheckCircle2,
    //   color: "text-emerald-500",
    //   bgColor: "bg-emerald-500/10",
    //   trend: "",
    // },
    {
      title: "Mismatched",
      subtitle: "Check transactions",
      value: metrics.counts.settlements_mismatch?.toString(),
      icon: XCircleIcon,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      trend: "Requires attention",
    },
    {
      title: "Uncleared Amount",
      subtitle: "Outstanding Balance",
      value: metrics.counts.unreconciled_entries || 0,
      icon: Wallet,
      color: "text-sky-600",
      bgColor: "bg-sky-500/10",
      trend: "Awaiting settlement",
    },
  ];

  const chartData = [
    {
      name: "Matched",
      value: metrics.counts.settlements_settled,
      color: COLORS.matched,
    },
    {
      name: "Unmatched",
      value: metrics.counts.settlements_mismatch,
      color: COLORS.unmatched,
    },
    {
      name: "Needs Review",
      value: metrics.counts.settlements_pending * 10000,
      color: COLORS.review,
    },
  ];

  const total =
    metrics.counts.unreconciled_entries + metrics.counts.settlements_mismatch;
  const reconciledPercent =
    total > 0 ? (metrics.counts.settlements_settled / total) * 100 : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your reconciliation signals.
        </p>
      </div>

      {/* Metrics Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {cards.map((card, index) => {
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
                  <p className="text-xs text-muted-foreground mt-1">
                    {card.trend}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Chart */}
        {/* <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Settlement Distribution
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Signal → Resonance → Echo
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `₦${value.toLocaleString()}`}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid hsl(var(--border))",
                      background: "hsl(var(--card))",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card> */}

        {/* Connection Health */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Connection Health
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Live payment processor status
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {connections.map((conn) => (
              <div key={conn.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        conn.status === "connected"
                          ? "bg-emerald-500 animate-pulse"
                          : conn.status === "connecting"
                            ? "bg-amber-500 animate-pulse"
                            : conn.status === "disconnected"
                              ? "bg-muted-foreground"
                              : "bg-red-500 animate-pulse"
                      }`}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{conn.payfac_source}</p>
                    <p className="text-xs text-muted-foreground">
                      {conn.environment}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={getStatusColor(conn.status)}
                >
                  {conn.status}
                </Badge>
              </div>
            ))}

            {/* <div className="pt-4 border-t">
              <div className="flex justify-between text-sm mb-2">
                <span>Settlement Success Rate</span>
                <span className="font-medium">
                  {formatPercentage(metrics.settlement_success_rate)}
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-1000"
                  style={{ width: `${reconciledPercent}%` }}
                />
              </div>
            </div> */}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
          <p className="text-xs text-muted-foreground">
            Latest settlement signals
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[280px]">
            {metrics.recent_matches?.length ? (
              metrics.recent_matches.map((match, index) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate max-w-[200px]">
                        {match.payment_reference}
                      </span>
                      <Badge
                        variant="outline"
                        className={getStatusColor(match.status)}
                      >
                        {match.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {match.transaction_reference}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {formatCurrency(match.expected_amount)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatRelativeTime(match.created_at)}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No recent reconciliation activity
              </p>
            )}
          </ScrollArea>
        </CardContent>
      </Card> */}
    </div>
  );
}
