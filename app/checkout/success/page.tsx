// app/checkout/success/page.tsx
'use client';

import React, { useEffect, useState, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';
import Link from 'next/link';

// Create a client component that uses searchParams
function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  const [orderStatus, setOrderStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const fetchExecuted = useRef(false);
  
  useEffect(() => {
    // If no order_id found, redirect to home
    if (!searchParams.get('order_id')) {
      router.push('/');
      return;
    }
    
    // Prevent multiple fetches
    if (fetchExecuted.current) return;
    
    async function fetchOrderDetails() {
      // Get the order ID from URL
      const orderId = searchParams.get('order_id');
      
      if (!orderId) {
        setOrderStatus('error');
        return;
      }
      
      try {
        // Fetch order details from our API
        const response = await fetch(`/api/orders/${orderId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }
        
        const data = await response.json();
        
        setOrderStatus('success');
        setOrderDetails(data);
        
        // Clear the cart as the order was successful
        clearCart();
        
        // Mark fetch as completed
        fetchExecuted.current = true;
      } catch (error) {
        console.error('Error fetching order details:', error);
        setOrderStatus('error');
        fetchExecuted.current = true;
      }
    }
    
    fetchOrderDetails();
  }, [searchParams, router, clearCart]);
  
  if (orderStatus === 'loading') {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h1 className="text-2xl font-bold mb-4 text-black">Processing Your Order</h1>
          <p className="text-gray-700 mb-4">Please wait while we confirm your order...</p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (orderStatus === 'error') {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h1 className="text-2xl font-bold mb-4 text-black">Order Verification Failed</h1>
          <p className="text-gray-700 mb-4">
            We could not verify your order. If you believe this is an error, please contact customer support.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/cart" className="bg-blue-600 text-white px-6 py-2 rounded">
              Return to Cart
            </Link>
            <Link href="/books" className="bg-gray-200 text-gray-800 px-6 py-2 rounded">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Success state
  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-green-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2 text-black">Order Confirmed!</h1>
          <p className="text-gray-700">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
        </div>
        
        <div className="border-t border-b py-4 my-4">
          <p className="text-gray-700 mb-2 text-center">
            We have sent a confirmation email with your order details.
          </p>
          {orderDetails && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold text-black">Order Details</h2>
              <p className="text-gray-700">Order ID: {orderDetails.orderId}</p>
              <p className="text-gray-700">Order Date: {new Date(orderDetails.orderDate).toLocaleDateString()}</p>
              {orderDetails.items && (
                <div className="mt-4">
                  <h3 className="text-md font-semibold text-black">Items</h3>
                  <ul className="list-disc pl-5 mt-2">
                    {orderDetails.items.map((item: any, index: number) => (
                      <li key={index} className="text-gray-700">
                        {item.title} x {item.quantity} - ${(item.price * item.quantity).toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <p className="text-gray-700 font-semibold mt-4">
                Total: ${orderDetails.orderTotal?.toFixed(2)}
              </p>
            </div>
          )}
        </div>
        
        <div className="flex justify-center gap-4 mt-6">
          <Link href="/" className="bg-gray-200 text-gray-800 px-6 py-2 rounded">
            Return Home
          </Link>
          <Link href="/books" className="bg-blue-600 text-white px-6 py-2 rounded">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

// Wrap the component with Suspense
export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h1 className="text-2xl font-bold mb-4 text-black">Loading...</h1>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}