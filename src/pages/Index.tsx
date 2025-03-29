
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import CategoryCard from '@/components/CategoryCard';
import { fetchProducts, fetchCategories, Product, Category } from '@/services/api';

const Home = () => {
  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  });
  
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });
  
  const featuredProducts = products?.slice(0, 4) || [];
  
  return (
    <>
      <NavBar />
      
      <main>
        {/* Hero Section */}
        <section className="hero-section">
          <div className="absolute inset-0 bg-black/30 z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=1200" 
            alt="Modern living room" 
            className="absolute inset-0 w-full h-full object-cover object-center" 
          />
          <div className="container relative z-20 text-white">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Transform Your Space</h1>
              <p className="text-lg md:text-xl mb-8 opacity-90">
                Discover furniture that brings comfort, style, and functionality to your home.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="font-medium">
                  <Link to="/products">Shop Now</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20">
                  <Link to="/categories">Explore Categories</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Categories Section */}
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
            
            {isLoadingCategories ? (
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
        
        {/* Featured Products Section */}
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
            
            {isLoadingProducts ? (
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
        
        {/* Why Choose Us Section */}
        <section className="py-16 bg-muted/40">
          <div className="container">
            <h2 className="section-title text-center">Why Choose Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              <Card className="bg-card border-none">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 4h-4a4 4 0 0 0-4 4v12a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V8a4 4 0 0 0-4-4Z"></path><path d="M10 4V2"></path><path d="M14 4V2"></path><path d="M14 12H9"></path><path d="M14 16H9"></path><path d="M11 8H9"></path></svg>
                    </div>
                    <h3 className="text-lg font-medium mb-2">Quality Materials</h3>
                    <p className="text-muted-foreground">
                      We source only the finest materials to ensure durability and longevity.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card border-none">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path></svg>
                    </div>
                    <h3 className="text-lg font-medium mb-2">Easy Shopping</h3>
                    <p className="text-muted-foreground">
                      Hassle-free online shopping experience with secure checkout.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card border-none">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    </div>
                    <h3 className="text-lg font-medium mb-2">Fast Delivery</h3>
                    <p className="text-muted-foreground">
                      Quick and reliable delivery to your doorstep.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card border-none">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path></svg>
                    </div>
                    <h3 className="text-lg font-medium mb-2">5-Year Warranty</h3>
                    <p className="text-muted-foreground">
                      All our products come with a 5-year warranty for peace of mind.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container text-center">
            <h2 className="text-3xl font-medium mb-6">Ready to Transform Your Home?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
              Discover our curated collection of furniture pieces that blend style, comfort, and functionality.
            </p>
            <Button asChild size="lg" variant="secondary" className="font-medium">
              <Link to="/products">Shop Our Collection</Link>
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default Home;
