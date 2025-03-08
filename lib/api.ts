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

export async function getBooks(): Promise<Book[]> {
  try {
    console.log("Fetching books from:", `${API_URL}/books`);
    const response = await fetch(`${API_URL}/books`);
    
    if (!response.ok) {
      console.error(`Failed to fetch books: ${response.status} ${response.statusText}`);
      return [];
    }
    
    const data = await response.json();
    console.log("Raw API response:", data);
    
    let books: Book[];
    
    // Handle different response formats
    if (data.body && typeof data.body === 'string') {
      // If the response has the full API Gateway format
      try {
        books = JSON.parse(data.body);
      } catch (parseError) {
        console.error("Error parsing response body:", parseError);
        return [];
      }
    } else if (Array.isArray(data)) {
      // If the response is already an array
      books = data;
    } else {
      // Unexpected format
      console.error("Unexpected data format:", data);
      return [];
    }
    
    // Validate and sanitize each book
    return books.map(book => ({
      id: book.id || '',
      title: book.title || 'Untitled Book',
      author: book.author || 'Unknown Author',
      description: book.description || 'No description available.',
      price: typeof book.price === 'number' ? book.price : 0,
      imageUrl: book.imageUrl || '',
      category: book.category || 'Uncategorized'
    }));
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
}

export async function getBookById(id: string): Promise<Book | null> {
  try {
    console.log(`Fetching book with ID: ${id}`);
    const response = await fetch(`${API_URL}/books/${id}`);
    
    if (!response.ok) {
      console.error(`Failed to fetch book: ${response.status} ${response.statusText}`);
      return null;
    }
    
    const data = await response.json();
    console.log(`Raw API response for book ${id}:`, data);
    
    // Handle different response formats
    let book: Book;
    
    if (data.body && typeof data.body === 'string') {
      // If the response has the full API Gateway format
      try {
        book = JSON.parse(data.body);
      } catch (parseError) {
        console.error("Error parsing response body:", parseError);
        return null;
      }
    } else {
      // If it's already the book object
      book = data;
    }
    
    // Validate the book data
    if (!book || !book.id) {
      console.error('Invalid book data received:', book);
      return null;
    }
    
    // Sanitize book data to prevent frontend errors
    return {
      id: book.id,
      title: book.title || 'Untitled Book',
      author: book.author || 'Unknown Author',
      description: book.description || 'No description available.',
      price: typeof book.price === 'number' ? book.price : 0,
      imageUrl: book.imageUrl || '',
      category: book.category || 'Uncategorized'
    };
  } catch (error) {
    console.error(`Error fetching book ${id}:`, error);
    return null;
  }
}