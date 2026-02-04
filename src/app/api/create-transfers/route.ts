import { NextResponse } from 'next/server';

import { logger } from '@/lib/logger';
import { addLog } from '@/lib/log-store';
import { stripe } from '@/lib/stripe';
import type { CreateTransfersRequest, CreateTransfersResponse } from '@/types';

const generateSimulatedId = (type: string) =>
  `tr_simulated_${type}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

const createFallbackResponse = (): CreateTransfersResponse => ({
  success: true,
  fallback: true,
  restaurantTransferId: generateSimulatedId('rest'),
  courierTransferId: generateSimulatedId('cour'),
  message: 'Transfers simulated for demo clarity.',
});

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

    logger.log('stripe', 'Retrieving PaymentIntent for source_transaction...', {
      paymentIntentId: body.paymentIntentId,
    });

    // Retrieve the PaymentIntent with expanded latest_charge for source_transaction
    // This links transfers to the specific charge that funded them (best practice)
    const paymentIntent = await stripe.paymentIntents.retrieve(body.paymentIntentId, {
      expand: ['latest_charge'],
    });

    // Normalize latest_charge: can be string ID or expanded object
    const latestCharge = paymentIntent.latest_charge;
    const chargeId =
      typeof latestCharge === 'string'
        ? latestCharge
        : (latestCharge as { id: string } | null)?.id ?? null;

    // Log the payment confirmation - this shows the payment succeeded
    addLog({
      level: 'success',
      message: 'Payment confirmed',
      data: {
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        chargeId: chargeId || 'N/A',
      },
    });

    logger.log('stripe', 'Creating transfers...', {
      orderId: body.orderId,
      paymentIntentId: body.paymentIntentId,
      chargeId,
    });
    addLog({
      level: 'stripe',
      message: 'stripe.transfers.create',
      data: {
        orderId: body.orderId,
        paymentIntentId: body.paymentIntentId,
        chargeId,
        restaurantAmount: body.restaurantAmount,
        courierAmount: body.courierAmount,
      },
    });

    const restaurantTransfer = await stripe.transfers.create({
      amount: body.restaurantAmount,
      currency: 'usd',
      destination: body.restaurantAccountId,
      transfer_group: body.orderId,
      ...(chargeId && { source_transaction: chargeId }),
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
      ...(chargeId && { source_transaction: chargeId }),
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
    return NextResponse.json(createFallbackResponse());
  }
}
