
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import CategoryCard from '@/components/CategoryCard';
import { fetchCategories, fetchProducts } from '@/services/api';

const Categories = () => {
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  
  });
  
  
  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  });
  
  // Count products per category
  const productCounts = React.useMemo(() => {
    if (!products || !categories) return {};
    
    return categories.reduce((counts: Record<string, number>, category) => {
      counts[category.id] = products.filter(product => product.category_id === category.id).length;
      return counts;
    }, {});
  }, [products, categories]);
  
  return (
    <>
      <NavBar />
      
      <main className="container py-8 mt-16">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Categories</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Shop by Category</h1>
          <p className="text-muted-foreground">
            Browse our products by category to find exactly what you need.
          </p>
        </div>
        
        {/* Categories Grid */}
        {isLoadingCategories || isLoadingProducts ? (
          <div className="text-center py-12">Loading categories...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories?.map((category) => (
              <CategoryCard 
                key={category.id} 
                name={category.name} 
                imageUrl={`https://cdn.discordapp.com/attachments/905019343841140786/1359091708612313179/photo-1505409628601-edc9af17fda6.png?ex=67f6384a&is=67f4e6ca&hm=ab792964c27e12ca20626fd9328ee00b3a9510d0a8b7c721b824c439dd126488&`} 
                count={productCounts[category.id] || 0} 
              />
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </>
  );
};

export default Categories;
