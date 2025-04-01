import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  fetchProduct,
  fetchSimilarProducts,
  Product,
  addToCart as addToCartApi,
} from '@/services/api';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, ArrowRight, ShoppingCart } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id!),
  });

  const { data: similarProducts, isLoading: isLoadingSimilar } = useQuery({
    queryKey: ['similarProducts', product?.category_id, id],
    queryFn: () => fetchSimilarProducts(product?.category_id!, id!),
    enabled: !!product?.category_id, // Only fetch when product and categoryId are available
  });

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const addToCart = async (product: Product, quantity: number) => {
    try {
      await addToCartApi(product.id, quantity);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
    }, quantity);
    
    toast.success(`${quantity} × ${product.name} added to cart`, {
      description: "Go to cart to checkout.",
    });
  };

  if (isLoading) {
    return (
      <>
        <NavBar />
        <main className="container py-8 mt-16">
          <div className="text-center py-12">Loading product details...</div>
        </main>
        <Footer />
      </>
    );
  }

  if (isError) {
    return (
      <>
        <NavBar />
        <main className="container py-8 mt-16">
          <div className="text-center py-12">Error loading product details. Please try again.</div>
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <NavBar />
        <main className="container py-8 mt-16">
          <div className="text-center py-12">Product not found.</div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <NavBar />
      
      <main className="container py-8 mt-16 animate-fade-in">
        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div>
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
          
          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <p className="text-2xl font-semibold text-primary mb-4">
              {formatCurrency(product.price)}
            </p>
            
            {/* Quantity Selector */}
            <div className="flex items-center mb-4">
              <Label htmlFor="quantity" className="mr-2 text-sm font-medium">Quantity:</Label>
              <div className="flex items-center">
                <Button variant="outline" size="icon" onClick={decrementQuantity} disabled={quantity <= 1}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="w-20 text-center mx-2"
                />
                <Button variant="outline" size="icon" onClick={incrementQuantity}>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Add to Cart Button */}
            <Button className="w-full transition-transform duration-200 hover:scale-105" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
            
            {/* Measurements */}
            {product.measurements && (
              <p className="mt-4 text-sm text-gray-500">
                Measurements: {product.measurements}
              </p>
            )}
          </div>
        </div>
        
        {/* Similar Products */}
        {similarProducts && similarProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Similar Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {isLoadingSimilar ? (
                <div className="text-center py-4 col-span-full">Loading similar products...</div>
              ) : (
                similarProducts.map((similarProduct) => (
                  <Card key={similarProduct.id} className="transition-transform duration-200 hover:scale-105">
                    <CardHeader>
                      <CardTitle>{similarProduct.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <img
                        src={similarProduct.imageUrl}
                        alt={similarProduct.name}
                        className="w-full h-32 object-cover rounded-md mb-2"
                      />
                      <CardDescription>{formatCurrency(similarProduct.price)}</CardDescription>
                    </CardContent>
                    <CardFooter>
                      <Button asChild variant="secondary">
                        <Link to={`/products/${similarProduct.id}`}>View Product</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </>
  );
};

export default ProductDetail;
