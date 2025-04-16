// components/BookList.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { getBooks, Book } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/app/context/CartContext';
import RateLimitAlert from './RateLimitAlert';

export default function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState<boolean>(false);
  const [rateLimitResetTime, setRateLimitResetTime] = useState<Date | undefined>(undefined);
  const { addToCart } = useCart();
  const [addedBooks, setAddedBooks] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    async function loadBooks() {
      setLoading(true);
      setError(null);
      setRateLimited(false);
      
      try {
        const data = await getBooks();
        
        // Cache the books for potential future rate limiting
        localStorage.setItem('cached_books', JSON.stringify(data));
        
        // Validate price data for each book
        const validatedBooks = data.map((book: Book) => ({
          ...book,
          price: typeof book.price === 'number' ? book.price : 0
        }));
        
        setBooks(validatedBooks);
      } catch (error: any) {
        console.error('Error loading books:', error);
        
        // Handle rate limiting specifically
        if (error.message && error.message.includes('Rate limit exceeded')) {
          setRateLimited(true);
          
          // Extract the wait time from the error message if available
          const waitTimeMatch = error.message.match(/try again after (\d+) seconds/i);
          if (waitTimeMatch && waitTimeMatch[1]) {
            const waitSeconds = parseInt(waitTimeMatch[1], 10);
            const resetTime = new Date();
            resetTime.setSeconds(resetTime.getSeconds() + waitSeconds);
            setRateLimitResetTime(resetTime);
          } else {
            // Default to 1 minute if no specific time provided
            const resetTime = new Date();
            resetTime.setMinutes(resetTime.getMinutes() + 1);
            setRateLimitResetTime(resetTime);
          }
          
          // Try to load cached data if available
          const cachedData = localStorage.getItem('cached_books');
          if (cachedData) {
            try {
              const cachedBooks = JSON.parse(cachedData);
              if (Array.isArray(cachedBooks) && cachedBooks.length > 0) {
                setBooks(cachedBooks);
                setError('Showing cached data due to rate limiting.');
              }
            } catch (cacheError) {
              console.error('Error loading cached books:', cacheError);
            }
          }
        } 
        // Handle other errors
        else {
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

  const handleRateLimitClose = () => {
    setRateLimited(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <span className="ml-3">Loading books...</span>
      </div>
    );
  }

  return (
    <div>
      {rateLimited && (
        <RateLimitAlert 
          message="You've reached the API request limit for viewing books."
          resetTime={rateLimitResetTime}
          onClose={handleRateLimitClose}
        />
      )}
      
      {error && !rateLimited && (
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
      )}

      {/* Book grid display code */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {books.map((book) => (
          <div key={book.id} className="border rounded-md p-4 flex flex-col">
            {/* Book display code */}
            <div className="relative h-48 mb-2">
              <Image 
                src={book.imageUrl || '/placeholder-book.jpg'} 
                alt={book.title}
                fill
                style={{ objectFit: 'contain' }}
                onError={(e) => {
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
    </div>
  );
}