"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatRelativeTime } from "@/lib/utils/formatters";
import type { Transaction } from "@/types";

interface TransactionsTableProps {
  transactions: Transaction[];
  onRowClick: (id: string) => void;
}

function statusVariant(status: string) {
  switch (status) {
    case "SUCCESS":
    case "SETTLED":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    case "PENDING":
      return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    case "FAILED":
      return "bg-red-500/10 text-red-600 border-red-500/20";
    default:
      return "";
  }
}

export function TransactionsTable({
  transactions,
  onRowClick,
}: TransactionsTableProps) {
  return (
    <div className="rounded-lg border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Reference</TableHead>
            <TableHead>Processor</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Settled</TableHead>
            <TableHead>Paid At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow
              key={tx.id}
              onClick={() => onRowClick(tx.id)}
              className="cursor-pointer hover:bg-muted/50"
            >
              <TableCell className="font-medium max-w-[160px] truncate">
                {tx.processor_reference}
              </TableCell>
              <TableCell>{tx.payfac_source}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(Number(tx.amount))}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={statusVariant(tx.status)}>
                  {tx.status}
                </Badge>
              </TableCell>
              <TableCell>
                {tx.is_settled ? (
                  <span className="text-xs text-emerald-600">Yes</span>
                ) : (
                  <span className="text-xs text-amber-600">Pending</span>
                )}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {formatRelativeTime(tx.paid_at)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
