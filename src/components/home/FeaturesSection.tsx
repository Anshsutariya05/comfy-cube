
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const FeaturesSection = () => {
  return (
    <section className="py-16 bg-muted/40">
      <div className="container">
        <h2 className="section-title text-center">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <FeatureCard 
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 4h-4a4 4 0 0 0-4 4v12a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V8a4 4 0 0 0-4-4Z"></path><path d="M10 4V2"></path><path d="M14 4V2"></path><path d="M14 12H9"></path><path d="M14 16H9"></path><path d="M11 8H9"></path></svg>}
            title="Quality Materials"
            description="We source only the finest materials to ensure durability and longevity."
          />
          
          <FeatureCard 
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path></svg>}
            title="Easy Shopping"
            description="Hassle-free online shopping experience with secure checkout."
          />
          
          <FeatureCard 
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>}
            title="Fast Delivery"
            description="Quick and reliable delivery to your doorstep."
          />
          
          <FeatureCard 
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path></svg>}
            title="5-Year Warranty"
            description="All our products come with a 5-year warranty for peace of mind."
          />
        </div>
      </div>
    </section>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <Card className="bg-card border-none">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
            {icon}
          </div>
          <h3 className="text-lg font-medium mb-2">{title}</h3>
          <p className="text-muted-foreground">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeaturesSection;
