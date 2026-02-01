'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { DemoIndicator } from '@/components/Layout/DemoIndicator';
import { Header } from '@/components/Layout/Header';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { CheckAccountResponse } from '@/types';

export function ReturnClient() {
  const searchParams = useSearchParams();
  const accountId = searchParams.get('account_id') || '';
  const [status, setStatus] = useState<CheckAccountResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fallback, setFallback] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpeningDashboard, setIsOpeningDashboard] = useState(false);

  const handleOpenExpressDashboard = async () => {
    if (!accountId) return;
    setIsOpeningDashboard(true);
    try {
      const response = await fetch('/api/create-express-login-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId }),
      });
      const data = (await response.json()) as { success: boolean; url?: string; message?: string };
      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        setError(data.message || 'Unable to open Express Dashboard');
        setIsOpeningDashboard(false);
      }
    } catch {
      setError('Unable to open Express Dashboard');
      setIsOpeningDashboard(false);
    }
  };

  useEffect(() => {
    if (!accountId) {
      setError('Missing account ID. Please return to onboarding.');
      return;
    }

    const fetchStatus = async () => {
      setIsLoading(true);
      setError(null);
      setFallback(false);

      try {
        const response = await fetch('/api/check-account', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accountId }),
        });

        const data = (await response.json()) as CheckAccountResponse;

        if (!response.ok || !data.success) {
          setError(data.message || 'Unable to load account status.');
          return;
        }

        if (data.fallback) {
          setFallback(true);
        }

        setStatus(data);
      } catch (err) {
        setError('Unable to load account status.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatus();
  }, [accountId]);

  // Primary gate: details_submitted determines if Express Dashboard is accessible
  const canAccessExpressDashboard = status?.detailsSubmitted === true;
  
  // Full active status for badge display
  const isFullyActive =
    status?.payoutsEnabled && status?.chargesEnabled && status?.detailsSubmitted;

  return (
    <div className="min-h-screen bg-gray-50">
      <DemoIndicator />
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">✅</div>
          <h1 className="text-2xl font-semibold text-gray-900">Onboarding Complete!</h1>
          <p className="text-base text-gray-600 mt-2">
            Your partner is now ready to accept orders on FoodNow.
          </p>
        </div>

        <Card className="grid gap-4">
          <div className="flex items-center justify-between">
            <p className="text-base font-semibold text-gray-900">Account Details</p>
            <Badge status={isFullyActive ? 'success' : 'warning'}>
              {isFullyActive ? 'Active' : 'Pending'}
            </Badge>
          </div>

          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <LoadingSpinner />
              Checking account status...
            </div>
          ) : null}

          {fallback ? (
            <div className="text-sm text-yellow-600 bg-yellow-50 px-3 py-2 rounded">
              Demo fallback activated
            </div>
          ) : null}

          {error ? (
            <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">{error}</div>
          ) : null}

          {status ? (
            <div className="grid gap-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span className="text-gray-500">Account ID</span>
                <span className="font-medium text-gray-900">{status.accountId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Type</span>
                <span className="font-medium text-gray-900">Express</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Details Submitted</span>
                <span className="font-medium text-gray-900">
                  {status.detailsSubmitted ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Charges</span>
                <span className="font-medium text-gray-900">
                  {status.chargesEnabled ? 'Enabled' : 'Pending'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payouts</span>
                <span className="font-medium text-gray-900">
                  {status.payoutsEnabled ? 'Enabled' : 'Pending'}
                </span>
              </div>
            </div>
          ) : null}
        </Card>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <Link href="/">
            <Button variant="secondary">Back to Dashboard</Button>
          </Link>
          {accountId ? (
            <>
              <a
                href={`https://dashboard.stripe.com/test/connect/accounts/${accountId}`}
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="secondary">View in Stripe (platform admin) →</Button>
              </a>
              <Button 
                onClick={handleOpenExpressDashboard} 
                loading={isOpeningDashboard}
                disabled={!canAccessExpressDashboard && !isLoading}
              >
                Open Express Dashboard (restaurant) →
              </Button>
            </>
          ) : null}
        </div>

        {accountId ? (
          <div className="text-center mt-4 space-y-2">
            {!canAccessExpressDashboard && status ? (
              <p className="text-xs text-amber-600">
                Express Dashboard available after onboarding details are submitted.
              </p>
            ) : null}
            <p className="text-xs text-gray-500">
              Platform admin view requires Stripe Dashboard login. Express Dashboard opens a Stripe-hosted portal for the connected account (no separate credentials).
            </p>
          </div>
        ) : null}
      </main>
    </div>
  );
}
