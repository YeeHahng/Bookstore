'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/app/context/CartContext';
import { useRouter } from 'next/navigation';
import { createCheckoutSession } from '@/lib/stripe';
import { getCurrentUser } from 'aws-amplify/auth';
import { generateCSRFToken } from '@/utils/csrf';

export default function CheckoutPage() {
  const { items, cartTotal } = useCart();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [csrfToken, setCsrfToken] = useState<string>('');

  // Generate CSRF token on component mount
  useEffect(() => {
    setCsrfToken(generateCSRFToken());
  }, []);

  // Get current user's email
  useEffect(() => {
    async function fetchUserEmail() {
      try {
        const user = await getCurrentUser();
        if (user && user.signInDetails && user.signInDetails.loginId) {
          const email = user.signInDetails.loginId;
          setUserEmail(email);
          setFormData(prev => ({ 
            ...prev, 
            email: email || prev.email 
          }));
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    }
    
    fetchUserEmail();
  }, []);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Sanitize input - basic example, add more as needed
    const sanitizedValue = value.replace(/<[^>]*>?/gm, '');
    setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMessage(null);
    
    try {
      // Input validation
      if (!formData.email) {
        throw new Error('Email is required');
      }
      
      if (!formData.name || !formData.address || !formData.city || 
          !formData.state || !formData.zipCode) {
        throw new Error('All shipping information fields are required');
      }
      
      // Process payment with Stripe, including CSRF token
      const result = await createCheckoutSession(items, formData.email, csrfToken);
      
      if (!result.success) {
        throw new Error(result.error || 'Payment processing failed');
      }
      
      // Note: The redirect to Stripe's checkout page is handled in the createCheckoutSession function
    } catch (error: any) {
      console.error('Checkout error:', error);
      setErrorMessage(error.message || 'An error occurred during checkout');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return <div>Redirecting to cart...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Checkout</h1>
      </div>

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{errorMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 text-black">Order Summary</h2>
          {items.map((item) => (
            <div key={item.id} className="flex justify-between py-2 border-b">
              <div>
                <span className="font-medium text-black">{item.title}</span>
                <span className="text-black ml-2">× {item.quantity}</span>
              </div>
              <span className="text-black font-bold">
                ${typeof item.price === 'number' ? (item.price * item.quantity).toFixed(2) : '0.00'}
              </span>
            </div>
          ))}
          <div className="flex justify-between font-bold mt-4 text-lg">
            <span className="text-black">Total:</span>
            <span className="text-black">${cartTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 text-black">Shipping Information</h2>
          <form onSubmit={handleSubmit}>
            {/* Hidden CSRF token field */}
            <input type="hidden" name="csrfToken" value={csrfToken} />
            
            <div className="mb-4">
              <label className="block text-black text-sm font-bold mb-2" htmlFor="name">
                Full Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-black"
                id="name"
                name="name"
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isProcessing}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-black text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-black"
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isProcessing || !!userEmail}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-black text-sm font-bold mb-2" htmlFor="phone">
                Phone
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-black"
                id="phone"
                name="phone"
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                disabled={isProcessing}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-black text-sm font-bold mb-2" htmlFor="address">
                Address
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-black"
                id="address"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                required
                disabled={isProcessing}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-black text-sm font-bold mb-2" htmlFor="city">
                  City
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-black"
                  id="city"
                  name="city"
                  type="text"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  disabled={isProcessing}
                />
              </div>
              <div>
                <label className="block text-black text-sm font-bold mb-2" htmlFor="state">
                  State
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-black"
                  id="state"
                  name="state"
                  type="text"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  disabled={isProcessing}
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-black text-sm font-bold mb-2" htmlFor="zipCode">
                Zip Code
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-black"
                id="zipCode"
                name="zipCode"
                type="text"
                placeholder="Zip Code"
                value={formData.zipCode}
                onChange={handleChange}
                required
                disabled={isProcessing}
              />
            </div>
            
            <div className="mt-6">
              <button
                type="submit"
                className={`w-full py-2 rounded font-bold ${
                  isProcessing 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Proceed to Payment'}
              </button>
              <p className="text-gray-600 text-sm mt-2 text-center">
                Secure payment processing by Stripe
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}