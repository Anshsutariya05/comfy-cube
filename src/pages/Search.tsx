
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProductCard from '@/components/ProductCard';
import { fetchProducts, fetchCategories } from '@/services/api';
import { Search as SearchIcon } from 'lucide-react';

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  
  // Fetch products and categories
  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  });
  
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });
  
  // Update URL when search query changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) {
      params.set('q', searchQuery);
    }
    navigate({ search: params.toString() });
  }, [searchQuery, navigate]);
  
  // Filter products based on search query
  const filteredProducts = React.useMemo(() => {
    if (!products || !searchQuery) return [];
    
    return products.filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };
  
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
              <BreadcrumbPage>Search</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="max-w-3xl mx-auto mb-12">
          <h1 className="text-3xl font-bold text-center mb-6">Search Products</h1>
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Search</Button>
          </form>
        </div>
        
        {isLoadingProducts ? (
          <div className="text-center py-8">Loading products...</div>
        ) : searchQuery && filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium mb-2">No products found</h2>
            <p className="text-muted-foreground mb-4">
              We couldn't find any products matching "{searchQuery}".
              Try a different search term or browse our categories.
            </p>
            <Button asChild>
              <a href="/products">Browse All Products</a>
            </Button>
          </div>
        ) : searchQuery ? (
          <>
            <h2 className="text-xl font-medium mb-6">
              Showing {filteredProducts.length} results for "{searchQuery}"
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => {
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
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg mb-6">
              Start typing to search for products across our entire catalog.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {categories?.map((category) => (
                <Button 
                  key={category.id} 
                  variant="outline" 
                  className="h-auto py-4"
                  asChild
                >
                  <a href={`/categories/${category.name.toLowerCase().replace(/\s+/g, '-')}`}>
                    {category.name}
                  </a>
                </Button>
              ))}
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </>
  );
};

export default Search;
