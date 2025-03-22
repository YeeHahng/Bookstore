// app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { validateCSRFToken } from '@/utils/csrf';
import { cookies } from 'next/headers';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
});

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { items, customerEmail, csrfToken } = body;
    
    // Validate CSRF token if provided
    if (csrfToken) {
      // Get cookies with await since it's a Promise
      const cookieStore = await cookies();
      const storedToken = cookieStore.get('csrfToken')?.value;
      
      if (!storedToken || !validateCSRFToken(csrfToken, storedToken)) {
        return NextResponse.json(
          { error: 'Invalid request token' },
          { status: 403 }
        );
      }
    }
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Invalid cart items' },
        { status: 400 }
      );
    }

    // Format line items for Stripe
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.title,
          description: item.author ? `By ${item.author}` : undefined,
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/cart`,
      customer_email: customerEmail,
      // Set metadata for order tracking
      metadata: {
        order_id: `order_${Date.now()}`,
      },
    });

    // Return the session ID to the client
    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Stripe API error:', error);
    return NextResponse.json(
      { error: 'Payment processing failed', details: error.message },
      { status: 500 }
    );
  }
}