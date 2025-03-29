
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, name, price, imageUrl, category }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // This would normally dispatch to a cart context or state management
    toast.success(`${name} added to cart`);
  };
  
  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? `${name} removed from wishlist` : `${name} added to wishlist`);
  };
  
  return (
    <div className="product-card group animate-fade-in">
      <Link to={`/products/${id}`} className="block">
        <div className="relative overflow-hidden">
          <img 
            src={imageUrl || '/placeholder.svg'} 
            alt={name}
            className="product-image"
          />
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            <Button 
              size="icon" 
              variant="secondary" 
              className="rounded-full opacity-70 hover:opacity-100"
              onClick={handleToggleWishlist}
            >
              <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-destructive text-destructive' : ''}`} />
              <span className="sr-only">Add to wishlist</span>
            </Button>
          </div>
        </div>
        <div className="p-4">
          <p className="text-sm text-muted-foreground uppercase tracking-wider">{category}</p>
          <h3 className="font-medium mt-1 line-clamp-1">{name}</h3>
          <div className="mt-2 flex items-center justify-between">
            <span className="font-semibold">${price.toFixed(2)}</span>
            <Button 
              size="sm" 
              variant="outline"
              className="opacity-0 group-hover:opacity-100 transition-opacity" 
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
