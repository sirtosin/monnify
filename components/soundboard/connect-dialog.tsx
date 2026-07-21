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

type FormErrors = Partial<Record<keyof ConnectProcessorRequest, string>>;

const MIN_KEY_LENGTH = 6;
const MIN_PULL_INTERVAL = 5;
const MAX_PULL_INTERVAL = 1440; // 24 hours

function validate(formData: ConnectProcessorRequest): FormErrors {
  const errors: FormErrors = {};

  if (!formData.api_key.trim()) {
    errors.api_key = "API key is required.";
  } else if (formData.api_key.trim().length < MIN_KEY_LENGTH) {
    errors.api_key = `API key must be at least ${MIN_KEY_LENGTH} characters.`;
  }

  if (!formData.secret_key.trim()) {
    errors.secret_key = "Secret key is required.";
  } else if (formData.secret_key.trim().length < MIN_KEY_LENGTH) {
    errors.secret_key = `Secret key must be at least ${MIN_KEY_LENGTH} characters.`;
  }

  if (formData.payfac_source === "MONNIFY" && !formData.contract_code?.trim()) {
    errors.contract_code = "Contract code is required for Monnify.";
  }

  if (formData.ingest_mode === "API_PULL") {
    const interval = formData.pull_interval_minutes;
    if (interval === null || interval === undefined || Number.isNaN(interval)) {
      errors.pull_interval_minutes = "Pull interval is required for API Pull mode.";
    } else if (!Number.isInteger(interval)) {
      errors.pull_interval_minutes = "Pull interval must be a whole number.";
    } else if (interval < MIN_PULL_INTERVAL || interval > MAX_PULL_INTERVAL) {
      errors.pull_interval_minutes = `Enter a value between ${MIN_PULL_INTERVAL} and ${MAX_PULL_INTERVAL} minutes.`;
    }
  }

  return errors;
}

export function ConnectDialog({ onConnect }: ConnectDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] =
    useState<ConnectProcessorRequest>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});

  const updateField = <K extends keyof ConnectProcessorRequest>(
    key: K,
    value: ConnectProcessorRequest[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    // Clear that field's error as soon as the user edits it
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onConnect(formData);
    setOpen(false);
    setFormData(initialFormState);
    setErrors({});
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      // Reset validation state when the dialog is dismissed without submitting
      setFormData(initialFormState);
      setErrors({});
    }
  };

  const isApiPull = formData.ingest_mode === "API_PULL";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="space-y-2">
            <Label>Gateway</Label>
            <Select
              value={formData.payfac_source}
              onValueChange={(v) =>
                updateField(
                  "payfac_source",
                  v as ConnectProcessorRequest["payfac_source"]
                )
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
                updateField(
                  "environment",
                  v as ConnectProcessorRequest["environment"]
                )
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
              onChange={(e) => updateField("api_key", e.target.value)}
              placeholder="MK_TEST_XXXX"
              aria-invalid={!!errors.api_key}
              className={errors.api_key ? "border-destructive" : ""}
            />
            {errors.api_key && (
              <p className="text-xs text-destructive">{errors.api_key}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Secret Key</Label>
            <Input
              type="password"
              value={formData.secret_key}
              onChange={(e) => updateField("secret_key", e.target.value)}
              placeholder="SK_TEST_XXXX"
              aria-invalid={!!errors.secret_key}
              className={errors.secret_key ? "border-destructive" : ""}
            />
            {errors.secret_key && (
              <p className="text-xs text-destructive">{errors.secret_key}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Contract Code (Monnify)</Label>
            <Input
              value={formData.contract_code}
              onChange={(e) => updateField("contract_code", e.target.value)}
              placeholder="100200300"
              aria-invalid={!!errors.contract_code}
              className={errors.contract_code ? "border-destructive" : ""}
            />
            {errors.contract_code && (
              <p className="text-xs text-destructive">{errors.contract_code}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Ingest Mode</Label>
            <Select
              value={formData.ingest_mode}
              onValueChange={(v) =>
                updateField("ingest_mode", v as ConnectProcessorRequest["ingest_mode"])
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
                min={MIN_PULL_INTERVAL}
                max={MAX_PULL_INTERVAL}
                value={formData.pull_interval_minutes ?? ""}
                onChange={(e) =>
                  updateField(
                    "pull_interval_minutes",
                    e.target.value ? Number(e.target.value) : null
                  )
                }
                placeholder="30"
                aria-invalid={!!errors.pull_interval_minutes}
                className={errors.pull_interval_minutes ? "border-destructive" : ""}
              />
              {errors.pull_interval_minutes && (
                <p className="text-xs text-destructive">
                  {errors.pull_interval_minutes}
                </p>
              )}
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