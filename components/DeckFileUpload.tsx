"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useImportDeckFile } from "@/hooks/useDecks";
import { cn } from "@/lib/frontend/utils";

interface DeckFileUploadProps {
  deckName?: string;
  description?: string;
  onImported?: (result: unknown) => void;
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
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const importMutation = useImportDeckFile();

  const handleFileSelection = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (files.length > 1) {
      setError("Please upload a single file.");
      return;
    }
    setError(null);
    setFile(files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Select a file to upload.");
      return;
    }

    setError(null);
    try {
      const result = await importMutation.mutateAsync({
        file,
        name: deckName?.trim() || undefined,
        description: description?.trim() || undefined,
      });
      onImported?.(result);
    } catch (uploadError) {
      setError((uploadError as Error).message || "Upload failed.");
    }
  };

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
          "border-dashed border-2 p-6 text-center transition-colors cursor-pointer",
          dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/40",
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="sr-only"
          onChange={(event) => handleFileSelection(event.target.files)}
        />
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Drag and drop a file here, or click to browse.
          </p>
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
      </Card>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="flex items-center gap-3">
        <Button
          type="button"
          onClick={handleUpload}
          loading={importMutation.isPending}
          loadingText="Uploading..."
          disabled={importMutation.isPending}
        >
          Upload File
        </Button>
        {file ? (
          <Button
            type="button"
            variant="ghost"
            onClick={() => setFile(null)}
            disabled={importMutation.isPending}
          >
            Clear
          </Button>
        ) : null}
      </div>
    </div>
  );
}
