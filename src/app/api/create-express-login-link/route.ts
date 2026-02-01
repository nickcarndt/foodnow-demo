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
    
    // Check if this is because the account isn't fully onboarded
    const stripeError = error as { type?: string; message?: string };
    const isNotOnboarded = stripeError.message?.includes('not yet fully onboarded') ||
                           stripeError.message?.includes('login_link');
    
    return NextResponse.json(
      { 
        success: false, 
        message: isNotOnboarded 
          ? 'Account must complete onboarding before accessing Express Dashboard'
          : 'Unable to create Express Dashboard link'
      },
      { status: 500 },
    );
  }
}
