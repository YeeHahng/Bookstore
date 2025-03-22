'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { sanitizeSearchQuery } from '@/utils/sanitize';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Sanitize input to prevent XSS
    const sanitizedQuery = sanitizeSearchQuery(query);
    
    if (sanitizedQuery) {
      router.push(`/search?q=${encodeURIComponent(sanitizedQuery)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative mx-4 flex-1 max-w-xs">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search books..."
        className="w-full py-1 px-3 text-black rounded-md text-sm"
        aria-label="Search books"
        maxLength={100} // Add client-side length limit
        pattern="[A-Za-z0-9\s.\'-]+" // Restrict input pattern
        title="Search terms may only contain letters, numbers, spaces, and basic punctuation"
      />
      <button 
        type="submit"
        className="absolute right-1 top-1/2 -translate-y-1/2 p-1"
        aria-label="Submit search"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-600">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </button>
    </form>
  );
}