// app/books/[id]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { getBookById, Book } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/app/context/CartContext';
import Link from 'next/link';

export default function BookDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<boolean>(false);
  const { addToCart } = useCart();
  const [addedToCart, setAddedToCart] = useState<boolean>(false);

  useEffect(() => {
    async function loadBook() {
      if (id) {
        setLoading(true);
        setError(null);
        try {
          console.log(`Fetching book with ID: ${id}`);
          const data = await getBookById(id as string);
          
          if (!data) {
            console.error(`No data returned for book ID: ${id}`);
            setError(`Book with ID "${id}" not found.`);
            setBook(null);
            return;
          }
          
          console.log(`Book data received:`, data);
          setBook(data);
        } catch (error) {
          console.error('Error loading book:', error);
          setError('Failed to load book. Please try again later.');
        } finally {
          setLoading(false);
        }
      }
    }

    loadBook();
  }, [id]);

  const handleAddToCart = () => {
    if (book) {
      addToCart(book);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="py-10">Loading book details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
          <div className="text-red-700 mb-2">{error}</div>
          <p>The book you're looking for might not exist or there was a problem loading it.</p>
        </div>
        <Link href="/books" className="text-blue-600 hover:underline">
          ← Back to all books
        </Link>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-4">
          <div className="text-yellow-700 mb-2">Book not found</div>
          <p>The requested book could not be found in our library.</p>
        </div>
        <Link href="/books" className="text-blue-600 hover:underline">
          ← Browse available books
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <div className="relative h-80 w-full border border-gray-200 bg-gray-100">
            {imageError ? (
              <div className="h-full w-full flex items-center justify-center">
                <span className="text-gray-500">No image available</span>
              </div>
            ) : (
              <Image 
                src={book.imageUrl} 
                alt={`Cover of ${book.title}`}
                fill
                style={{ objectFit: 'contain' }}
                onError={() => setImageError(true)}
                priority
              />
            )}
          </div>
        </div>
        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold">{book.title}</h1>
          <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
          <p className="text-2xl font-bold mb-4">${book.price.toFixed(2)}</p>
          <button 
            className={`px-6 py-2 rounded ${addedToCart ? 'bg-green-600' : 'bg-blue-600'} text-white`}
            onClick={handleAddToCart}
          >
            {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
          </button>
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p>{book.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}