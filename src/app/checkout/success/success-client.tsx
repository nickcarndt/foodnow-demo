'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { DemoIndicator } from '@/components/Layout/DemoIndicator';
import { Header } from '@/components/Layout/Header';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { MoneyFlow } from '@/components/Demo/MoneyFlow';
import { ArchitectureDrawer } from '@/components/Demo/ArchitectureDrawer';
import { RefundExplainer } from '@/components/Demo/RefundExplainer';
import { demoOrderBreakdown, demoOrderId } from '@/lib/demo-data';
import { getStoredAccounts } from '@/lib/demo-accounts-client';
import { CopyButton } from '@/components/ui/CopyButton';
import type { CreateTransfersResponse } from '@/types';

const formatCurrency = (amount: number) => `$${(amount / 100).toFixed(2)}`;

export function SuccessClient() {
  const searchParams = useSearchParams();
  const paymentIntentId = searchParams.get('payment_intent') || 'pi_demo_001';
  const chargeId = searchParams.get('charge') || '';
  const [connectedAccounts, setConnectedAccounts] = useState(getStoredAccounts());
  const [transferIds, setTransferIds] = useState<CreateTransfersResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fallback, setFallback] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasRequested = useRef(false);

  useEffect(() => {
    setConnectedAccounts(getStoredAccounts());
  }, []);

  useEffect(() => {
    if (hasRequested.current) return;
    hasRequested.current = true;

    const createTransfers = async () => {
      setIsLoading(true);
      setError(null);
      setFallback(false);

      try {
        const response = await fetch('/api/create-transfers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentIntentId,
            restaurantAccountId: connectedAccounts.restaurantAccountId,
            courierAccountId: connectedAccounts.courierAccountId,
            restaurantAmount: demoOrderBreakdown.restaurantAmount,
            courierAmount: demoOrderBreakdown.courierAmount,
            orderId: demoOrderId,
          }),
        });

        const data = (await response.json()) as CreateTransfersResponse;

        if (!response.ok || !data.success) {
          setError(data.message || 'Unable to create transfers.');
          return;
        }

        if (data.fallback) {
          setFallback(true);
        }

        setTransferIds(data);
      } catch (err) {
        setError('Unable to create transfers.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    createTransfers();
  }, [paymentIntentId, connectedAccounts.courierAccountId, connectedAccounts.restaurantAccountId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <DemoIndicator />
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">✅</div>
          <h1 className="text-2xl font-semibold text-gray-900">Payment Successful!</h1>
          <p className="text-base text-gray-600 mt-2">Order #{demoOrderId.toUpperCase()}</p>
          <p className="text-xs text-gray-500 mt-1">
            Stripe: Payments + Connect • Objects: PaymentIntent, Transfers
          </p>
        </div>

        <Card className="space-y-6">
          <div className="grid gap-4 text-sm text-gray-600">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">PaymentIntent</span>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">{paymentIntentId}</span>
                <CopyButton value={paymentIntentId} label="Copy" />
                <a
                  href={`https://dashboard.stripe.com/test/payments/${paymentIntentId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-600 hover:text-orange-700 underline text-xs"
                >
                  View in Stripe →
                </a>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Platform kept</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(demoOrderBreakdown.platformFee)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Restaurant transfer</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(demoOrderBreakdown.restaurantAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Courier transfer</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(demoOrderBreakdown.courierAmount)}
              </span>
            </div>
          </div>

          <MoneyFlow
            total={demoOrderBreakdown.total}
            platformFee={demoOrderBreakdown.platformFee}
            restaurantAmount={demoOrderBreakdown.restaurantAmount}
            courierAmount={demoOrderBreakdown.courierAmount}
          />

          <div className="rounded-lg border border-gray-200 p-4 text-sm text-gray-600 space-y-2">
            <p className="text-sm font-semibold text-gray-900">Stripe objects created</p>
            <div className="flex items-center justify-between">
              <span>PaymentIntent</span>
              <span className="font-medium text-gray-900">{paymentIntentId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Charge</span>
              <span className="font-medium text-gray-900">
                {chargeId ? chargeId : 'Created by PaymentIntent'}
              </span>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <LoadingSpinner />
              Creating transfers...
            </div>
          ) : null}

          {fallback ? (
            <div className="text-sm text-amber-700 bg-amber-50 px-3 py-2 rounded">
              Transfers shown are simulated for clarity. PaymentIntent is real.
            </div>
          ) : null}

          {error ? (
            <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">{error}</div>
          ) : null}

          {transferIds ? (
            <div className="rounded-lg border border-gray-200 p-4 text-sm text-gray-600 space-y-2">
              <div className="flex items-center justify-between">
                <span>Restaurant Transfer</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">
                    {transferIds.restaurantTransferId}
                  </span>
                  <CopyButton value={transferIds.restaurantTransferId} label="Copy" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Courier Transfer</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">
                    {transferIds.courierTransferId}
                  </span>
                  <CopyButton value={transferIds.courierTransferId} label="Copy" />
                </div>
              </div>
            </div>
          ) : null}

          <div className="space-y-3 pt-2">
            <ArchitectureDrawer />
            <RefundExplainer />
          </div>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <a href="/">
            <Button variant="secondary">Back to Dashboard</Button>
          </a>
          <a href="/checkout">
            <Button>New Order →</Button>
          </a>
        </div>
      </main>
    </div>
  );
}
