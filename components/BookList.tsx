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
  const { addToCart } = useCart();
  const [addedBooks, setAddedBooks] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    async function loadBooks() {
      setLoading(true);
      try {
        const data = await getBooks();
        
        // Validate price data for each book
        const validatedBooks = data.map((book: Book) => ({
          ...book,
          price: typeof book.price === 'number' ? book.price : 0
        }));
        
        setBooks(validatedBooks);
      } catch (error) {
        console.error('Error loading books:', error);
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
    return <div>Loading books...</div>;
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
            >
              {addedBooks[book.id] ? 'Added!' : 'Add to Cart'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}