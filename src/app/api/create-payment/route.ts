import { NextResponse } from 'next/server';

import { logger } from '@/lib/logger';
import { addLog } from '@/lib/log-store';
import { stripe } from '@/lib/stripe';
import { demoOrderBreakdown, demoOrderId } from '@/lib/demo-data';
import type { CreatePaymentRequest, CreatePaymentResponse, OrderBreakdown } from '@/types';

const fallbackResponse: CreatePaymentResponse = {
  success: true,
  fallback: true,
  clientSecret: 'demo_client_secret',
  paymentIntentId: 'pi_demo_fallback_001',
  breakdown: demoOrderBreakdown,
  message: 'Demo fallback activated',
};

const calculateBreakdown = (amount: number): OrderBreakdown => {
  const platformFee = Math.round(amount * 0.15);
  const courierAmount = 250;
  const restaurantAmount = amount - platformFee - courierAmount;

  return {
    total: amount,
    platformFee,
    restaurantAmount,
    courierAmount,
  };
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreatePaymentRequest;

    if (!body?.amount || body.amount <= 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid request payload' },
        { status: 400 },
      );
    }

    const breakdown = calculateBreakdown(body.amount);
    const paymentMethodMode = body.paymentMethodMode || 'card';

    logger.log('stripe', 'Creating PaymentIntent...', { amount: body.amount });
    addLog({
      level: 'stripe',
      message: 'stripe.paymentIntents.create',
      data: {
        amount: body.amount,
        currency: 'usd',
        paymentMethodMode,
      },
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: body.amount,
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
      breakdown,
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
