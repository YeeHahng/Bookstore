// app/context/CartContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Book } from '@/lib/api';

// Extend the Book type to include quantity
export interface CartItem extends Book {
  quantity: number;
}

// Define the shape of the cart context
interface CartContextType {
  items: CartItem[];
  addToCart: (book: Book) => void;
  removeFromCart: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
}

// Create the context with undefined default
const CartContext = createContext<CartContextType | undefined>(undefined);

// Props type for the provider
interface CartProviderProps {
  children: ReactNode;
}

// Provider component
export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  
  // Load cart from localStorage on initialization
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('bookstore-cart');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          
          // Validate price field in each item
          const validatedCart = parsedCart.map((item: CartItem) => ({
            ...item,
            price: typeof item.price === 'number' ? item.price : 0
          }));
          
          setItems(validatedCart);
        } catch (e) {
          console.error('Failed to parse saved cart', e);
        }
      }
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bookstore-cart', JSON.stringify(items));
    }
  }, [items]);
  
  // Add a book to the cart
  const addToCart = (book: Book) => {
    // Ensure book has a valid price
    const safeBook = {
      ...book,
      price: typeof book.price === 'number' ? book.price : 0
    };
    
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === safeBook.id);
      
      if (existingItem) {
        // Increment quantity if already in cart
        return prevItems.map(item => 
          item.id === safeBook.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // Add new item with quantity 1
        return [...prevItems, { ...safeBook, quantity: 1 }];
      }
    });
  };
  
  // Remove a book from the cart
  const removeFromCart = (bookId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== bookId));
  };
  
  // Update quantity of a book in the cart
  const updateQuantity = (bookId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === bookId ? { ...item, quantity } : item
      )
    );
  };
  
  // Clear the entire cart
  const clearCart = () => {
    setItems([]);
  };
  
  // Calculate cart total with safety check
  const cartTotal = items.reduce(
    (total, item) => total + ((typeof item.price === 'number' ? item.price : 0) * item.quantity), 
    0
  );
  
  // Calculate total items count
  const itemCount = items.reduce(
    (count, item) => count + item.quantity, 
    0
  );
  
  return (
    <CartContext.Provider value={{ 
      items, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      cartTotal,
      itemCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to use the cart context - MAKE SURE THIS IS EXPORTED!
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}