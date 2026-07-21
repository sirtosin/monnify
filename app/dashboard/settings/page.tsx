"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { RotateCcw, Moon, Sun, Monitor, Save, LogOutIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";
import { useToast } from "@/lib/hooks/use-toast";
import { setDemoMode } from "@/lib/store/slices/ui-slice";
import { resetDashboard } from "@/lib/store/slices/dashboard-slice";
import { resetSoundboard } from "@/lib/store/slices/soundboard-slice";
import { resetStatements } from "@/lib/store/slices/statements-slice";
import { resetLedger } from "@/lib/store/slices/ledger-slice";
import { resetUnmatched } from "@/lib/store/slices/unmatched-slice";
import { resetInsights } from "@/lib/store/slices/insights-slice";
import type { RootState } from "@/lib/store";
import { useLogoutMutation } from "@/lib/store/api/echo-api";
import { useRouter } from "next/navigation";
import { ReconciliationScheduleCard } from "@/components/settings/reconciliation-schedule-card";

export default function SettingsPage() {
  const dispatch = useDispatch();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const { demoMode } = useSelector((state: RootState) => state.ui);
  const { success } = useToast();
  const [logout] = useLogoutMutation();
  const handleResetDemo = async () => {
    const resp = await logout();
    dispatch(resetDashboard());
    dispatch(resetSoundboard());
    dispatch(resetStatements());
    dispatch(resetLedger());
    dispatch(resetUnmatched());
    dispatch(resetInsights());
    success("User Logged out", "Thank you for using Echo");
    router.push("/login");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Configure your Echo experience</p>
      </div>
      <ReconciliationScheduleCard />
      <div className="grid gap-6 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how Echo looks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                    {theme === "dark" ? (
                      <Moon className="h-4 w-4" />
                    ) : (
                      <Sun className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">Theme</p>
                    <p className="text-xs text-muted-foreground">
                      Choose your preferred color scheme
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("light")}
                  >
                    <Sun className="h-4 w-4 mr-1" />
                    Light
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("dark")}
                  >
                    <Moon className="h-4 w-4 mr-1" />
                    Dark
                  </Button>
                  <Button
                    variant={theme === "system" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("system")}
                  >
                    <Monitor className="h-4 w-4 mr-1" />
                    Auto
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Logout from Echo </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                size="sm"
                className="bg-red-500"
                onClick={handleResetDemo}
                variant={"destructive"}
              >
                <LogOutIcon className="h-4  w-4 mr-1" />
                logout
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle>Demo Mode</CardTitle>
              <CardDescription>Manage demonstration data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                    <Save className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Demo Data</p>
                    <p className="text-xs text-muted-foreground">Use prepared demo dataset</p>
                  </div>
                </div>
                <Switch
                  checked={demoMode}
                  onCheckedChange={(checked) => dispatch(setDemoMode(checked))}
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                    <RotateCcw className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Reset Demo</p>
                    <p className="text-xs text-muted-foreground">Restore all data to initial state</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleResetDemo}>
                  <RotateCcw className="h-3.5 w-3.5 mr-1" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div> */}
      </div>
    </div>
  );
}
