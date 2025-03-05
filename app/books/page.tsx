// app/books/page.tsx
import React from 'react';
import BookList from '@/components/BookList';
import Logout from '@/components/Logout';

export default function BooksPage() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Books</h1>
        <Logout />
      </div>
      <BookList />
    </div>
  );
}