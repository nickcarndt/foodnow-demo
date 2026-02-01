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
    return NextResponse.json(
      { success: false, message: 'Unable to create Express Dashboard link' },
      { status: 500 },
    );
  }
}
