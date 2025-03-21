// lib/stripe.ts
import { CartItem } from '@/app/context/CartContext';

/**
 * Initiates the checkout process with Stripe
 * @param items The items in the cart
 * @param email Customer email
 * @returns The Stripe checkout URL
 */
export async function createCheckoutSession(items: CartItem[], email: string) {
  try {
    // Call our API endpoint
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        items, 
        customerEmail: email 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Payment initialization failed');
    }

    const data = await response.json();
    
    // Redirect to Stripe Checkout
    if (data.url) {
      window.location.href = data.url;
      return { success: true };
    } else {
      throw new Error('No checkout URL received');
    }
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return { 
      success: false, 
      error: error.message || 'Payment processing failed' 
    };
  }
}

/**
 * Validates a Stripe session using the session ID
 * @param sessionId Stripe session ID
 * @returns Session validation result
 */
export async function validateCheckoutSession(sessionId: string) {
  try {
    const response = await fetch(`/api/checkout/validate?session_id=${sessionId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Session validation failed');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error validating session:', error);
    return { 
      valid: false, 
      error: error.message || 'Session validation failed' 
    };
  }
}