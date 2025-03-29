
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { fetchProducts, fetchCategories } from '@/services/api';

// Import Home page components
import HeroSection from '@/components/home/HeroSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import FeaturedProductsSection from '@/components/home/FeaturedProductsSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import CallToAction from '@/components/home/CallToAction';

const Home = () => {
  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  });
  
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });
  
  return (
    <>
      <NavBar />
      
      <main>
        <HeroSection />
        
        <CategoriesSection 
          categories={categories} 
          products={products} 
          isLoading={isLoadingCategories || isLoadingProducts} 
        />
        
        <FeaturedProductsSection 
          products={products} 
          categories={categories} 
          isLoading={isLoadingProducts} 
        />
        
        <FeaturesSection />
        
        <CallToAction />
      </main>
      
      <Footer />
    </>
  );
};

export default Home;
