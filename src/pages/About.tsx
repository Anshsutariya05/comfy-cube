
import React from 'react';
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

const About = () => {
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
              <BreadcrumbPage>About</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">About ComfyCube</h1>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <p className="mb-4">
              Founded in 2020, ComfyCube was born from a simple idea: everyone deserves a beautiful, comfortable living space without breaking the bank. What started as a small workshop in a garage has grown into a beloved furniture brand with a mission to bring quality, sustainable furniture to homes around the world.
            </p>
            <p>
              Our founders, Emma and James, combined their expertise in interior design and sustainable manufacturing to create pieces that are not only aesthetically pleasing but also environmentally responsible and built to last.
            </p>
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p>
              At ComfyCube, we believe that beautiful, well-crafted furniture should be accessible to everyone. We're committed to using sustainable materials, ethical manufacturing processes, and fair labor practices. Every piece we create is designed to bring comfort, functionality, and joy to your home for years to come.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-muted/30 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Quality Materials</h3>
              <p>
                We source only the finest sustainable materials, from certified hardwoods to premium upholstery fabrics, ensuring that every piece is built to last and kind to the planet.
              </p>
            </div>
            
            <div className="bg-muted/30 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Craftsmanship</h3>
              <p>
                Our skilled artisans combine traditional techniques with modern innovation to create furniture that's not just beautiful but exceptionally durable.
              </p>
            </div>
            
            <div className="bg-muted/30 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Sustainable Practices</h3>
              <p>
                From our manufacturing processes to our packaging, we're committed to reducing our environmental footprint and contributing to a healthier planet.
              </p>
            </div>
            
            <div className="bg-muted/30 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Customer Satisfaction</h3>
              <p>
                Your happiness is our priority. We stand behind our products with generous warranties and responsive customer service to ensure your complete satisfaction.
              </p>
            </div>
          </div>
          
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Meet Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-32 h-32 rounded-full mx-auto bg-muted overflow-hidden mb-4">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop" alt="Emma Johnson" className="w-full h-full object-cover" />
                </div>
                <h3 className="font-medium">Emma Johnson</h3>
                <p className="text-muted-foreground">Co-Founder & Design Director</p>
              </div>
              
              <div className="text-center">
                <div className="w-32 h-32 rounded-full mx-auto bg-muted overflow-hidden mb-4">
                  <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&h=500&fit=crop" alt="James Williams" className="w-full h-full object-cover" />
                </div>
                <h3 className="font-medium">James Williams</h3>
                <p className="text-muted-foreground">Co-Founder & Production Lead</p>
              </div>
              
              <div className="text-center">
                <div className="w-32 h-32 rounded-full mx-auto bg-muted overflow-hidden mb-4">
                  <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&h=500&fit=crop" alt="Sarah Chen" className="w-full h-full object-cover" />
                </div>
                <h3 className="font-medium">Sarah Chen</h3>
                <p className="text-muted-foreground">Head of Sustainability</p>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">Visit Our Showroom</h2>
            <p className="mb-4">
              Experience our furniture in person at our flagship showroom. Our design consultants are available to help you find the perfect pieces for your home.
            </p>
            <div className="bg-muted/30 p-6 rounded-lg">
              <h3 className="font-medium mb-2">ComfyCube Showroom</h3>
              <p className="mb-1">123 Design District Avenue</p>
              <p className="mb-1">San Francisco, CA 94103</p>
              <p className="mb-3">United States</p>
              <p className="mb-1">Hours: Monday to Saturday, 10am - 7pm</p>
              <p>Phone: (555) 123-4567</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default About;
