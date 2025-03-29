
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import CategoryCard from '@/components/CategoryCard';
import { Category, Product } from '@/services/api';

interface CategoriesSectionProps {
  categories: Category[] | undefined;
  products: Product[] | undefined;
  isLoading: boolean;
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({ categories, products, isLoading }) => {
  return (
    <section className="py-16 bg-muted/40">
      <div className="container">
        <div className="flex justify-between items-center mb-8">
          <h2 className="section-title">Shop by Category</h2>
          <Button asChild variant="ghost" className="group">
            <Link to="/categories" className="flex items-center">
              View All 
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
        
        {isLoading ? (
          <div className="text-center py-8">Loading categories...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories?.map((category) => (
              <CategoryCard 
                key={category.id} 
                name={category.name} 
                imageUrl={`https://source.unsplash.com/featured/?${category.name.toLowerCase()},furniture`} 
                count={products?.filter(p => p.category_id === category.id).length || 0} 
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoriesSection;
