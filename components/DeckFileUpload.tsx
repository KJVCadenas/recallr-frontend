"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import api from "@/lib/api/client";
import {
  ImportDeckJobStatus,
  ImportDeckJobStatusResponse,
  ImportDeckResult,
  useImportDeckText,
} from "@/hooks/useDecks";
import { cn } from "@/lib/frontend/utils";

interface DeckFileUploadProps {
  deckName?: string;
  description?: string;
  onImported?: (result: ImportDeckResult) => void;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}

export function DeckFileUpload({
  deckName,
  description,
  onImported,
}: DeckFileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [status, setStatus] = useState<ImportDeckJobStatus | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const pollAbortRef = useRef({ aborted: false });
  const isPollingRef = useRef(false);

  const importTextMutation = useImportDeckText();

  const handleFileSelection = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (files.length > 1) {
      setError("Please upload a single file.");
      return;
    }
    const selected = files[0];
    if (
      selected.type !== "application/pdf" &&
      selected.type !== "application/x-pdf" &&
      !selected.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Only PDF files are allowed.");
      return;
    }
    if (selected.size > 5 * 1024 * 1024) {
      setError("File exceeds the 5MB limit.");
      return;
    }

    setError(null);
    setWarnings([]);
    setStatus(null);
    setJobId(null);
    setFile(selected);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Select a file to upload.");
      return;
    }

    setError(null);
    setWarnings([]);
    setStatus("queued");
    setIsParsing(true);
    try {
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url,
      ).toString();
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const maxPages = Math.min(pdf.numPages, 3);
      if (pdf.numPages > 3) {
        setWarnings((prev) => [
          ...prev,
          "PDF was truncated to the first 3 pages.",
        ]);
      }
      let text = "";
      for (let pageNum = 1; pageNum <= maxPages; pageNum += 1) {
        const page = await pdf.getPage(pageNum);
        const content = await page.getTextContent();
        const pageText = content.items
          .map((item) => ("str" in item ? item.str : ""))
          .join(" ");
        text += `${pageText}\n\n`;
      }
      text = text.trim();
      if (!text) {
        setError("PDF contained no extractable text.");
        setIsParsing(false);
        setStatus(null);
        return;
      }

      const response = await importTextMutation.mutateAsync({
        text,
        name: deckName?.trim() || undefined,
        description: description?.trim() || undefined,
      });
      setJobId(response.jobId);
      setStatus(response.status);
      return;
    } catch (parseError) {
      setError(
        (parseError as Error).message ||
          "Failed to parse PDF in the browser.",
      );
    } finally {
      setIsParsing(false);
    }

    setStatus(null);
  };

  useEffect(() => {
    if (!jobId || isPollingRef.current) return;
    const pollController = { aborted: false };
    pollAbortRef.current = pollController;
    isPollingRef.current = true;

    const poll = async () => {
      const startTime = Date.now();
      let delayMs = 3000;
      while (!pollController.aborted) {
        try {
          const response = await api.get<ImportDeckJobStatusResponse>(
            `/api/decks/import-text/${jobId}`,
          );
          const data = response.data;
          setStatus(data.status);
          if (data.status === "completed") {
            if (data.result) {
              setWarnings(data.result.warnings || []);
              onImported?.(data.result);
            } else {
              setError("Import completed without results. Please retry.");
            }
            return;
          }
          if (data.status === "failed") {
            setError(data.error || "Import failed.");
            return;
          }
        } catch (pollError) {
          setError((pollError as Error).message || "Import failed.");
          return;
        }

        if (Date.now() - startTime > 60000) {
          setError("Import is taking too long. Please try again.");
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, delayMs));
        delayMs = Math.min(delayMs + 500, 5000);
      }
    };

    void poll();

    return () => {
      pollController.aborted = true;
      isPollingRef.current = false;
    };
  }, [jobId, onImported]);

  const isProcessing = status === "queued" || status === "processing" || isParsing;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Import From File</h3>
      </div>

      <Card
        role="button"
        tabIndex={0}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragActive(false);
          handleFileSelection(event.dataTransfer.files);
        }}
        className={cn(
          "border-dashed border-2 p-6 text-center transition-colors cursor-pointer relative overflow-hidden",
          dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/40",
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="sr-only"
          onChange={(event) => handleFileSelection(event.target.files)}
        />
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Drag and drop a file here, or click to browse.
          </p>
          <div className="rounded-md border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
            PDF only. Max 5MB. We process the first 3 pages and truncate the rest.
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={(event) => {
              event.stopPropagation();
              fileInputRef.current?.click();
            }}
          >
            Choose File
          </Button>
          {file ? (
            <div className="text-sm font-medium">
              <span>{file.name}</span>
              <span className="ml-2 text-muted-foreground">
                ({formatBytes(file.size)})
              </span>
            </div>
          ) : (
            <p className="text-sm">No file selected.</p>
          )}
        </div>

        {isProcessing ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Spinner className="size-4" />
              {isParsing
                ? "Parsing PDF..."
                : status === "queued"
                ? "Queued for processing..."
                : "Generating flashcards..."}
            </div>
            <div className="h-1 w-40 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-1/2 animate-[pulse_1.5s_ease-in-out_infinite] rounded-full bg-primary" />
            </div>
          </div>
        ) : null}
      </Card>

      {error ? (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <strong className="font-semibold">Upload failed:</strong> {error}
        </div>
      ) : null}
      {warnings.length > 0 ? (
        <div className="rounded-md border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground space-y-1">
          {warnings.map((warning, index) => (
            <p key={index}>{warning}</p>
          ))}
        </div>
      ) : null}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            onClick={handleUpload}
            loading={importTextMutation.isPending}
            loadingText="Uploading..."
            disabled={importTextMutation.isPending || isProcessing}
          >
            Upload File
          </Button>
          {file ? (
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setFile(null);
                setWarnings([]);
                setStatus(null);
                setJobId(null);
                setError(null);
              }}
              disabled={importTextMutation.isPending || isProcessing}
            >
              Clear
            </Button>
          ) : null}
        </div>
        <Link
          href="/TypeScript_Handbook.pdf"
          download
        >
          <Button type="button" variant="link">
            Download Sample
          </Button>
        </Link>
      </div>
    </div>
  );
}
