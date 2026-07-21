"use client";

import { useState } from "react";
import { Receipt } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { TransactionsTable } from "@/components/transactions/transactions-table";
import { TransactionDetailModal } from "@/components/transactions/transaction-detail-modal";
import { EmptyState } from "@/components/shared/empty-state";
import { useGetTransactionsQuery } from "@/lib/store/api/echo-api";
import type { TransactionFilter } from "@/types/api";
import { Transaction } from "@/types";

const STATUS_OPTIONS = [
  "ALL",
  "SUCCESS",
  "PENDING",
  "SETTLED",
  "FAILED",
] as const;

export default function TransactionsPage() {
  const [filters, setFilters] = useState<TransactionFilter>({});
  const [reference, setReference] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, isLoading } = useGetTransactionsQuery(filters);
  const transactions:Transaction[] | any= data?.data || [];

  const handleStatusChange = (status: string) => {
    setFilters((prev) => ({
      ...prev,
      status:
        status === "ALL" ? undefined : (status as TransactionFilter["status"]),
    }));
  };

  const handleReferenceSearch = (value: string) => {
    setReference(value);
    setFilters((prev) => ({ ...prev, reference: value || undefined }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Transactions</h2>
        <p className="text-muted-foreground">
          Transactions captured from your connected processors
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Select
          value={filters.status || "ALL"}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((status) => (
              <SelectItem key={status} value={status}>
                {status === "ALL" ? "All statuses" : status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder="Search by reference..."
          value={reference}
          onChange={(e) => handleReferenceSearch(e.target.value)}
          className="w-full sm:w-[240px]"
        />
      </div>

      {!isLoading && transactions?.length === 0 ? (
        <EmptyState
          title="No transactions yet"
          description="Connect a processor or pull transactions to see them appear here."
          icon={Receipt}
        />
      ) : (
        <TransactionsTable
          transactions={transactions || [] }
          onRowClick={setSelectedId}
        />
      )}

      <TransactionDetailModal
        transactionId={selectedId}
        onClose={() => setSelectedId(null)}
      />
    </div>
  );
}
