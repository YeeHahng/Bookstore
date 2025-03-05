// components/books/BookList.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { getBooks, Book } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';

export default function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBooks() {
      setLoading(true);
      const data = await getBooks();
      setBooks(data);
      setLoading(false);
    }

    loadBooks();
  }, []);

  if (loading) {
    return <div>Loading books...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {books.map((book) => (
        <div key={book.id} className="border rounded-md p-4">
          <div className="relative h-48 mb-2">
            <Image 
              src={book.imageUrl} 
              alt={book.title}
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
          <h2 className="text-lg font-bold">{book.title}</h2>
          <p className="text-gray-600">{book.author}</p>
          <p className="font-bold mt-2">${book.price}</p>
          <Link 
            href={`/books/${book.id}`} 
            className="block mt-2 text-blue-600 hover:underline"
          >
            View details
          </Link>
        </div>
      ))}
    </div>
  );
}