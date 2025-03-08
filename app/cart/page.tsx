// app/cart/page.tsx
'use client';

import React from 'react';
import { useCart } from '@/app/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import Logout from '@/components/Logout';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-end mb-4">
          <Logout />
        </div>
        <div className="text-center py-10">
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="mb-6">Looks like you haven't added any books to your cart yet.</p>
          <Link href="/books" className="bg-blue-600 text-white px-6 py-2 rounded">
            Browse Books
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Your Cart</h1>
        <Logout />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex items-center py-5 border-b">
            <div className="w-24 h-32 relative flex-shrink-0">
              <Image
                src={item.imageUrl || '/placeholder-book.jpg'}
                alt={item.title}
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
            <div className="ml-4 flex-1">
              <h2 className="text-lg font-bold text-black">
                <Link href={`/books/${item.id}`} className="hover:text-blue-600">
                  {item.title}
                </Link>
              </h2>
              <p className="text-gray-800">{item.author}</p>
              <p className="text-black font-bold mt-1">
                ${typeof item.price === 'number' ? item.price.toFixed(2) : '0.00'}
              </p>
            </div>
            <div className="flex items-center ml-auto">
              <div className="flex items-center border rounded">
                <button
                  className="px-3 py-1 border-r text-black font-bold"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  -
                </button>
                <span className="px-3 py-1 text-black font-bold">{item.quantity}</span>
                <button
                  className="px-3 py-1 border-l text-black font-bold"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </button>
              </div>
              <button
                className="ml-4 text-red-500"
                onClick={() => removeFromCart(item.id)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            </div>
          </div>
        ))}

        <div className="mt-6 border-t pt-6">
          <div className="flex justify-between text-xl font-bold">
            <span className="text-black">Total:</span>
            <span className="text-black">${cartTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mt-6">
            <button
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded font-bold"
              onClick={clearCart}
            >
              Clear Cart
            </button>
            <Link href="/checkout" className="bg-blue-600 text-white px-6 py-2 rounded font-bold">
              Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}