
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  clearWishlist: () => void;
  isInWishlist: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  
  // Load wishlist from localStorage on initial render
  useEffect(() => {
    const storedWishlist = localStorage.getItem('comfycube_wishlist');
    if (storedWishlist) {
      setItems(JSON.parse(storedWishlist));
    }
  }, []);
  
  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('comfycube_wishlist', JSON.stringify(items));
  }, [items]);
  
  const addItem = (product: WishlistItem) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // Item already exists, so we don't need to add it again
        return prevItems;
      } else {
        // Add new item
        toast.success(`${product.name} added to wishlist`);
        return [...prevItems, product];
      }
    });
  };
  
  const removeItem = (id: string) => {
    setItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.id === id);
      if (itemToRemove) {
        toast.success(`${itemToRemove.name} removed from wishlist`);
      }
      return prevItems.filter(item => item.id !== id);
    });
  };
  
  const clearWishlist = () => {
    setItems([]);
    toast.success('Wishlist cleared');
  };
  
  const isInWishlist = (id: string) => {
    return items.some(item => item.id === id);
  };
  
  const value = {
    items,
    addItem,
    removeItem,
    clearWishlist,
    isInWishlist
  };
  
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

// Hook to use the wishlist context
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
