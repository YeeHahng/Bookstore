// lib/api.ts
// Define the Book interface
export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  imageUrl: string;
  category?: string;
}

// Replace this URL with your actual API Gateway URL from AWS
const API_URL = 'https://3mbrdg00ck.execute-api.us-east-1.amazonaws.com/prod';

// Common function to handle API requests with proper error handling
async function fetchFromAPI(endpoint: string, options = {}): Promise<any> {
  try {
    // Default request headers including the API key
    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ''
    };

    // Merge default options with provided options
    const requestOptions = {
      ...options,
      headers: {
        ...headers,
        ...(options as any).headers
      }
    };

    const response = await fetch(`${API_URL}${endpoint}`, requestOptions);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return data;
  } catch (error) {
    console.error(`Error in API request to ${endpoint}:`, error);
    throw error;
  }
}

// Function to sanitize and validate book data
function sanitizeBook(book: any): Book {
  return {
    id: book.id || '',
    title: book.title || 'Untitled Book',
    author: book.author || 'Unknown Author',
    description: book.description || 'No description available.',
    price: typeof book.price === 'number' ? book.price : 
           typeof book.price === 'string' ? parseFloat(book.price) || 0 : 0,
    imageUrl: book.imageUrl || '',
    category: book.category || 'Uncategorized'
  };
}

// Get all books
export async function getBooks(): Promise<Book[]> {
  try {
    let data = await fetchFromAPI('/books');
    
    // Handle different response formats
    if (data.body && typeof data.body === 'string') {
      try {
        data = JSON.parse(data.body);
      } catch (parseError) {
        const typedError = parseError as Error;
        console.error("Error parsing response body:", typedError);
        return [];
      }
    } else if (!Array.isArray(data)) {
      console.error("Unexpected data format:", data);
      return [];
    }
    
    // Sanitize each book
    return data.map(sanitizeBook);
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
}

// Get a book by ID
export async function getBookById(id: string): Promise<Book | null> {
  if (!id) {
    console.error('Invalid book ID provided');
    return null;
  }
  
  try {
    let data = await fetchFromAPI(`/books/${id}`);
    
    // Handle different response formats
    if (data.body && typeof data.body === 'string') {
      try {
        data = JSON.parse(data.body);
      } catch (parseError) {
        const typedError = parseError as Error;
        console.error("Error parsing response body:", typedError);
        return null;
      }
    }
    
    // Validate the book data
    if (!data || !data.id) {
      console.error('Invalid book data received:', data);
      return null;
    }
    
    // Return sanitized book
    return sanitizeBook(data);
  } catch (error) {
    console.error(`Error fetching book ${id}:`, error);
    return null;
  }
}

// Helper function for the fallback search (to avoid code duplication)
async function performFallbackSearch(query: string): Promise<Book[]> {
  console.log("Performing fallback search");
  try {
    const allBooks = await getBooks();
    return allBooks.filter(book => 
      book.title.toLowerCase().includes(query.toLowerCase()) || 
      book.author.toLowerCase().includes(query.toLowerCase()) ||
      (book.category && book.category.toLowerCase().includes(query.toLowerCase()))
    );
  } catch (error) {
    console.error("Error in fallback search:", error);
    return [];
  }
}

// Search for books
export async function searchBooks(query: string): Promise<Book[]> {
  if (!query || typeof query !== 'string') {
    return [];
  }
  
  try {
    const encodedQuery = encodeURIComponent(query);
    
    // Log the request for debugging
    console.log(`Searching for books with query: ${encodedQuery}`);
    
    try {
      const response = await fetch(`${API_URL}/books/search?q=${encodedQuery}`, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ''
        }
      });
      
      // Log the status
      console.log(`Search API response status: ${response.status}`);
      
      // Get the raw text before parsing as JSON
      const rawText = await response.text();
      
      // Log the exact raw response for debugging
      console.log(`Raw API response (first 100 chars): "${rawText.substring(0, 100)}..."`);
      console.log(`Raw response length: ${rawText.length}`);
      
      // Check if the response is empty or whitespace
      if (!rawText || rawText.trim() === '') {
        console.log("Empty response received, returning empty array");
        return [];
      }
      
      // Try multiple parsing strategies
      let data;
      let parseSuccess = false;
      
      // Strategy 1: Direct JSON parse
      try {
        data = JSON.parse(rawText);
        console.log("Strategy 1 (direct parse) succeeded");
        parseSuccess = true;
      } catch (error1) {
        console.log("Strategy 1 failed:", (error1 as Error).message);
        
        // Strategy 2: Try parsing with handling Lambda response format
        try {
          // Check if it starts with {"statusCode": ...
          if (rawText.trim().startsWith('{"statusCode":')) {
            const lambdaResponse = JSON.parse(rawText);
            console.log("Parsed Lambda response:", Object.keys(lambdaResponse));
            
            if (lambdaResponse.body && typeof lambdaResponse.body === 'string') {
              data = JSON.parse(lambdaResponse.body);
              console.log("Strategy 2 (Lambda response) succeeded");
              parseSuccess = true;
            }
          }
        } catch (error2) {
          console.log("Strategy 2 failed:", (error2 as Error).message);
          
          // Strategy 3: Try with bracket fixing (API Gateway sometimes adds brackets)
          try {
            if (rawText.trim().startsWith('[{') || rawText.trim().startsWith('{[')) {
              // Clean the string by removing potential extra brackets
              const cleaned = rawText.replace(/^\[+|\]+$/g, '');
              data = JSON.parse(`[${cleaned}]`);
              console.log("Strategy 3 (bracket fixing) succeeded");
              parseSuccess = true;
            }
          } catch (error3) {
            console.log("Strategy 3 failed:", (error3 as Error).message);
          }
        }
      }
      
      // If all strategies failed, use fallback
      if (!parseSuccess) {
        console.log("All parsing strategies failed, using fallback search");
        return await performFallbackSearch(query);
      }
      
      // If data is not an array at this point, try to handle special cases
      if (!Array.isArray(data)) {
        console.log("Parsed data is not an array:", typeof data);
        
        // If it's an object with key-value pairs that look like array indices
        if (typeof data === 'object' && data !== null) {
          const values = Object.values(data);
          if (values.length > 0) {
            console.log("Converting object to array");
            data = values;
          }
        } else {
          console.log("Cannot convert to array, using fallback");
          return await performFallbackSearch(query);
        }
      }
      
      console.log(`Successfully parsed ${data.length} books`);
      return data.map(sanitizeBook);
      
    } catch (fetchError) {
      console.error("Error fetching search results:", fetchError);
      return await performFallbackSearch(query);
    }
  } catch (generalError) {
    console.error("Unexpected error in searchBooks:", generalError);
    return [];
  }
}