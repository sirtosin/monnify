"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileSpreadsheet, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BankCombobox } from "@/components/ui/bank-combobox";
import { BANKS } from "@/lib/utils/constants";

interface UploadZoneProps {
  onUpload: (file: File, bankName: string) => void;
  isUploading: boolean;
}

export function UploadZone({ onUpload, isUploading }: UploadZoneProps) {
  const [file, setFile] = useState<File | null>(null);
  const [bankName, setBankName] = useState("Guaranty Trust Bank (GTBank)");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
    maxFiles: 1,
    disabled: isUploading,
  });

  const handleUpload = () => {
    if (file) onUpload(file, bankName);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer ${
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50"
        } ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">
              {isDragActive
                ? "Drop your statement here"
                : "Drag & drop your bank statement"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Supports CSV, XLSX, and XLS files
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {file && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 p-3 rounded-lg bg-muted"
          >
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0"
              onClick={() => setFile(null)}
              disabled={isUploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {file && (
        <div className="flex items-center gap-3">
          <BankCombobox
            banks={BANKS}
            value={bankName}
            onChange={setBankName}
            disabled={isUploading}
          />
          <Button
            onClick={handleUpload}
            disabled={isUploading}
            className="flex-1"
          >
            {isUploading ? "Processing..." : "Upload Statement"}
          </Button>
        </div>
      )}
    </div>
  );
}
