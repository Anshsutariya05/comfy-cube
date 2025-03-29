
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
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
  );
};

export default HeroSection;
