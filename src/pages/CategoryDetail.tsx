
import React from 'react';
import { useParams, Link } from 'react-router-dom';
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
import ProductCard from '@/components/ProductCard';
import { fetchCategories, fetchProducts } from '@/services/api';

const CategoryDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });
  
  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  });
  
  // Find category by slug
  const category = React.useMemo(() => {
    if (!categories) return null;
    return categories.find(cat => 
      cat.name.toLowerCase().replace(/\s+/g, '-') === slug
    );
  }, [categories, slug]);
  
  // Filter products by category
  const categoryProducts = React.useMemo(() => {
    if (!products || !category) return [];
    return products.filter(product => product.category_id === category.id);
  }, [products, category]);
  
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
              <BreadcrumbLink href="/categories">Categories</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{category?.name || 'Loading...'}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        {isLoadingCategories ? (
          <div className="text-center py-12">Loading category...</div>
        ) : !category ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Category Not Found</h2>
            <p className="mb-6">The category you're looking for doesn't exist or has been removed.</p>
            <Link 
              to="/categories"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Browse All Categories
            </Link>
          </div>
        ) : (
          <>
            {/* Category Header */}
            <div className="relative h-64 mb-8 overflow-hidden rounded-lg">
              <div className="absolute inset-0 bg-black/30 z-10"></div>
              <img 
                src={`https://source.unsplash.com/featured/?${category.name.toLowerCase()},furniture`} 
                alt={category.name}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 z-20 flex items-center justify-center text-center">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">{category.name}</h1>
                  <p className="text-white/90">
                    {categoryProducts.length} {categoryProducts.length === 1 ? 'product' : 'products'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Products */}
            {isLoadingProducts ? (
              <div className="text-center py-8">Loading products...</div>
            ) : categoryProducts.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-xl font-medium mb-4">No products in this category yet</h2>
                <p className="mb-6">Check back soon or browse our other categories.</p>
                <Link 
                  to="/categories"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                  Browse All Categories
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-2">All {category.name} Products</h2>
                  <p className="text-muted-foreground">
                    Showing {categoryProducts.length} {categoryProducts.length === 1 ? 'product' : 'products'}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {categoryProducts.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      id={product.id} 
                      name={product.name} 
                      price={product.price} 
                      imageUrl={product.imageUrl} 
                      category={category.name} 
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </main>
      
      <Footer />
    </>
  );
};

export default CategoryDetail;
