import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingCart, Heart, Menu, X, User, Search, Cog, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const { itemCount } = useCart();

  // Location state
  const [location, setLocation] = useState(() => localStorage.getItem('userLocation') || '');
  const [locationInput, setLocationInput] = useState('');
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const locationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
        setIsLocationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSaveLocation = () => {
    const trimmed = locationInput.trim();
    if (!trimmed) return;
    setLocation(trimmed);
    localStorage.setItem('userLocation', trimmed);
    setLocationInput('');
    setIsLocationOpen(false);
  };

  const handleOpenLocation = () => {
    setLocationInput(location);
    setIsLocationOpen(true);
  };
  
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

          {/* Location Widget */}
          <div className="hidden md:block relative" ref={locationRef}>
            <button
              onClick={handleOpenLocation}
              className="flex items-start gap-1.5 text-left hover:text-primary transition-colors duration-200 group px-2 py-1 rounded-md hover:bg-muted/40"
            >
              <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground group-hover:text-primary" />
              <div className="leading-tight">
                <p className="text-[10px] text-muted-foreground">Deliver to</p>
                <p className="text-sm font-semibold truncate max-w-[130px]">
                  {location || 'Set location'}
                </p>
              </div>
            </button>

            {isLocationOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-white border rounded-lg shadow-lg p-4 z-50 animate-fade-in">
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-primary" />
                  Set delivery location
                </h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="locationInput" className="text-xs text-muted-foreground mb-1 block">
                      City, area or zip code
                    </Label>
                    <Input
                      id="locationInput"
                      value={locationInput}
                      onChange={(e) => setLocationInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveLocation()}
                      placeholder="e.g. Mumbai, 400001"
                      className="h-8 text-sm"
                      autoFocus
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 h-8" onClick={handleSaveLocation}>
                      Save
                    </Button>
                    <Button size="sm" variant="outline" className="h-8" onClick={() => setIsLocationOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                  {location && (
                    <p className="text-xs text-muted-foreground">
                      Current: <span className="font-medium text-foreground">{location}</span>
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
          
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
            {/* Mobile Location */}
            <div className="flex items-center gap-2 py-2 border-b">
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex-1">
                <p className="text-[10px] text-muted-foreground">Deliver to</p>
                <Input
                  value={isMenuOpen ? locationInput || location : location}
                  onChange={(e) => setLocationInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveLocation()}
                  placeholder="Set your location"
                  className="h-7 text-sm border-0 p-0 focus-visible:ring-0 bg-transparent font-semibold"
                />
              </div>
              <Button size="sm" variant="outline" className="h-7 px-2 text-xs shrink-0"
                onClick={handleSaveLocation}>
                Save
              </Button>
            </div>
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