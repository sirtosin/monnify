"use client";

import { Loader2, Landmark } from "lucide-react";
import { useMono } from "react-mono-js";
import { Button } from "@/components/ui/button";
import { useLinkMonoAccountMutation } from "@/lib/store/api/echo-api";
import { useToast } from "@/lib/hooks/use-toast";

interface MonoConnectButtonProps {
  onLinked: () => void;
  disabled?: boolean;
}

export function MonoConnectButton({
  onLinked,
  disabled,
}: MonoConnectButtonProps) {
  const [linkMonoAccount, { isLoading }] = useLinkMonoAccountMutation();
  const { success, error } = useToast();

  const handleMono = useMono({
    public_key: process.env.NEXT_PUBLIC_MONO_PUBLIC_KEY as string,
  });

  const openWidget = () => {
    if (!process.env.NEXT_PUBLIC_MONO_PUBLIC_KEY) {
      error("Mono is not configured", "Missing NEXT_PUBLIC_MONO_PUBLIC_KEY.");
      return;
    }

    handleMono({
      onClose: () => null,
      onSuccess: async (response: { code: string }) => {
        try {
          await linkMonoAccount({ code: response.code }).unwrap();
          success(
            "Bank account linked",
            "Your account was connected via Mono.",
          );
          onLinked();
        } catch {
          error(
            "Failed to link account",
            "We couldn't finish connecting your bank. Please try again.",
          );
        }
      },
    });
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={openWidget}
      disabled={disabled || isLoading}
      className="w-full sm:w-auto"
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Landmark className="mr-2 h-4 w-4" />
      )}
      Connect bank with Mono
    </Button>
  );
}
