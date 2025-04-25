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
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    cardNumber?: string;
    month?: string;
    year?: string;
    cvv?: string;
    cardholderName?: string;
  }>({});
  
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
  
  // Handle month input (01-12 only)
  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    
    if (value === '') {
      setMonth('');
      return;
    }
    
    // Restrict to 2 digits
    const monthValue = value.substring(0, 2);
    
    // If user typed a value > 1, format it properly
    if (monthValue.length === 1 && parseInt(monthValue) > 1) {
      setMonth(`0${monthValue}`);
    } 
    // If first digit is 1, only allow 0-2 as second digit
    else if (monthValue.length === 2 && monthValue[0] === '1' && parseInt(monthValue[1]) > 2) {
      setMonth('12');
    } 
    // If first digit is 0, don't allow 0 as second digit
    else if (monthValue.length === 2 && monthValue[0] === '0' && monthValue[1] === '0') {
      setMonth('01');
    }
    else {
      setMonth(monthValue);
    }

    // Clear any error
    if (fieldErrors.month) {
      setFieldErrors(prev => ({ ...prev, month: undefined }));
    }
  };
  
  // Handle year input (2 digits only)
  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    
    // Restrict to 2 digits
    const yearValue = value.substring(0, 2);
    setYear(yearValue);
    
    // Clear any error
    if (fieldErrors.year) {
      setFieldErrors(prev => ({ ...prev, year: undefined }));
    }
  };
  
  // Handle CVV input (3 digits only)
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    
    // Restrict to 3 digits
    const cvvValue = value.substring(0, 3);
    setCvv(cvvValue);
    
    // Clear any error
    if (fieldErrors.cvv) {
      setFieldErrors(prev => ({ ...prev, cvv: undefined }));
    }
  };
  
  const validateForm = () => {
    const errors: {
      cardNumber?: string;
      month?: string;
      year?: string;
      cvv?: string;
      cardholderName?: string;
    } = {};
    
    // Validate card number (16 digits)
    if (cardNumber.replace(/\s+/g, '').length !== 16) {
      errors.cardNumber = 'Card number must be 16 digits';
    }
    
    // Validate month (01-12)
    if (!month) {
      errors.month = 'Required';
    } else if (!(parseInt(month) >= 1 && parseInt(month) <= 12)) {
      errors.month = 'Invalid month';
    }
    
    // Validate year (must be 2 digits)
    if (!year) {
      errors.year = 'Required';
    } else if (year.length !== 2) {
      errors.year = 'Must be 2 digits';
    }
    
    // Validate CVV (3 digits)
    if (!cvv) {
      errors.cvv = 'Required';
    } else if (cvv.length !== 3) {
      errors.cvv = 'Must be 3 digits';
    }
    
    // Validate cardholder name
    if (!cardholderName.trim()) {
      errors.cardholderName = 'Cardholder name is required';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset error state
    setError(null);
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsProcessing(true);
    
    // Format expiry date for submission
    const expiryDate = `${month}/${year}`;
    
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
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-black ${fieldErrors.cardNumber ? 'border-red-500' : ''}`}
            id="cardNumber"
            type="text"
            placeholder="1234 5678 9012 3456"
            value={cardNumber}
            onChange={(e) => {
              setCardNumber(formatCardNumber(e.target.value));
              if (fieldErrors.cardNumber) {
                setFieldErrors(prev => ({ ...prev, cardNumber: undefined }));
              }
            }}
            maxLength={19}
            required
            disabled={isProcessing}
          />
          {fieldErrors.cardNumber && (
            <p className="text-red-500 text-xs mt-1">{fieldErrors.cardNumber}</p>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-black text-sm font-bold mb-2" htmlFor="expiryDate">
              Expiry Date
            </label>
            <div className="flex space-x-2">
              <div className="w-1/2">
                <input
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-black ${fieldErrors.month ? 'border-red-500' : ''}`}
                  id="expiryMonth"
                  type="text"
                  placeholder="MM"
                  value={month}
                  onChange={handleMonthChange}
                  maxLength={2}
                  required
                  disabled={isProcessing}
                />
                {fieldErrors.month && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.month}</p>
                )}
              </div>
              <span className="self-center text-gray-500">/</span>
              <div className="w-1/2">
                <input
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-black ${fieldErrors.year ? 'border-red-500' : ''}`}
                  id="expiryYear"
                  type="text"
                  placeholder="YY"
                  value={year}
                  onChange={handleYearChange}
                  maxLength={2}
                  required
                  disabled={isProcessing}
                />
                {fieldErrors.year && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.year}</p>
                )}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-black text-sm font-bold mb-2" htmlFor="cvv">
              CVV
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-black ${fieldErrors.cvv ? 'border-red-500' : ''}`}
              id="cvv"
              type="text"
              placeholder="123"
              value={cvv}
              onChange={handleCvvChange}
              maxLength={3}
              required
              disabled={isProcessing}
            />
            {fieldErrors.cvv && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.cvv}</p>
            )}
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-black text-sm font-bold mb-2" htmlFor="cardholderName">
            Cardholder Name
          </label>
          <input
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-black ${fieldErrors.cardholderName ? 'border-red-500' : ''}`}
            id="cardholderName"
            type="text"
            placeholder="John Doe"
            value={cardholderName}
            onChange={(e) => {
              setCardholderName(e.target.value);
              if (fieldErrors.cardholderName) {
                setFieldErrors(prev => ({ ...prev, cardholderName: undefined }));
              }
            }}
            required
            disabled={isProcessing}
          />
          {fieldErrors.cardholderName && (
            <p className="text-red-500 text-xs mt-1">{fieldErrors.cardholderName}</p>
          )}
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