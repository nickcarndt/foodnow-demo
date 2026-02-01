import { NextResponse } from 'next/server';

import { addLog, clearLogs, getLogs, type DemoLogEntry, type DemoLogLevel } from '@/lib/log-store';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ success: true, data: getLogs() });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      level?: DemoLogLevel;
      message?: string;
      data?: DemoLogEntry['data'];
    };

    if (!body?.level || !body?.message) {
      return NextResponse.json(
        { success: false, message: 'Invalid log payload' },
        { status: 400 },
      );
    }

    addLog({ level: body.level, message: body.message, data: body.data });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Log store error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function DELETE() {
  clearLogs();
  return NextResponse.json({ success: true, cleared: true });
}
