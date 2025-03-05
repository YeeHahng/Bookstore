// app/books/[id]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { getBookById, Book } from '@/lib/api';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Logout from '@/components/Logout';

export default function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBook() {
      if (id) {
        setLoading(true);
        const data = await getBookById(id as string);
        setBook(data);
        setLoading(false);
      }
    }

    loadBook();
  }, [id]);

  if (loading) {
    return <div>Loading book details...</div>;
  }

  if (!book) {
    return <div>Book not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-end mb-4">
        <Logout />
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <div className="relative h-80 w-full">
            <Image 
              src={book.imageUrl} 
              alt={book.title}
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>
        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold">{book.title}</h1>
          <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
          <p className="text-2xl font-bold mb-4">${book.price}</p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded">
            Add to Cart
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