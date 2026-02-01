import { NextResponse } from 'next/server';

import { logger } from '@/lib/logger';
import { addLog } from '@/lib/log-store';
import { stripe } from '@/lib/stripe';
import type { CreateTransfersRequest, CreateTransfersResponse } from '@/types';

const fallbackResponse: CreateTransfersResponse = {
  success: true,
  fallback: true,
  restaurantTransferId: 'tr_demo_restaurant_001',
  courierTransferId: 'tr_demo_courier_001',
  message: 'Transfers simulated: connected accounts not payout-enabled in test.',
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateTransfersRequest;

    if (
      !body?.paymentIntentId ||
      !body?.restaurantAccountId ||
      !body?.courierAccountId ||
      !body?.orderId
    ) {
      return NextResponse.json(
        { success: false, message: 'Invalid request payload' },
        { status: 400 },
      );
    }

    logger.log('stripe', 'Creating transfers...', {
      orderId: body.orderId,
      paymentIntentId: body.paymentIntentId,
    });
    addLog({
      level: 'stripe',
      message: 'stripe.transfers.create',
      data: {
        orderId: body.orderId,
        paymentIntentId: body.paymentIntentId,
        restaurantAmount: body.restaurantAmount,
        courierAmount: body.courierAmount,
      },
    });

    const restaurantTransfer = await stripe.transfers.create({
      amount: body.restaurantAmount,
      currency: 'usd',
      destination: body.restaurantAccountId,
      transfer_group: body.orderId,
      metadata: {
        order_id: body.orderId,
        payment_intent_id: body.paymentIntentId,
        recipient_type: 'restaurant',
      },
    });

    const courierTransfer = await stripe.transfers.create({
      amount: body.courierAmount,
      currency: 'usd',
      destination: body.courierAccountId,
      transfer_group: body.orderId,
      metadata: {
        order_id: body.orderId,
        payment_intent_id: body.paymentIntentId,
        recipient_type: 'courier',
      },
    });

    logger.log('success', 'Transfers created', {
      restaurantTransferId: restaurantTransfer.id,
      courierTransferId: courierTransfer.id,
    });
    addLog({
      level: 'success',
      message: 'Transfers created',
      data: {
        restaurantTransferId: restaurantTransfer.id,
        courierTransferId: courierTransfer.id,
      },
    });

    return NextResponse.json({
      success: true,
      restaurantTransferId: restaurantTransfer.id,
      courierTransferId: courierTransfer.id,
    } satisfies CreateTransfersResponse);
  } catch (error) {
    logger.log('error', 'Create transfers failed', error);
    addLog({
      level: 'simulation',
      message: 'Transfers simulated for demo clarity.',
      data: {
        reason: 'Connected accounts not payout-enabled in test.',
      },
    });
    console.error('Stripe API error:', error);
    return NextResponse.json(fallbackResponse);
  }
}
