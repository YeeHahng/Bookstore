'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Book } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/app/context/CartContext';
import { searchBooks } from '@/lib/api';

// Loading component
function SearchLoading() {
  return (
    <div className="container mx-auto p-4">
      <div className="text-center py-8">Searching books...</div>
    </div>
  );
}

// SearchContent component that uses searchParams
function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const [addedBooks, setAddedBooks] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    async function fetchSearchResults() {
      if (!query) {
        setBooks([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Sanitize the query before sending to the API
        const sanitizedQuery = query.trim().replace(/[^\w\s.'-]/g, '');
        
        if (!sanitizedQuery) {
          setError('Invalid search query. Please use alphanumeric characters, spaces, or basic punctuation.');
          setLoading(false);
          return;
        }
        
        // Call the search function
        const results = await searchBooks(sanitizedQuery);
        setBooks(results);
      } catch (err) {
        console.error('Error searching books:', err);
        setError('Failed to search books. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchSearchResults();
  }, [query]);

  const handleAddToCart = (book: Book) => {
    addToCart(book);
    
    // Show "Added" message temporarily
    setAddedBooks({...addedBooks, [book.id]: true});
    setTimeout(() => {
      setAddedBooks({...addedBooks, [book.id]: false});
    }, 2000);
  };

  if (loading) {
    return <SearchLoading />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">
        {query ? `Search Results for "${query}"` : 'Search Books'}
      </h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-6">
          {error}
        </div>
      )}

      {!loading && !error && books.length === 0 && (
        <div className="text-center py-8">
          <p className="mb-4">No books found matching your search.</p>
          <Link href="/books" className="text-blue-600 hover:underline">
            Browse all books
          </Link>
        </div>
      )}

      {books.length > 0 && (
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
              {book.category && <p className="text-gray-500 text-sm">Category: {book.category}</p>}
              <p className="font-bold mt-2">
                ${typeof book.price === 'number' 
                    ? book.price.toFixed(2) 
                    : typeof book.price === 'string' 
                        ? parseFloat(book.price).toFixed(2) 
                        : '0.00'}
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
      )}
    </div>
  );
}

// Main page component with Suspense
export default function SearchPage() {
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchContent />
    </Suspense>
  );
}