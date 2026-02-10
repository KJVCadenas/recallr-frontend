import { randomUUID } from "crypto";
import type { FlashcardGenerationResult } from "./types";

export type ImportJobStatus = "queued" | "processing" | "completed" | "failed";

export interface ImportJobRecord {
  id: string;
  status: ImportJobStatus;
  createdAt: number;
  updatedAt: number;
  userId: string;
  result?: FlashcardGenerationResult;
  error?: string;
}

const JOB_TTL_MS = 30 * 60 * 1000;

function getStore() {
  const globalScope = globalThis as typeof globalThis & {
    __flashcardImportJobs?: Map<string, ImportJobRecord>;
  };

  if (!globalScope.__flashcardImportJobs) {
    globalScope.__flashcardImportJobs = new Map();
  }

  return globalScope.__flashcardImportJobs;
}

function cleanupJobs() {
  const store = getStore();
  const now = Date.now();
  store.forEach((job, key) => {
    if (now - job.updatedAt > JOB_TTL_MS) {
      store.delete(key);
    }
  });
}

export function createImportJob(userId: string): ImportJobRecord {
  cleanupJobs();
  const store = getStore();
  const now = Date.now();
  const job: ImportJobRecord = {
    id: randomUUID(),
    status: "queued",
    createdAt: now,
    updatedAt: now,
    userId,
  };
  store.set(job.id, job);
  return job;
}

export function getImportJob(jobId: string): ImportJobRecord | undefined {
  cleanupJobs();
  const store = getStore();
  return store.get(jobId);
}

export function updateImportJob(jobId: string, updates: Partial<ImportJobRecord>) {
  const store = getStore();
  const job = store.get(jobId);
  if (!job) return;
  const updated: ImportJobRecord = {
    ...job,
    ...updates,
    updatedAt: Date.now(),
  };
  store.set(jobId, updated);
}
