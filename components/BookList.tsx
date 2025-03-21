// components/BookList.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { getBooks, Book } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/app/context/CartContext';

export default function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const [addedBooks, setAddedBooks] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    async function loadBooks() {
      setLoading(true);
      setError(null);
      
      try {
        const data = await getBooks();
        
        if (Array.isArray(data) && data.length === 0) {
          setError('No books found. The bookstore might be empty or there was an issue retrieving the books.');
        } else {
          // Validate price data for each book
          const validatedBooks = data.map((book: Book) => ({
            ...book,
            price: typeof book.price === 'number' ? book.price : 0
          }));
          
          setBooks(validatedBooks);
        }
      } catch (error: any) {
        console.error('Error loading books:', error);
        
        // Check for specific error types and provide user-friendly messages
        if (error.message && error.message.includes('403')) {
          setError('Authorization error. The API key might be invalid or missing.');
        } else if (error.message && error.message.includes('429')) {
          setError('Too many requests. Please try again later.');
        } else if (!navigator.onLine) {
          setError('Network error. Please check your internet connection and try again.');
        } else {
          setError('Failed to load books. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    }

    loadBooks();
  }, []);

  const handleAddToCart = (book: Book) => {
    addToCart(book);
    
    // Show "Added" message temporarily
    setAddedBooks({...addedBooks, [book.id]: true});
    setTimeout(() => {
      setAddedBooks({...addedBooks, [book.id]: false});
    }, 2000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <span className="ml-3">Loading books...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-6">
        <h2 className="font-bold text-lg mb-2">Error</h2>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="mb-4">No books available at this time.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {books.map((book) => (
        <div key={book.id} className="border rounded-md p-4 flex flex-col">
          <div className="relative h-48 mb-2">
            <Image 
              src={book.imageUrl || '/placeholder-book.jpg'} 
              alt={book.title}
              fill
              style={{ objectFit: 'contain' }}
              onError={(e) => {
                // Fallback for image loading errors
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-book.jpg';
              }}
            />
          </div>
          <h2 className="text-lg font-bold">{book.title}</h2>
          <p className="text-gray-600">{book.author}</p>
          <p className="font-bold mt-2">
            ${typeof book.price === 'number' ? book.price.toFixed(2) : '0.00'}
          </p>
          <div className="mt-auto pt-4 flex justify-between items-center">
            <Link 
              href={`/books/${book.id}`} 
              className="text-blue-600 hover:underline"
            >
              View details
            </Link>
            <button
              onClick={() => handleAddToCart(book)}
              className={`px-3 py-1 rounded text-white ${addedBooks[book.id] ? 'bg-green-600' : 'bg-blue-600'}`}
              aria-label={addedBooks[book.id] ? 'Added to cart' : 'Add to cart'}
            >
              {addedBooks[book.id] ? 'Added!' : 'Add to Cart'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}