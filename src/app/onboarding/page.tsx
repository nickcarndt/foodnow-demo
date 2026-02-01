'use client';

import { useEffect, useState } from 'react';

import { DemoIndicator } from '@/components/Layout/DemoIndicator';
import { Header } from '@/components/Layout/Header';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { demoAccounts } from '@/lib/demo-data';
import { setStoredAccounts } from '@/lib/demo-accounts-client';
import { pushClientLog } from '@/lib/client-logs';
import type { AccountType, CreateConnectAccountResponse } from '@/types';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
const isPublicUrl = baseUrl.startsWith('https://');

export default function OnboardingPage() {
  const [accountType, setAccountType] = useState<AccountType>('restaurant');
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fallback, setFallback] = useState(false);
  const [demoAccountsReady, setDemoAccountsReady] = useState(false);

  useEffect(() => {
    if (!isPublicUrl) {
      setStoredAccounts(demoAccounts);
      setDemoAccountsReady(true);
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setFallback(false);

    try {
      const response = await fetch('/api/create-connect-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountType,
          email,
          businessName,
        }),
      });

      const data = (await response.json()) as CreateConnectAccountResponse;

      if (!response.ok || !data.success) {
        setError(data.message || 'Something went wrong. Please try again.');
        return;
      }

      if (data.fallback) {
        setFallback(true);
      }

      window.location.href = data.onboardingUrl;
    } catch (err) {
      setError('Unable to start onboarding. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseDemoAccounts = () => {
    setStoredAccounts(demoAccounts);
    setDemoAccountsReady(true);
    pushClientLog('info', 'Loaded pre-created demo accounts', {
      restaurantAccountId: demoAccounts.restaurantAccountId,
      courierAccountId: demoAccounts.courierAccountId,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DemoIndicator />
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <a href="/" className="text-gray-500 hover:text-gray-700 mb-4 inline-block">
          ← Back to Dashboard
        </a>

        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Onboard a restaurant or courier (Express)
          </h1>
          <p className="text-base text-gray-600 mt-2">
            Get restaurants and couriers earning on FoodNow.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Creates a connected account and launches Stripe-hosted onboarding.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Stripe: Connect Express • Objects: Account, AccountLink
          </p>
          {!isPublicUrl ? (
            <div className="mt-3 text-sm text-gray-700 bg-blue-50 border border-blue-200 px-4 py-3 rounded-lg">
              <p className="font-medium">💡 Interview mode</p>
              <p className="mt-1">
                For reliable demos, I use pre-created test accounts to avoid onboarding delays.
                Live Express onboarding works on the deployed Vercel URL.
              </p>
            </div>
          ) : null}
          <p className="text-xs text-gray-500 mt-2">
            Demo accounts: {demoAccounts.restaurantAccountId} · {demoAccounts.courierAccountId}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-2">
            <button
              type="button"
              onClick={() => setAccountType('restaurant')}
              className={`text-left rounded-xl border p-6 transition-all ${
                accountType === 'restaurant'
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 bg-white hover:border-orange-200'
              }`}
            >
              <p className="text-lg font-semibold text-gray-900">🍕 Restaurant</p>
              <p className="text-sm text-gray-600 mt-2">Accept orders and payments</p>
              <p className="text-xs text-gray-500 mt-4">
                {accountType === 'restaurant' ? 'Selected' : 'Click to select'}
              </p>
            </button>
            <button
              type="button"
              onClick={() => setAccountType('courier')}
              className={`text-left rounded-xl border p-6 transition-all ${
                accountType === 'courier'
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 bg-white hover:border-orange-200'
              }`}
            >
              <p className="text-lg font-semibold text-gray-900">🚴 Courier</p>
              <p className="text-sm text-gray-600 mt-2">Deliver orders and earn money</p>
              <p className="text-xs text-gray-500 mt-4">
                {accountType === 'courier' ? 'Selected' : 'Click to select'}
              </p>
            </button>
          </div>

          <Card className="grid gap-4">
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="name@business.com"
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">
                {accountType === 'restaurant' ? 'Business Name' : 'Full Name'}
              </label>
              <input
                value={businessName}
                onChange={(event) => setBusinessName(event.target.value)}
                className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder={accountType === 'restaurant' ? "Mario's Pizza" : 'Alex Martinez'}
                required
              />
            </div>
            {fallback ? (
              <div className="text-sm text-yellow-600 bg-yellow-50 px-3 py-2 rounded">
                Demo fallback activated
              </div>
            ) : null}
            {error ? (
              <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">
                {error}
              </div>
            ) : null}
            <Button type="submit" loading={isLoading} disabled={!isPublicUrl}>
              Use hosted onboarding (requires public URL) →
            </Button>
            <Button type="button" variant="secondary" onClick={handleUseDemoAccounts}>
              Use pre-created demo accounts (recommended)
            </Button>
            {demoAccountsReady ? (
              <div className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded">
                Demo accounts loaded. Checkout will use connected IDs for transfers.
              </div>
            ) : null}
          </Card>

          <Card className="bg-white">
            <p className="text-sm font-semibold text-gray-900 mb-2">What happens next</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>We create a Stripe Express account</li>
              <li>You complete identity verification</li>
              <li>You're ready to receive payouts</li>
            </ul>
          </Card>
        </form>
      </main>
    </div>
  );
}
