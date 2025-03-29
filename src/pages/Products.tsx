
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetFooter, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { SlidersHorizontal } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { fetchProducts, fetchCategories } from '@/services/api';

const Products = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
  // Initialize filters from URL parameters or defaults
  const [searchQuery, setSearchQuery] = useState(queryParams.get('q') || '');
  const [categoryFilter, setCategoryFilter] = useState(queryParams.get('category') || '');
  const [priceRange, setPriceRange] = useState<[number, number]>([
    parseInt(queryParams.get('minPrice') || '0'), 
    parseInt(queryParams.get('maxPrice') || '2000')
  ]);
  const [sortBy, setSortBy] = useState(queryParams.get('sort') || 'recommended');
  
  // Fetch products and categories
  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  });
  
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });
  
  // Apply filters and sorting
  const filteredProducts = React.useMemo(() => {
    if (!products) return [];
    
    return products
      .filter(product => {
        const matchesSearch = searchQuery
          ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase())
          : true;
          
        const matchesCategory = categoryFilter
          ? product.category_id === categoryFilter
          : true;
          
        const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
        
        return matchesSearch && matchesCategory && matchesPrice;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'priceAsc':
            return a.price - b.price;
          case 'priceDesc':
            return b.price - a.price;
          case 'newest':
            return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
          default:
            return 0; // recommended - no specific sorting
        }
      });
  }, [products, searchQuery, categoryFilter, priceRange, sortBy]);
  
  // Update URL with filters
  const applyFilters = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (categoryFilter) params.set('category', categoryFilter);
    params.set('minPrice', priceRange[0].toString());
    params.set('maxPrice', priceRange[1].toString());
    params.set('sort', sortBy);
    
    navigate({ search: params.toString() });
  };
  
  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('');
    setPriceRange([0, 2000]);
    setSortBy('recommended');
    navigate('/products');
  };
  
  // Handle search input
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };
  
  // Handle filter changes with debounce for price range
  React.useEffect(() => {
    const timer = setTimeout(() => {
      applyFilters();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [categoryFilter, priceRange, sortBy]);
  
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
              <BreadcrumbPage>Products</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">All Products</h1>
            <p className="text-muted-foreground">
              {filteredProducts.length} products found
            </p>
          </div>
          
          {/* Sort and filter (mobile) */}
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="priceAsc">Price: Low to High</SelectItem>
                <SelectItem value="priceDesc">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Products</SheetTitle>
                  <SheetDescription>
                    Narrow down your product search with these filters.
                  </SheetDescription>
                </SheetHeader>
                
                <div className="py-4 space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <Select 
                      value={categoryFilter} 
                      onValueChange={(value) => setCategoryFilter(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Categories</SelectItem>
                        {!isLoadingCategories && categories?.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Price Range</label>
                    <div className="pt-4">
                      <Slider
                        defaultValue={priceRange}
                        min={0}
                        max={2000}
                        step={10}
                        value={priceRange}
                        onValueChange={(value) => setPriceRange(value as [number, number])}
                      />
                      <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <SheetFooter>
                  <Button variant="outline" onClick={resetFilters}>Reset</Button>
                  <Button onClick={applyFilters}>Apply Filters</Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        {/* Main content with sidebar */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar (desktop) */}
          <div className="hidden md:block w-64 space-y-8">
            <div>
              <h3 className="font-medium mb-4">Search</h3>
              <form onSubmit={handleSearch} className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button type="submit">Go</Button>
              </form>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Categories</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Button 
                    variant={categoryFilter === '' ? "default" : "ghost"}
                    className="w-full justify-start font-normal"
                    onClick={() => setCategoryFilter('')}
                  >
                    All Categories
                  </Button>
                </div>
                
                {!isLoadingCategories && categories?.map((category) => (
                  <div key={category.id} className="flex items-center">
                    <Button 
                      variant={categoryFilter === category.id ? "default" : "ghost"}
                      className="w-full justify-start font-normal"
                      onClick={() => setCategoryFilter(category.id)}
                    >
                      {category.name}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Price Range</h3>
              <div className="pt-4">
                <Slider
                  defaultValue={priceRange}
                  min={0}
                  max={2000}
                  step={10}
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                />
                <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </div>
            
            <Button variant="outline" onClick={resetFilters} className="w-full">
              Reset Filters
            </Button>
          </div>
          
          {/* Products grid */}
          <div className="flex-1">
            {isLoadingProducts ? (
              <div className="text-center py-8">Loading products...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-8">
                <h3 className="text-lg font-medium mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filter criteria.
                </p>
                <Button onClick={resetFilters}>Reset Filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Products;
