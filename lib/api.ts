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
        console.error("Error parsing response body:", parseError);
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
        console.error("Error parsing response body:", parseError);
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

// Search for books
export async function searchBooks(query: string): Promise<Book[]> {
  if (!query || typeof query !== 'string') {
    console.error('Invalid search query:', query);
    return [];
  }
  
  try {
    // Encode the query parameter to make it URL-safe
    const encodedQuery = encodeURIComponent(query);
    
    // Call the search endpoint of your API
    let data = await fetchFromAPI(`/books/search?q=${encodedQuery}`);
    
    // Handle wrapped response format (the Lambda response structure)
    if (data.body && typeof data.body === 'string') {
      try {
        // Parse the stringified JSON in the body
        const parsed = JSON.parse(data.body);
        data = parsed;
      } catch (parseError) {
        console.error("Error parsing search response body:", parseError);
        return [];
      }
    } else if (!Array.isArray(data)) {
      console.error("Unexpected data format from search:", data);
      return [];
    }
    
    // Validate and sanitize the results
    if (!Array.isArray(data)) {
      console.error("Data is not an array after parsing:", data);
      return [];
    }
    
    // Process and return the books
    return data.map(sanitizeBook);
  } catch (error) {
    console.error('Error searching books:', error);
    return [];
  }
}