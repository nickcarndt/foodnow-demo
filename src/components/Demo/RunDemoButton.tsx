'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/Button';
import { demoAccounts } from '@/lib/demo-data';
import { setStoredAccounts } from '@/lib/demo-accounts-client';
import { pushClientLog } from '@/lib/client-logs';

export function RunDemoButton() {
  const router = useRouter();
  const [isRunning, setIsRunning] = useState(false);
  const timeouts = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timeouts.current.forEach((id) => window.clearTimeout(id));
      timeouts.current = [];
    };
  }, []);

  const schedule = (fn: () => void, delayMs: number) => {
    const id = window.setTimeout(fn, delayMs);
    timeouts.current.push(id);
  };

  const handleRunDemo = () => {
    if (isRunning) return;
    setIsRunning(true);

    setStoredAccounts(demoAccounts);
    pushClientLog('info', 'Run demo flow started');

    schedule(() => router.push('/checkout'), 300);
    schedule(() => router.push('/checkout/success'), 3500);
    schedule(() => router.push('/fraud'), 6500);
    schedule(() => router.push('/payouts'), 9500);
    schedule(() => {
      setIsRunning(false);
      pushClientLog('success', 'Run demo flow completed');
    }, 12000);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <Button onClick={handleRunDemo} loading={isRunning}>
        Run end-to-end demo (2 min)
      </Button>
      <p className="text-xs text-gray-500">
        Loads demo accounts and walks through the core flows.
      </p>
    </div>
  );
}
