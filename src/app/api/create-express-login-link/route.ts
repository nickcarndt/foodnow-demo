import { NextResponse } from 'next/server';

import { stripe } from '@/lib/stripe';

interface CreateExpressLoginLinkRequest {
  accountId?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateExpressLoginLinkRequest;

    if (!body?.accountId) {
      return NextResponse.json(
        { success: false, message: 'Account ID is required' },
        { status: 400 },
      );
    }

    const loginLink = await stripe.accounts.createLoginLink(body.accountId);

    return NextResponse.json({
      success: true,
      url: loginLink.url,
    });
  } catch (error) {
    console.error('Create Express login link failed:', error);
    
    // Check if this is because the account isn't fully onboarded (details not submitted)
    const stripeError = error as { type?: string; message?: string; code?: string };
    const isNotOnboarded = 
      stripeError.message?.includes('not yet fully onboarded') ||
      stripeError.message?.includes('login_link') ||
      stripeError.code === 'account_invalid';
    
    if (isNotOnboarded) {
      return NextResponse.json(
        { 
          success: false, 
          message: "This account hasn't finished onboarding yet (details not submitted). Complete Express onboarding to access the Express Dashboard."
        },
        { status: 409 },
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Unable to create Express Dashboard link' },
      { status: 500 },
    );
  }
}
