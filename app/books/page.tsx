// app/books/page.tsx
import React from 'react';
import BookList from '@/components/BookList';

export default function BooksPage() {
  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">All Books</h1>
      </div>
      <BookList />
    </div>
  );
}