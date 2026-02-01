import { NextResponse } from 'next/server';

import { logger } from '@/lib/logger';
import { addLog } from '@/lib/log-store';
import { stripe } from '@/lib/stripe';
import type { CreateConnectAccountRequest, CreateConnectAccountResponse } from '@/types';

const fallbackResponse: CreateConnectAccountResponse = {
  success: true,
  fallback: true,
  accountId: 'acct_demo_fallback_001',
  onboardingUrl: 'https://dashboard.stripe.com/test/connect/accounts',
  message: 'Demo fallback activated',
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateConnectAccountRequest;

    if (!body?.accountType || !body?.email || !body?.businessName) {
      return NextResponse.json(
        { success: false, message: 'Invalid request payload' },
        { status: 400 },
      );
    }

    logger.log('stripe', 'Creating Express account...', {
      accountType: body.accountType,
      email: body.email,
    });
    addLog({
      level: 'stripe',
      message: 'Creating Express account',
      data: { accountType: body.accountType, email: body.email },
    });

    const account = await stripe.accounts.create({
      type: 'express',
      country: 'US',
      email: body.email,
      business_type: body.accountType === 'restaurant' ? 'company' : 'individual',
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      metadata: {
        foodnow_type: body.accountType,
        demo: 'true',
        business_name: body.businessName,
      },
    });

    // Derive base URL from request headers (works on Vercel and localhost)
    // Priority: forwarded headers (Vercel) > host header > env var fallback
    const forwardedProto = request.headers.get('x-forwarded-proto') || 'https';
    const forwardedHost = request.headers.get('x-forwarded-host');
    const host = request.headers.get('host');
    const baseUrl = forwardedHost
      ? `${forwardedProto}://${forwardedHost}`
      : host
        ? `${host.includes('localhost') ? 'http' : 'https'}://${host}`
        : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${baseUrl}/onboarding?refresh=true`,
      return_url: `${baseUrl}/onboarding/return?account_id=${account.id}`,
      type: 'account_onboarding',
    });
    addLog({
      level: 'stripe',
      message: 'Created account link',
      data: {
        accountId: account.id,
        refreshUrl: `${baseUrl}/onboarding?refresh=true`,
        returnUrl: `${baseUrl}/onboarding/return?account_id=${account.id}`,
      },
    });

    logger.log('success', 'Account created', { accountId: account.id });
    addLog({
      level: 'success',
      message: 'Express account created',
      data: { accountId: account.id },
    });

    return NextResponse.json({
      success: true,
      accountId: account.id,
      onboardingUrl: accountLink.url,
    } satisfies CreateConnectAccountResponse);
  } catch (error) {
    logger.log('error', 'Create connect account failed', error);
    addLog({
      level: 'error',
      message: 'Express account creation failed',
    });
    console.error('Stripe API error:', error);
    return NextResponse.json(fallbackResponse);
  }
}
