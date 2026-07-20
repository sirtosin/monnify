"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PAYFAC_SOURCES } from "@/lib/utils/constants"

interface ConnectDialogProps {
  onConnect: (data: {
    payfac_source: string
    environment: string
    api_key: string
    secret_key: string
    contract_code?: string
  }) => void
}

export function ConnectDialog({ onConnect }: ConnectDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    payfac_source: "MONNIFY",
    environment: "SANDBOX",
    api_key: "",
    secret_key: "",
    contract_code: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onConnect(formData)
    setOpen(false)
    setFormData({
      payfac_source: "MONNIFY",
      environment: "SANDBOX",
      api_key: "",
      secret_key: "",
      contract_code: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Connect Processor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Connect Payment Processor</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Processor</Label>
            <Select
              value={formData.payfac_source}
              onValueChange={(v) =>
                setFormData({ ...formData, payfac_source: v })
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
                setFormData({ ...formData, environment: v })
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

          <Button type="submit" className="w-full">
            Connect
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
