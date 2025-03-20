// app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { searchBooks } from '@/lib/api';

export async function GET(request: NextRequest) {
  // Get the search query from URL
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  
  // Validate and sanitize input
  if (!query || typeof query !== 'string') {
    return NextResponse.json(
      { error: 'Invalid search query' },
      { status: 400 }
    );
  }
  
  // Sanitize the query - remove any potentially harmful characters
  const sanitizedQuery = query.trim().replace(/[^\w\s.'-]/g, '');
  
  try {
    // Call your Lambda function via the API
    const results = await searchBooks(sanitizedQuery);
    return NextResponse.json(results);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search books' },
      { status: 500 }
    );
  }
}