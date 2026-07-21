"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, X, PlayCircle, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/lib/hooks/use-toast";
import {
  useGetReconciliationScheduleQuery,
  useUpdateReconciliationScheduleMutation,
  useRunReconciliationMutation,
} from "@/lib/store/api/echo-api";

// Trim this to whatever set of timezones your merchants actually operate in
const TIMEZONES = [
  "Africa/Lagos",
  "Africa/Accra",
  "Africa/Nairobi",
  "Africa/Johannesburg",
  "UTC",
];

export function ReconciliationScheduleCard() {
  const { data, isLoading } = useGetReconciliationScheduleQuery();
  const [updateSchedule, { isLoading: isSaving }] =
    useUpdateReconciliationScheduleMutation();
  const [runReconciliation, { isLoading: isRunning }] =
    useRunReconciliationMutation();
  const { success, error } = useToast();

  const [times, setTimes] = useState<string[]>([]);
  const [timezone, setTimezone] = useState("Africa/Lagos");

  // Seed local form state once the schedule loads
  useEffect(() => {
    if (data?.data) {
      setTimes(data.data.reconciliation_times);
      setTimezone(data.data.timezone);
    }
  }, [data]);
  const handleTimeChange = (index: number, value: string) => {
    setTimes((prev) => prev.map((t, i) => (i === index ? value : t)));
  };

  const handleAddTime = () => {
    setTimes((prev) => [...prev, "18:00"]);
  };

  const handleRemoveTime = (index: number) => {
    setTimes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (times.length === 0) {
      error(
        "Add at least one time",
        "You need at least one daily reconciliation run.",
      );
      return;
    }
    try {
      await updateSchedule({ reconciliation_times: times, timezone }).unwrap();
      success(
        "Schedule updated",
        "Reconciliation will run at the times you set.",
      );
    } catch {
      error(
        "Failed to update schedule",
        "Please check the time format (HH:MM) and try again.",
      );
    }
  };

  const handleRunNow = async () => {
    try {
      const result = await runReconciliation().unwrap();
      const summary: any = result.data;
      success(
        "Reconciliation complete",
        `Processed ${summary.processed} · Settled ${summary.settled} · Mismatched ${summary.mismatched} · Unmatched ${summary.unmatched}`,
      );
    } catch {
      error(
        "Reconciliation failed",
        "Something went wrong running reconciliation. Try again.",
      );
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-10">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base">Reconciliation Schedule</CardTitle>
          <p className="text-sm text-muted-foreground">
            Choose when reconciliation runs automatically each day
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRunNow}
          disabled={isRunning}
        >
          {isRunning ? (
            <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
          ) : (
            <PlayCircle className="mr-2 h-3.5 w-3.5" />
          )}
          Run now
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Daily run times</label>
          {times.map((time, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                type="time"
                value={time}
                onChange={(e) => handleTimeChange(index, e.target.value)}
                className="w-40"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={() => handleRemoveTime(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={handleAddTime}>
            <Plus className="mr-1 h-3.5 w-3.5" />
            Add another time
          </Button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Timezone</label>
          <Select value={timezone} onValueChange={setTimezone}>
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent>
              {TIMEZONES.map((tz) => (
                <SelectItem key={tz} value={tz}>
                  {tz}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full sm:w-auto"
        >
          {isSaving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save schedule
        </Button>
      </CardContent>
    </Card>
  );
}
