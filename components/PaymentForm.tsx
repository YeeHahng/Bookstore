// components/PaymentForm.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CartItem } from '@/app/context/CartContext';

interface PaymentFormProps {
  totalAmount: number;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  items: CartItem[];
  csrfToken: string;
}

export default function PaymentForm({
  totalAmount,
  customerInfo,
  items,
  csrfToken
}: PaymentFormProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  
  // Format card number with spaces for readability
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  // Format expiry date as MM/YY
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return v;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);
    
    // Basic client-side validation
    if (cardNumber.replace(/\s+/g, '').length < 16) {
      setError('Please enter a valid card number');
      setIsProcessing(false);
      return;
    }
    
    if (expiryDate.length < 5) {
      setError('Please enter a valid expiry date');
      setIsProcessing(false);
      return;
    }
    
    if (cvv.length < 3) {
      setError('Please enter a valid CVV');
      setIsProcessing(false);
      return;
    }
    
    if (cardholderName.trim().length < 3) {
      setError('Please enter the cardholder name');
      setIsProcessing(false);
      return;
    }
    
    try {
      console.log('Submitting payment with CSRF token:', csrfToken);
      console.log('Current cookies before submission:', document.cookie);
      
      // Call your payment processing API
      const response = await fetch('/api/process-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentDetails: {
            cardNumber: cardNumber.replace(/\s+/g, ''),
            expiryDate,
            cvv,
            cardholderName
          },
          orderDetails: {
            totalAmount,
            items: items.map(item => ({
              id: item.id,
              title: item.title,
              price: item.price,
              quantity: item.quantity
            }))
          },
          customerInfo,
          csrfToken
        }),
        credentials: 'include' // Important! This ensures cookies are sent with the request
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Payment failed');
      }
      
      // Redirect to success page with order ID
      router.push(`/checkout/success?order_id=${result.orderId}`);
    } catch (error: any) {
      setError(error.message || 'Payment processing failed');
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h2 className="text-xl font-bold mb-4 text-black">Payment Information</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Hidden CSRF token */}
        <input type="hidden" name="csrfToken" value={csrfToken} />
        
        <div className="mb-4">
          <label className="block text-black text-sm font-bold mb-2" htmlFor="cardNumber">
            Card Number
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-black"
            id="cardNumber"
            type="text"
            placeholder="1234 5678 9012 3456"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            maxLength={19}
            required
            disabled={isProcessing}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-black text-sm font-bold mb-2" htmlFor="expiryDate">
              Expiry Date
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-black"
              id="expiryDate"
              type="text"
              placeholder="MM/YY"
              value={expiryDate}
              onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
              maxLength={5}
              required
              disabled={isProcessing}
            />
          </div>
          <div>
            <label className="block text-black text-sm font-bold mb-2" htmlFor="cvv">
              CVV
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-black"
              id="cvv"
              type="text"
              placeholder="123"
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
              maxLength={4}
              required
              disabled={isProcessing}
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-black text-sm font-bold mb-2" htmlFor="cardholderName">
            Cardholder Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-black"
            id="cardholderName"
            type="text"
            placeholder="John Doe"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
            required
            disabled={isProcessing}
          />
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <p className="text-gray-600 text-sm">
            Total: ${totalAmount.toFixed(2)}
          </p>
          <button
            className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            type="submit"
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Complete Payment'}
          </button>
        </div>
      </form>
    </div>
  );
}