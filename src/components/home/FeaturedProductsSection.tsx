
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { Category, Product } from '@/services/api';

interface FeaturedProductsSectionProps {
  products: Product[] | undefined;
  categories: Category[] | undefined;
  isLoading: boolean;
}

const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({ products, categories, isLoading }) => {
  const featuredProducts = products?.slice(0, 4) || [];
  
  return (
    <section className="py-16">
      <div className="container">
        <div className="flex justify-between items-center mb-8">
          <h2 className="section-title">Featured Products</h2>
          <Button asChild variant="ghost" className="group">
            <Link to="/products" className="flex items-center">
              View All 
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
        
        {isLoading ? (
          <div className="text-center py-8">Loading products...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => {
              const category = categories?.find(c => c.id === product.category_id);
              return (
                <ProductCard 
                  key={product.id} 
                  id={product.id} 
                  name={product.name} 
                  price={product.price} 
                  imageUrl={product.imageUrl} 
                  category={category?.name || 'Furniture'} 
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProductsSection;
