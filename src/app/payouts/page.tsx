'use client';

import { useState } from 'react';
import Link from 'next/link';

import { DemoIndicator } from '@/components/Layout/DemoIndicator';
import { Header } from '@/components/Layout/Header';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { pushClientLog } from '@/lib/client-logs';

const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

export default function PayoutsPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [payoutId, setPayoutId] = useState('');

  const balance = 247.5;

  const handleCashOut = () => {
    setIsProcessing(true);
    setShowSuccess(false);
    pushClientLog('stripe', 'Simulating instant payout', { amount: balance });

    setTimeout(() => {
      const nextPayoutId = `demo_po_${Date.now()}`;
      setIsProcessing(false);
      setShowSuccess(true);
      setPayoutId(nextPayoutId);
      pushClientLog('success', 'Instant payout simulated', { payoutId: nextPayoutId });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DemoIndicator />
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/" className="text-gray-500 hover:text-gray-700 mb-4 inline-block">
          ← Back to Dashboard
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Courier Dashboard</h1>
          <p className="text-base text-gray-600 mt-2">
            Alex Martinez · ⭐ 4.9 rating
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Stripe: Instant Payouts • Demo simulation only
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="space-y-6">
            <div>
              <p className="text-sm text-gray-500">Available Balance</p>
              <p className="text-3xl font-semibold text-gray-900 mt-2">
                {formatCurrency(balance)}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 p-4 space-y-4">
              <Button onClick={handleCashOut} loading={isProcessing}>
                💸 Cash Out Now
              </Button>
              <div className="text-sm text-gray-500">
                Instant · 1.5% (US) fee · ~30 min
              </div>
              <div className="text-sm text-gray-500">
                or standard payout (free; timing varies)
              </div>
            </div>

            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
              ⚠️ Demo simulation — eligibility varies by account
            </div>
          </Card>

          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Instant Payout Result</h2>
              <Badge status="warning">Simulation</Badge>
            </div>

            {isProcessing ? (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <LoadingSpinner />
                Processing payout...
              </div>
            ) : null}

            {showSuccess ? (
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                <p className="font-semibold">Payout initiated</p>
                <p className="mt-1">Payout ID: {payoutId}</p>
                <p className="mt-1">Estimated arrival: ~30 minutes</p>
              </div>
            ) : (
              <div className="rounded-lg border border-gray-200 p-4 text-sm text-gray-500">
                Use &quot;Cash Out Now&quot; to simulate an instant payout.
              </div>
            )}

            <div className="rounded-lg border border-gray-200 p-4 text-sm text-gray-600">
              💡 Faster payouts can improve courier retention — validate impact in pilot
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
