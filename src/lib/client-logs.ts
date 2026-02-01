import type { DemoLogLevel, DemoLogEntry } from '@/lib/log-store';

export async function pushClientLog(
  level: DemoLogLevel,
  message: string,
  data?: DemoLogEntry['data'],
) {
  try {
    await fetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ level, message, data }),
    });
  } catch {
    // Ignore client log errors in demo
  }
}
