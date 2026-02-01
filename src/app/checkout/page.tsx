'use client';

import { useEffect, useMemo, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';

import { DemoIndicator } from '@/components/Layout/DemoIndicator';
import { Header } from '@/components/Layout/Header';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { demoOrderBreakdown, demoOrderItems } from '@/lib/demo-data';
import { CopyButton } from '@/components/ui/CopyButton';
import { pushClientLog } from '@/lib/client-logs';
import type { CreatePaymentResponse, OrderBreakdown } from '@/types';

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

const formatCurrency = (amount: number) => `$${(amount / 100).toFixed(2)}`;

function CheckoutForm({ breakdown }: { breakdown: OrderBreakdown }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!stripe || !elements) {
      setError('Stripe is still loading. Please try again.');
      setIsSubmitting(false);
      return;
    }

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success?total=${breakdown.total}`,
      },
    });

    if (stripeError) {
      setError(stripeError.message || 'Payment failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {error ? (
        <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">{error}</div>
      ) : null}
      <Button type="submit" loading={isSubmitting} disabled={!stripe || !elements}>
        Pay {formatCurrency(breakdown.total)} →
      </Button>
    </form>
  );
}

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [breakdown, setBreakdown] = useState<OrderBreakdown>(demoOrderBreakdown);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fallback, setFallback] = useState(false);
  const [paymentMode, setPaymentMode] = useState<'card' | 'automatic'>('card');

  const createPayment = async (mode: 'card' | 'automatic') => {
    setIsLoading(true);
    setError(null);
    setFallback(false);

    try {
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: demoOrderBreakdown.total, paymentMethodMode: mode }),
      });

      const data = (await response.json()) as CreatePaymentResponse;

      if (!response.ok || !data.success) {
        setError(data.message || 'Unable to start checkout.');
        pushClientLog('error', 'Checkout failed to initialize');
        return;
      }

      if (data.fallback) {
        setFallback(true);
      }

      setClientSecret(data.clientSecret);
      setPaymentIntentId(data.paymentIntentId);
      setBreakdown(data.breakdown);
      pushClientLog('stripe', 'Checkout initialized', {
        paymentIntentId: data.paymentIntentId,
        amount: data.breakdown.total,
      });
    } catch (err) {
      setError('Unable to start checkout.');
      pushClientLog('error', 'Checkout failed to initialize');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    createPayment(paymentMode);
  }, [paymentMode]);

  const elementsOptions = useMemo(
    () => ({
      clientSecret: clientSecret || '',
      appearance: {
        theme: 'stripe' as const,
      },
    }),
    [clientSecret],
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <DemoIndicator />
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <a href="/" className="text-gray-500 hover:text-gray-700 mb-4 inline-block">
          ← Back to Dashboard
        </a>

        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Checkout</h1>
          <p className="text-base text-gray-600 mt-2">
            Process a customer payment with automatic splits to each party.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Stripe: Payments + Connect • Objects: PaymentIntent, Transfers
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Your Order</h2>
              <p className="text-sm text-gray-500">Demo order for a single delivery.</p>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              {demoOrderItems.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.name}</span>
                  <span className="font-medium text-gray-900">{formatCurrency(item.price)}</span>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-3 flex justify-between text-base font-semibold text-gray-900">
                <span>Total</span>
                <span>{formatCurrency(breakdown.total)}</span>
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 p-4 space-y-3 text-sm text-gray-600">
              <p className="font-semibold text-gray-900">How funds split</p>
              <p className="text-xs text-gray-500">
                Platform charge with separate transfers (demo).
              </p>
              <div className="flex justify-between">
                <span>Platform fee (15%)</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(breakdown.platformFee)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Restaurant</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(breakdown.restaurantAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Courier</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(breakdown.courierAmount)}
                </span>
              </div>
            </div>
          </Card>

          <Card className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Payment</h2>
              <p className="text-sm text-gray-500">Use the Stripe Payment Element.</p>
            </div>

            {isLoading ? (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <LoadingSpinner />
                Preparing secure payment form...
              </div>
            ) : null}

            {fallback ? (
              <div className="text-sm text-yellow-700 bg-yellow-50 px-3 py-2 rounded">
                Demo simulation activated (PaymentIntent not created).
              </div>
            ) : null}

            {error ? (
              <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">{error}</div>
            ) : null}

            {!publishableKey ? (
              <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">
                Missing Stripe publishable key. Add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.
              </div>
            ) : null}

            {clientSecret && stripePromise && !fallback ? (
              <Elements stripe={stripePromise} options={elementsOptions} key={clientSecret}>
                <CheckoutForm breakdown={breakdown} />
              </Elements>
            ) : null}
            {paymentIntentId ? (
              <div className="text-xs text-gray-500">
                PaymentIntent: <span className="font-medium text-gray-700">{paymentIntentId}</span>
              </div>
            ) : null}

            <div className="rounded-lg border border-gray-200 p-3 text-sm text-gray-600 space-y-2">
              <div className="flex items-center justify-between">
                <span>Payment methods</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMode('card')}
                    className={`text-xs px-2 py-1 rounded-full border ${
                      paymentMode === 'card'
                        ? 'border-orange-500 text-orange-600'
                        : 'border-gray-200 text-gray-500'
                    }`}
                  >
                    Card only
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMode('automatic')}
                    className={`text-xs px-2 py-1 rounded-full border ${
                      paymentMode === 'automatic'
                        ? 'border-orange-500 text-orange-600'
                        : 'border-gray-200 text-gray-500'
                    }`}
                  >
                    Automatic
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Test card</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">4242 4242 4242 4242</span>
                  <CopyButton value="4242424242424242" label="Copy" />
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Exp: Any future date · CVC: Any 3 digits
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
