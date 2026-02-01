import { NextResponse } from 'next/server';

import { logger } from '@/lib/logger';
import { addLog } from '@/lib/log-store';
import { stripe } from '@/lib/stripe';
import { demoOrderBreakdown, demoOrderId } from '@/lib/demo-data';
import type { CreatePaymentRequest, CreatePaymentResponse } from '@/types';

const fallbackResponse: CreatePaymentResponse = {
  success: true,
  fallback: true,
  clientSecret: 'demo_client_secret',
  paymentIntentId: 'pi_demo_fallback_001',
  breakdown: demoOrderBreakdown,
  message: 'Demo fallback activated',
};

// Demo uses fixed amounts for clarity - no dynamic calculations
// Customer: $30 | Restaurant: $20 | Courier: $5 | Platform: $5
const DEMO_AMOUNT = 3000; // $30.00 fixed demo order

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreatePaymentRequest;

    // Demo uses fixed amount for clarity - ignore any passed amount
    const amount = DEMO_AMOUNT;
    const paymentMethodMode = body?.paymentMethodMode || 'card';

    logger.log('stripe', 'Creating PaymentIntent...', { amount });
    addLog({
      level: 'stripe',
      message: 'stripe.paymentIntents.create',
      data: {
        amount,
        currency: 'usd',
        paymentMethodMode,
      },
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      ...(paymentMethodMode === 'automatic'
        ? { automatic_payment_methods: { enabled: true } }
        : { payment_method_types: ['card'] }),
      metadata: {
        order_id: demoOrderId,
        demo: 'true',
      },
    });

    logger.log('success', 'PaymentIntent created', { id: paymentIntent.id });
    addLog({
      level: 'success',
      message: 'PaymentIntent created',
      data: { paymentIntentId: paymentIntent.id, status: paymentIntent.status },
    });

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret as string,
      paymentIntentId: paymentIntent.id,
      breakdown: demoOrderBreakdown, // Fixed demo amounts for clarity
    } satisfies CreatePaymentResponse);
  } catch (error) {
    logger.log('error', 'Create payment failed', error);
    addLog({
      level: 'error',
      message: 'PaymentIntent creation failed',
    });
    console.error('Stripe API error:', error);
    return NextResponse.json(fallbackResponse);
  }
}
