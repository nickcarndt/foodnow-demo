export type DemoLogLevel = 'info' | 'success' | 'error' | 'stripe' | 'simulation';

export interface DemoLogEntry {
  id: string;
  timestamp: string;
  level: DemoLogLevel;
  message: string;
  data?: Record<string, unknown>;
}

const logs: DemoLogEntry[] = [];

const MAX_LOGS = 50;

export function addLog(entry: Omit<DemoLogEntry, 'id' | 'timestamp'>) {
  const nextEntry: DemoLogEntry = {
    id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    ...entry,
  };

  logs.push(nextEntry);

  if (logs.length > MAX_LOGS) {
    logs.shift();
  }
}

export function getLogs() {
  return [...logs];
}

export function clearLogs() {
  logs.length = 0;
}

export function getLogCount() {
  return logs.length;
}
