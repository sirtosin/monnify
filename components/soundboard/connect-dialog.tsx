"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PAYFAC_SOURCES } from "@/lib/utils/constants";
import type { ConnectProcessorRequest } from "@/types/api";

interface ConnectDialogProps {
  onConnect: (data: ConnectProcessorRequest) => void;
}

const initialFormState: ConnectProcessorRequest = {
  payfac_source: "MONNIFY",
  environment: "SANDBOX",
  api_key: "",
  secret_key: "",
  contract_code: "",
  ingest_mode: "WEBHOOK",
  pull_interval_minutes: 30,
};

export function ConnectDialog({ onConnect }: ConnectDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] =
    useState<ConnectProcessorRequest>(initialFormState);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConnect(formData);
    setOpen(false);
    setFormData(initialFormState);
  };

  const isApiPull = formData.ingest_mode === "API_PULL";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Connect Gateway
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Connect Payment Gateway</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Gateway</Label>
            <Select
              value={formData.payfac_source}
              onValueChange={(v) =>
                setFormData({
                  ...formData,
                  payfac_source: v as ConnectProcessorRequest["payfac_source"],
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAYFAC_SOURCES.map((source) => (
                  <SelectItem key={source.value} value={source.value}>
                    {source.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Environment</Label>
            <Select
              value={formData.environment}
              onValueChange={(v) =>
                setFormData({
                  ...formData,
                  environment: v as ConnectProcessorRequest["environment"],
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SANDBOX">Sandbox</SelectItem>
                <SelectItem value="LIVE">Live</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>API Key</Label>
            <Input
              value={formData.api_key}
              type="password"
              onChange={(e) =>
                setFormData({ ...formData, api_key: e.target.value })
              }
              placeholder="MK_TEST_XXXX"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Secret Key</Label>
            <Input
              type="password"
              value={formData.secret_key}
              onChange={(e) =>
                setFormData({ ...formData, secret_key: e.target.value })
              }
              placeholder="SK_TEST_XXXX"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Contract Code (Monnify)</Label>
            <Input
              value={formData.contract_code}
              onChange={(e) =>
                setFormData({ ...formData, contract_code: e.target.value })
              }
              placeholder="100200300"
            />
          </div>

          <div className="space-y-2">
            <Label> Mode</Label>
            <Select
              value={formData.ingest_mode}
              onValueChange={(v) =>
                setFormData({
                  ...formData,
                  ingest_mode: v as ConnectProcessorRequest["ingest_mode"],
                  // Reset interval when switching away from API_PULL so a stale
                  // value doesn't get silently submitted alongside WEBHOOK mode
                  pull_interval_minutes:
                    v === "API_PULL"
                      ? (formData.pull_interval_minutes ?? 30)
                      : null,
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WEBHOOK">Webhook (recommended)</SelectItem>
                <SelectItem value="API_PULL">API Pull (polling)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Webhook mode receives transactions as they happen. API Pull polls
              the processor on an interval instead.
            </p>
          </div>

          {isApiPull && (
            <div className="space-y-2">
              <Label>Pull Interval (minutes)</Label>
              <Input
                type="number"
                min={1}
                value={formData.pull_interval_minutes ?? ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pull_interval_minutes: e.target.value
                      ? Number(e.target.value)
                      : null,
                  })
                }
                placeholder="30"
                required
              />
            </div>
          )}

          <Button type="submit" className="w-full">
            Connect
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
