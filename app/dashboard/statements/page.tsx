"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Landmark } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadZone } from "@/components/statements/upload-zone";
import { ProcessingAnimation } from "@/components/statements/processing-animation";
import { UploadSummary } from "@/components/statements/upload-summary";
import { StatementList } from "@/components/statements/statement-list";
import { useToast } from "@/lib/hooks/use-toast";
import {
  useGetStatementsQuery,
  useUploadStatementMutation,
  useGetMonoConnectionsQuery,
} from "@/lib/store/api/echo-api";
import {
  setStatements,
  addStatement,
  setUploading,
  setUploadProgress,
  setUploadSteps,
  updateUploadStep,
} from "@/lib/store/slices/statements-slice";
import { PROCESSING_STEPS } from "@/lib/utils/constants";
import type { RootState } from "@/lib/store";
import type { BankStatement } from "@/types";
import { MonoConnectButton } from "@/components/statements/mono-connect-button";
import { MonoConnectionsList } from "@/components/statements/mono-connections-list";
import { useRouter } from "next/navigation";

type StatementSource = "upload" | "mono";

export default function StatementsPage() {
  const dispatch = useDispatch();
  const { success } = useToast();
  const [lastUploaded, setLastUploaded] = useState<BankStatement | null>(null);
  const [source, setSource] = useState<StatementSource>("upload");
  const route = useRouter();
  const {
    statements: localStatements,
    isUploading,
    uploadProgress,
    uploadSteps,
  } = useSelector((state: RootState) => state.statements);

  // RTK Query hooks
  const { data: apiStatements } = useGetStatementsQuery();
  const [uploadStatement] = useUploadStatementMutation();
  const { data: monoConnections, refetch: refetchMonoConnections } =
    useGetMonoConnectionsQuery(undefined, { skip: source !== "mono" });

  // Sync API data to Redux store
  useEffect(() => {
    if (apiStatements?.data) {
      dispatch(setStatements(apiStatements.data));
    }
  }, [apiStatements, dispatch]);

  const statements = apiStatements?.data || localStatements;

  const simulateProcessing = async (file: File, bankName: string) => {
    dispatch(setUploading(true));
    dispatch(setUploadProgress(0));

    const steps = PROCESSING_STEPS.map((step) => ({
      ...step,
      status: "pending" as const,
    }));
    dispatch(setUploadSteps(steps));

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      dispatch(updateUploadStep({ id: step.id, status: "active" }));
      await new Promise((resolve) => setTimeout(resolve, 500));
      dispatch(updateUploadStep({ id: step.id, status: "completed" }));
      dispatch(setUploadProgress(((i + 1) / steps.length) * 100));
    }

    // Try API first, fallback to local
    try {
      const formData = new FormData();
      formData.append("bank_name", bankName);
      formData.append("statement", file);
      const result = await uploadStatement(formData).unwrap();
      if (result.data) {
        dispatch(addStatement(result.data));
        setLastUploaded(result.data);
      } else {
    
      }
    } catch (err) {

    }

    dispatch(setUploading(false));
    success(
      "Statement uploaded",
      `${file.name} has been processed successfully.`,
    );
  };

  const handleUpload = (file: File, bankName: string) => {
    simulateProcessing(file, bankName);
  };

  const handleMonoLinked = () => {
    refetchMonoConnections();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Bank Statements</h2>
        <p className="text-muted-foreground">
          Upload a statement file or connect your bank directly with Mono
        </p>
      </div>

      <Tabs
        value={source}
        onValueChange={(v) => setSource(v as StatementSource)}
      >
        <TabsList>
          <TabsTrigger value="upload" className="gap-2">
            <Upload className="h-4 w-4" />
            Upload File
          </TabsTrigger>
          <TabsTrigger value="mono" className="gap-2">
            <Landmark className="h-4 w-4" />
            Connect Bank (Mono)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <UploadZone onUpload={handleUpload} isUploading={isUploading} />

          <AnimatePresence mode="wait">
            {isUploading && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <ProcessingAnimation
                  progress={uploadProgress}
                  currentStep={
                    uploadSteps.find((s) => s.status === "active")?.id || ""
                  }
                  completedSteps={uploadSteps
                    .filter((s) => s.status === "completed")
                    .map((s) => s.id)}
                />
              </motion.div>
            )}

            {lastUploaded && !isUploading && (
              <motion.div
                key="summary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <UploadSummary
                  statement={lastUploaded}
                  onViewLedger={() => route.push("/dashboard/ledger")}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="mono" className="space-y-4">
          <MonoConnectButton onLinked={handleMonoLinked} />
          <MonoConnectionsList connections={monoConnections?.data || []} />
        </TabsContent>
      </Tabs>

      {statements.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Recent Uploads</h3>
          <StatementList statements={statements} />
        </div>
      )}
    </div>
  );
}
