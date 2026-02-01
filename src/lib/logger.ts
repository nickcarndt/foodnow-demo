type LogLevel = 'info' | 'success' | 'error' | 'stripe';

interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  data?: unknown;
}

class DemoLogger {
  private logs: LogEntry[] = [];
  private listeners: ((logs: LogEntry[]) => void)[] = [];

  log(level: LogLevel, message: string, data?: unknown) {
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      data,
    };

    this.logs.push(entry);

    if (this.logs.length > 50) {
      this.logs.shift();
    }

    this.listeners.forEach((listener) => listener([...this.logs]));

    const emoji = {
      info: 'ℹ️',
      success: '✅',
      error: '❌',
      stripe: '💳',
    }[level];

    console.log(`${emoji} [${level.toUpperCase()}] ${message}`, data || '');
  }

  subscribe(listener: (logs: LogEntry[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((item) => item !== listener);
    };
  }

  getLogs() {
    return [...this.logs];
  }

  clear() {
    this.logs = [];
    this.listeners.forEach((listener) => listener([]));
  }
}

export const logger = new DemoLogger();
