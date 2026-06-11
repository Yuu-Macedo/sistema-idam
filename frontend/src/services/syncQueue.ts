import { ApiError, apiRequest } from "./apiClient";
import { readCache, writeCache } from "./localCache";

const SYNC_QUEUE_KEY = "idamSyncQueue";
const MAX_ATTEMPTS = 5;

export type SyncQueueOperation = {
  id: string;
  path: string;
  method: "POST" | "PATCH" | "PUT" | "DELETE";
  payload?: unknown;
  createdAt: string;
  attempts: number;
  lastError?: string;
};

function createQueueId() {
  return `${Date.now()}-${crypto.randomUUID?.() || Math.random().toString(36).slice(2)}`;
}

export function getSyncQueue() {
  return readCache<SyncQueueOperation[]>(SYNC_QUEUE_KEY, []);
}

function setSyncQueue(queue: SyncQueueOperation[]) {
  writeCache(SYNC_QUEUE_KEY, queue);
}

export function enqueueSyncOperation(
  operation: Omit<SyncQueueOperation, "id" | "createdAt" | "attempts">,
) {
  const queued: SyncQueueOperation = {
    ...operation,
    id: createQueueId(),
    createdAt: new Date().toISOString(),
    attempts: 0,
  };

  setSyncQueue([...getSyncQueue(), queued]);
  return queued;
}

export function isTransientSyncError(error: unknown) {
  return !(error instanceof ApiError) || !error.status || error.status >= 500;
}

async function replayOperation(operation: SyncQueueOperation) {
  await apiRequest(operation.path, {
    method: operation.method,
    body: operation.payload ? JSON.stringify(operation.payload) : undefined,
  });
}

export async function flushSyncQueue() {
  const queue = getSyncQueue();
  const remaining: SyncQueueOperation[] = [];
  let flushed = 0;

  for (const operation of queue) {
    try {
      await replayOperation(operation);
      flushed += 1;
    } catch (error) {
      const attempts = operation.attempts + 1;
      if (attempts < MAX_ATTEMPTS) {
        remaining.push({
          ...operation,
          attempts,
          lastError: error instanceof Error ? error.message : "Falha ao sincronizar.",
        });
      }
    }
  }

  setSyncQueue(remaining);
  return { flushed, pending: remaining.length };
}
