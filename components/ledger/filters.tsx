"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

interface LedgerFiltersProps {
  onSearch: (term: string) => void
  onClear: () => void
}

export function LedgerFilters({ onSearch, onClear }: LedgerFiltersProps) {
  const [term, setTerm] = useState("")

  const handleSearch = () => {
    onSearch(term)
  }

  const handleClear = () => {
    setTerm("")
    onClear()
  }

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search ledger entries..."
          className="pl-10"
        />
      </div>
      <Button onClick={handleSearch} size="sm">Search</Button>
      {term && (
        <Button variant="ghost" size="sm" onClick={handleClear}>
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
