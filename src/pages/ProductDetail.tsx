
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { ArrowLeft, Heart, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { fetchProduct, fetchSimilarProducts, Product } from '@/services/api';
import ProductCard from '@/components/ProductCard';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const dummyImages = [
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1470&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1632&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?q=80&w=1470&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1558&auto=format&fit=crop',
];

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  
  const { addItem: addToCart } = useCart();
  const { isInWishlist: checkWishlist, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlist();

  // Fetch product data
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id || ''),
    enabled: !!id,
  });

  // Fetch similar products
  const { data: similarProducts } = useQuery({
    queryKey: ['similar-products', product?.category_id],
    queryFn: () => fetchSimilarProducts(product?.category_id || '', id || ''),
    enabled: !!product?.category_id,
  });

  // Check if product is in wishlist
  useEffect(() => {
    if (id) {
      setIsInWishlist(checkWishlist(id));
    }
  }, [id, checkWishlist]);

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => {
      const newValue = prev + delta;
      return Math.max(1, Math.min(newValue, product?.quantity || 10));
    });
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
    }, quantity);
    
    toast.success(`${quantity} × ${product.name} added to cart`, {
      description: "Go to cart to checkout.",
      action: {
        label: "View Cart",
        onClick: () => window.location.href = "/cart",
      },
    });
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    
    if (isInWishlist) {
      removeFromWishlist(product.id);
      setIsInWishlist(false);
      toast.success(`${product.name} removed from wishlist`);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        category: product.category || '',
      });
      setIsInWishlist(true);
      toast.success(`${product.name} added to wishlist`, {
        action: {
          label: "View Wishlist",
          onClick: () => window.location.href = "/wishlist",
        },
      });
    }
  };

  // Select a random dummy image if product image is not available
  const getProductImage = (index: number) => {
    if (!product || !product.imageUrl) {
      return dummyImages[index % dummyImages.length];
    }
    return product.imageUrl;
  };

  // Use dummy images for thumbnails
  const thumbnailImages = dummyImages.slice(0, 4);

  if (isLoading) {
    return (
      <>
        <NavBar />
        <main className="container py-8 mt-16">
          <div className="h-96 flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-slate-200 mb-4"></div>
              <div className="h-6 w-40 bg-slate-200 rounded"></div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <NavBar />
        <main className="container py-8 mt-16">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
            <p className="mb-8">The product you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to="/products"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Products</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <NavBar />
      <main className="container py-8 mt-16 animate-fade-in">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/products">Products</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span className="font-normal text-foreground">{product.name}</span>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Product Images */}
          <div className="space-y-4 transition-all duration-300">
            <div className="relative overflow-hidden rounded-lg bg-slate-100 aspect-square">
              <img 
                src={getProductImage(activeImage)} 
                alt={product.name} 
                className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
              />
              <Button 
                variant="outline" 
                size="icon" 
                className={`absolute top-4 right-4 rounded-full transition-all duration-300 ${
                  isInWishlist ? 'bg-red-50 border-red-200' : 'bg-white'
                }`}
                onClick={handleToggleWishlist}
              >
                <Heart 
                  className={`h-5 w-5 transition-colors duration-300 ${
                    isInWishlist ? 'fill-red-500 text-red-500' : ''
                  }`} 
                />
                <span className="sr-only">
                  {isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                </span>
              </Button>
            </div>
            
            <div className="flex space-x-4">
              {thumbnailImages.map((img, i) => (
                <button 
                  key={i}
                  className={`relative rounded-md overflow-hidden w-24 h-24 transition-all duration-300 ${
                    activeImage === i ? 'ring-2 ring-primary ring-offset-2' : 'opacity-70 hover:opacity-100'
                  }`}
                  onClick={() => setActiveImage(i)}
                >
                  <img 
                    src={img} 
                    alt={`${product.name} - view ${i+1}`} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              {product.category && (
                <Badge variant="outline" className="mb-2 transition-all duration-300 hover:bg-primary/5">
                  {product.category}
                </Badge>
              )}
              <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
              <div className="mt-2 flex items-center">
                <p className="text-2xl font-semibold">${product.price.toFixed(2)}</p>
                {product.quantity < 10 && (
                  <Badge variant="secondary" className="ml-4">
                    Only {product.quantity} left
                  </Badge>
                )}
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed">{product.description}</p>

            {product.measurements && (
              <div className="border rounded-lg p-4 bg-muted/30">
                <p className="font-medium mb-2">Dimensions</p>
                <p className="text-sm text-muted-foreground">{product.measurements}</p>
              </div>
            )}

            {/* Quantity Selector and Add to Cart */}
            <div className="pt-2">
              <p className="font-medium mb-3">Quantity</p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="h-10 w-10 transition-all duration-200"
                  >
                    <Minus className="h-4 w-4" />
                    <span className="sr-only">Decrease quantity</span>
                  </Button>
                  <span className="w-10 text-center font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.quantity}
                    className="h-10 w-10 transition-all duration-200"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Increase quantity</span>
                  </Button>
                </div>

                <Button 
                  onClick={handleAddToCart}
                  className="flex-1 transition-all duration-300 hover:shadow-md transform hover:scale-[1.01] active:scale-[0.99]"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
              </div>
            </div>

            {/* Product Details in Accordion */}
            <div className="pt-4">
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="details" className="flex-1 transition-all duration-300">Details</TabsTrigger>
                  <TabsTrigger value="shipping" className="flex-1 transition-all duration-300">Shipping</TabsTrigger>
                  <TabsTrigger value="returns" className="flex-1 transition-all duration-300">Returns</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="pt-4 animate-fade-in">
                  <div className="space-y-4">
                    <p className="text-sm">{product.description}</p>
                    {product.measurements && (
                      <div>
                        <h4 className="font-medium mb-1">Dimensions</h4>
                        <p className="text-sm text-muted-foreground">{product.measurements}</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="shipping" className="pt-4 animate-fade-in">
                  <div className="space-y-4">
                    <p className="text-sm">Free shipping on all orders over $100.</p>
                    <p className="text-sm">Orders typically ship within 2-3 business days.</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="returns" className="pt-4 animate-fade-in">
                  <div className="space-y-4">
                    <p className="text-sm">We accept returns within 30 days of delivery.</p>
                    <p className="text-sm">Items must be in original condition with tags attached.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts && similarProducts.length > 0 && (
          <div className="mb-12 animate-fade-in">
            <h2 className="text-2xl font-bold mb-8">Similar Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.slice(0, 4).map((product) => (
                <div key={product.id} className="transform transition-transform duration-300 hover:scale-105">
                  <ProductCard 
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    imageUrl={product.imageUrl || dummyImages[0]}
                    category={product.category || ''}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default ProductDetail;
