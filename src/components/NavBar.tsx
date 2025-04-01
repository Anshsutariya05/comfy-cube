
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Menu, X, User, Search, Cog } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user, signOut } = useAuth();
  const { itemCount } = useCart();
  
  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (!error && data && data.role === 'admin') {
        setIsAdmin(true);
      }
    };
    
    checkAdmin();
  }, [user]);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary transition-transform duration-300 hover:scale-105">
            ComfyCube
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/products" className="text-gray-600 hover:text-primary transition-colors duration-300 hover:scale-105">
              Products
            </Link>
            <Link to="/categories" className="text-gray-600 hover:text-primary transition-colors duration-300 hover:scale-105">
              Categories
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-primary transition-colors duration-300 hover:scale-105">
              About
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-primary transition-colors duration-300 hover:scale-105">
              Contact
            </Link>
            {isAdmin && (
              <Link to="/admin" className="text-gray-600 hover:text-primary transition-colors duration-300 hover:scale-105">
                Admin
              </Link>
            )}
          </div>
          
          {/* Desktop Action Icons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon" asChild className="transition-transform duration-200 hover:scale-110">
              <Link to="/search">
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Link>
            </Button>
            
            {user ? (
              <>
                <Button variant="ghost" size="icon" asChild className="transition-transform duration-200 hover:scale-110">
                  <Link to="/wishlist">
                    <Heart className="h-5 w-5" />
                    <span className="sr-only">Wishlist</span>
                  </Link>
                </Button>
                
                <Button variant="ghost" size="icon" asChild className="relative transition-transform duration-200 hover:scale-110">
                  <Link to="/cart">
                    <ShoppingCart className="h-5 w-5" />
                    {itemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-scale-in">
                        {itemCount}
                      </span>
                    )}
                    <span className="sr-only">Cart</span>
                  </Link>
                </Button>
                
                <Button variant="ghost" size="icon" asChild className="transition-transform duration-200 hover:scale-110">
                  <Link to="/account">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Account</span>
                  </Link>
                </Button>
                
                {isAdmin && (
                  <Button variant="ghost" size="icon" asChild className="transition-transform duration-200 hover:scale-110">
                    <Link to="/admin">
                      <Cog className="h-5 w-5" />
                      <span className="sr-only">Admin</span>
                    </Link>
                  </Button>
                )}
                
                <Button variant="outline" onClick={handleSignOut} className="transition-transform duration-200 hover:scale-105">
                  Sign Out
                </Button>
              </>
            ) : (
              <Button asChild className="transition-transform duration-200 hover:scale-105 shadow-md hover:shadow-lg">
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleMenu}
              className="transition-transform duration-200 hover:scale-105"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-4 pb-4 animate-fade-in">
            <Link 
              to="/products" 
              className="block text-gray-600 hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
            <Link 
              to="/categories" 
              className="block text-gray-600 hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Categories
            </Link>
            <Link 
              to="/about" 
              className="block text-gray-600 hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="block text-gray-600 hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            {isAdmin && (
              <Link 
                to="/admin" 
                className="block text-gray-600 hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}
            
            <div className="flex items-center space-x-4 pt-2 border-t">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/search" onClick={() => setIsMenuOpen(false)}>
                  <Search className="h-5 w-5" />
                  <span className="sr-only">Search</span>
                </Link>
              </Button>
              
              {user ? (
                <>
                  <Button variant="ghost" size="icon" asChild>
                    <Link to="/wishlist" onClick={() => setIsMenuOpen(false)}>
                      <Heart className="h-5 w-5" />
                      <span className="sr-only">Wishlist</span>
                    </Link>
                  </Button>
                  
                  <Button variant="ghost" size="icon" asChild className="relative">
                    <Link to="/cart" onClick={() => setIsMenuOpen(false)}>
                      <ShoppingCart className="h-5 w-5" />
                      {itemCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {itemCount}
                        </span>
                      )}
                      <span className="sr-only">Cart</span>
                    </Link>
                  </Button>
                  
                  <Button variant="ghost" size="icon" asChild>
                    <Link to="/account" onClick={() => setIsMenuOpen(false)}>
                      <User className="h-5 w-5" />
                      <span className="sr-only">Account</span>
                    </Link>
                  </Button>
                  
                  <Button variant="outline" onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button asChild>
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
                </Button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default NavBar;
