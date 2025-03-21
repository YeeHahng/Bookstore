// app/api/checkout/validate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with fixed API version type
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
});

export async function GET(request: NextRequest) {
  // Get the session ID from the URL
  const searchParams = request.nextUrl.searchParams;
  const sessionId = searchParams.get('session_id');
  
  if (!sessionId) {
    return NextResponse.json(
      { error: 'Missing session ID' },
      { status: 400 }
    );
  }

  try {
    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent', 'line_items'],
    });
    
    // Check if the payment was successful
    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { valid: false, error: 'Payment not completed' },
        { status: 400 }
      );
    }
    
    // Extract order details
    const orderDetails = {
      orderId: session.metadata?.order_id || `order_${Date.now()}`,
      customerEmail: session.customer_details?.email,
      amount: session.amount_total ? session.amount_total / 100 : 0, // Convert from cents
      items: session.line_items?.data.map(item => ({
        description: item.description,
        quantity: item.quantity,
        amount: item.amount_total ? item.amount_total / 100 : 0,
      })),
    };
    
    return NextResponse.json({
      valid: true,
      orderDetails,
    });
  } catch (error: any) {
    console.error('Error validating checkout session:', error);
    return NextResponse.json(
      { valid: false, error: error.message || 'Session validation failed' },
      { status: 500 }
    );
  }
}