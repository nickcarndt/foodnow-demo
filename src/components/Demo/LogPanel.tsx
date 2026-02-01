'use client';

import { useCallback, useEffect, useState } from 'react';

import type { DemoLogEntry } from '@/lib/log-store';
import { CopyButton } from '@/components/ui/CopyButton';

const levelStyles = {
  info: 'text-blue-600 bg-blue-50',
  success: 'text-green-600 bg-green-50',
  error: 'text-red-600 bg-red-50',
  stripe: 'text-purple-600 bg-purple-50',
  simulation: 'text-amber-700 bg-amber-50',
};

interface LogPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function LogPanel({ isOpen, onToggle }: LogPanelProps) {
  const [logs, setLogs] = useState<DemoLogEntry[]>([]);
  const [logCount, setLogCount] = useState(0);

  const fetchLogs = useCallback(async () => {
    try {
      const response = await fetch('/api/logs', { cache: 'no-store' });
      const data = (await response.json()) as { success: boolean; data: DemoLogEntry[] };
      if (data.success) {
        setLogs(data.data);
        setLogCount(data.data.length);
      }
    } catch {
      // Ignore polling errors in demo mode
    }
  }, []);

  const fetchLogCount = useCallback(async () => {
    try {
      const response = await fetch('/api/logs/count', { cache: 'no-store' });
      const data = (await response.json()) as { success: boolean; count: number };
      if (data.success) {
        setLogCount(data.count);
      }
    } catch {
      // Ignore polling errors
    }
  }, []);

  useEffect(() => {
    fetchLogCount();
    const interval = setInterval(fetchLogCount, 2000);
    return () => clearInterval(interval);
  }, [fetchLogCount]);

  useEffect(() => {
    if (!isOpen) return;
    fetchLogs();
    const interval = setInterval(fetchLogs, 1500);
    return () => clearInterval(interval);
  }, [fetchLogs, isOpen]);

  const handleClear = async () => {
    try {
      await fetch('/api/logs', { method: 'DELETE' });
      setLogs([]);
      setLogCount(0);
    } catch {
      setLogs([]);
      setLogCount(0);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        type="button"
        onClick={onToggle}
        className="mb-3 ml-auto flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm text-white shadow-lg hover:bg-gray-800 transition-colors"
      >
        Logs
        <span className="rounded-full bg-orange-500 px-2 py-0.5 text-xs font-semibold">
          {logCount}
        </span>
      </button>

      {isOpen ? (
        <div className="w-80 max-h-96 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
            <p className="text-sm font-semibold text-gray-900">Demo Logs</p>
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Clear
            </button>
          </div>
          <div className="p-4 space-y-3">
            {logs.length === 0 ? (
              <p className="text-sm text-gray-500">No logs yet.</p>
            ) : null}
            {logs
              .slice()
              .reverse()
              .map((entry, index) => (
                <div
                  key={`${entry.id}-${index}`}
                  className="rounded-lg border border-gray-100 p-3 text-xs text-gray-600"
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded-full ${levelStyles[entry.level]}`}>
                      {entry.level.toUpperCase()}
                    </span>
                    <span className="text-gray-400">
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-800">{entry.message}</p>
                  {entry.data ? (
                    <div className="mt-2 space-y-2">
                      <pre className="whitespace-pre-wrap break-words text-[11px] text-gray-500">
                        {JSON.stringify(entry.data, null, 2)}
                      </pre>
                      <CopyButton value={JSON.stringify(entry.data)} label="Copy data" />
                    </div>
                  ) : null}
                </div>
              ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
