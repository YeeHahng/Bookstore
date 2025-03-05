// app/page.tsx - updated to include book listings but keep authentication
import React from 'react';
import Image from "next/image";
import Logout from "@/components/Logout";
import Link from "next/link";
import BookList from '@/components/BookList';

export default function Home() {
  return (
    <div>
      <div className="flex justify-between items-center p-4">
        <h1 className="text-3xl font-bold">Bookstore</h1>
        <Logout />
      </div>
      
      <main className="container mx-auto p-4">
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Welcome to our Bookstore</h2>
          <p className="mb-6">Browse our collection of books and find your next great read.</p>
          <Link href="/books" className="bg-blue-600 text-white px-4 py-2 rounded">
            View All Books
          </Link>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-4">Featured Books</h2>
          <BookList />
        </section>
      </main>
    </div>
  );
}
