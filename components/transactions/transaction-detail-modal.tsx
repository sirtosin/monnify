"use client";

import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useGetTransactionQuery } from "@/lib/store/api/echo-api";
import { formatCurrency } from "@/lib/utils/formatters";

interface TransactionDetailModalProps {
  transactionId: string | null;
  onClose: () => void;
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

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2 border-b last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-right">{value}</span>
    </div>
  );
}

export function TransactionDetailModal({
  transactionId,
  onClose,
}: TransactionDetailModalProps) {
  const { data, isLoading } = useGetTransactionQuery(transactionId ?? "", {
    skip: !transactionId,
  });

  const transaction = data?.data;

  return (
    <Dialog open={!!transactionId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {!isLoading && !transaction && (
          <p className="text-sm text-muted-foreground py-6 text-center">
            Transaction not found.
          </p>
        )}

        {transaction && (
          <div className="space-y-1">
            <div className="flex items-center justify-between pb-3 mb-2 border-b">
              <div>
                <p className="text-lg font-bold">
                  {formatCurrency(Number(transaction.amount))}
                </p>
                <p className="text-xs text-muted-foreground">
                  {transaction.processor_reference}
                </p>
              </div>
              <Badge
                variant="outline"
                className={statusVariant(transaction.status)}
              >
                {transaction.status}
              </Badge>
            </div>

            <Row label="Processor" value={transaction.payfac_source} />
            <Row
              label="Amount"
              value={formatCurrency(Number(transaction.amount))}
            />
            <Row label="Fee" value={formatCurrency(Number(transaction.fee))} />
            <Row
              label="Net Amount"
              value={formatCurrency(Number(transaction.net_amount))}
            />
            <Row
              label="Paid At"
              value={new Date(transaction.paid_at).toLocaleString()}
            />
            <Row
              label="Settled"
              value={
                transaction.is_settled ? (
                  <span className="text-emerald-600">Yes</span>
                ) : (
                  <span className="text-amber-600">Not yet</span>
                )
              }
            />
            {transaction.settlement_id && (
              <Row
                label="Settlement ID"
                value={
                  <code className="text-xs">{transaction.settlement_id}</code>
                }
              />
            )}
            <Row
              label="Created"
              value={new Date(transaction.created_at).toLocaleString()}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
