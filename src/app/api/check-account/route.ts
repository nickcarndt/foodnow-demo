import { NextResponse } from 'next/server';

import { logger } from '@/lib/logger';
import { addLog } from '@/lib/log-store';
import { stripe } from '@/lib/stripe';
import type { CheckAccountRequest, CheckAccountResponse } from '@/types';

const fallbackResponse: CheckAccountResponse = {
  success: true,
  fallback: true,
  accountId: 'acct_demo_fallback_001',
  payoutsEnabled: true,
  chargesEnabled: true,
  detailsSubmitted: true,
  message: 'Demo fallback activated',
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckAccountRequest;

    if (!body?.accountId) {
      return NextResponse.json(
        { success: false, message: 'Invalid request payload' },
        { status: 400 },
      );
    }

    logger.log('stripe', 'Checking account status...', { accountId: body.accountId });
    addLog({
      level: 'stripe',
      message: 'Checking account status',
      data: { accountId: body.accountId },
    });

    const account = await stripe.accounts.retrieve(body.accountId);

    logger.log('success', 'Account status retrieved', { accountId: account.id });
    addLog({
      level: 'success',
      message: 'Account status retrieved',
      data: { accountId: account.id },
    });

    return NextResponse.json({
      success: true,
      accountId: account.id,
      payoutsEnabled: account.payouts_enabled,
      chargesEnabled: account.charges_enabled,
      detailsSubmitted: account.details_submitted,
    } satisfies CheckAccountResponse);
  } catch (error) {
    logger.log('error', 'Check account failed', error);
    addLog({
      level: 'error',
      message: 'Account status check failed',
    });
    console.error('Stripe API error:', error);
    return NextResponse.json(fallbackResponse);
  }
}
