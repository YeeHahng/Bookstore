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
      throw new Error(`Failed to fetch books: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Raw API response:", data);
    
    // Handle different response formats
    if (data.body && typeof data.body === 'string') {
      // If the response has the full API Gateway format
      return JSON.parse(data.body);
    } else if (Array.isArray(data)) {
      // If the response is already an array
      return data;
    } else {
      // Unexpected format
      console.error("Unexpected data format:", data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
}

export async function getBookById(id: string): Promise<Book | null> {
  try {
    const response = await fetch(`${API_URL}/books/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch book: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Handle different response formats
    if (data.body && typeof data.body === 'string') {
      // If the response has the full API Gateway format
      return JSON.parse(data.body);
    } else {
      // If it's already the book object
      return data;
    }
  } catch (error) {
    console.error(`Error fetching book ${id}:`, error);
    return null;
  }
}