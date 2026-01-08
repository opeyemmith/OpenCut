"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import { Upload, FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface CsvUploaderProps {
  onDataParsed: (data: any[], fileName: string) => void;
  className?: string;
}

export function CsvUploader({ onDataParsed, className }: CsvUploaderProps) {
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setError("Please upload a valid CSV file.");
      return;
    }

    setFileName(file.name);
    setError(null);
    setIsParsing(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setIsParsing(false);
        if (results.errors.length > 0) {
          setError(`Error parsing CSV: ${results.errors[0].message}`);
        } else if (results.data.length === 0) {
          setError("The CSV file appears to be empty.");
        } else {
          onDataParsed(results.data, file.name);
        }
      },
      error: (err) => {
        setIsParsing(false);
        setError(`Failed to read file: ${err.message}`);
      },
    });
  }, [onDataParsed]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
    },
    maxFiles: 1,
  });

  return (
    <div className={cn("space-y-4", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-xl p-8 transition-colors duration-200 ease-in-out cursor-pointer flex flex-col items-center justify-center gap-3",
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
          error && "border-destructive/50 bg-destructive/5"
        )}
      >
        <input {...getInputProps()} />
        
        <div className={cn(
            "p-4 rounded-full bg-muted transition-colors",
            isDragActive && "bg-primary/10 text-primary"
        )}>
            {fileName ? <FileText className="w-8 h-8" /> : <Upload className="w-8 h-8" />}
        </div>

        <div className="text-center space-y-1">
            <h3 className="font-semibold text-lg">
                {fileName ? fileName : "Upload CSV Data"}
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                {fileName 
                    ? "Click or drag to replace file" 
                    : "Drag & drop your CSV file here, or click to browse"}
            </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Upload Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {fileName && !error && !isParsing && (
        <Alert className="border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Ready to Process</AlertTitle>
          <AlertDescription>CSV parsed successfully.</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
