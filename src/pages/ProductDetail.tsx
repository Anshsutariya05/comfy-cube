
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Heart, Share2, Star, ShoppingCart, Truck, Undo2, Shield } from 'lucide-react';
import { toast } from 'sonner';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { 
  fetchProductById, 
  fetchProductReviews, 
  fetchCategories, 
  addProductReview, 
  addToCart, 
  addToWishlist 
} from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);
  const { addItem: addToCartContext } = useCart();
  const { addItem: addToWishlistContext, isInWishlist, removeItem: removeFromWishlist } = useWishlist();
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  // Fetch product details
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id!),
    enabled: !!id
  });

  useEffect(() => {
    if (product && id) {
      setIsWishlisted(isInWishlist(id));
    }
  }, [id, product, isInWishlist]);
  
  // Fetch product reviews
  const { data: reviews, isLoading: isLoadingReviews } = useQuery({
    queryKey: ['productReviews', id],
    queryFn: () => fetchProductReviews(id!),
    enabled: !!id
  });
  
  // Fetch categories to get the product's category name
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });
  
  // Calculate average rating
  const averageRating = React.useMemo(() => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return Math.round((total / reviews.length) * 10) / 10;
  }, [reviews]);
  
  // Get category name
  const categoryName = React.useMemo(() => {
    if (!product || !categories) return '';
    const category = categories.find(c => c.id === product.category_id);
    return category ? category.name : '';
  }, [product, categories]);
  
  // Handle quantity changes
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  };
  
  const increaseQuantity = () => {
    if (quantity < (product?.quantity || 1)) {
      setQuantity(q => q + 1);
    }
  };
  
  // Handle add to cart - Use the context directly
  const handleAddToCart = () => {
    if (product) {
      addToCartContext({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
      });
      toast.success(`${product.name} added to cart`);
    }
  };
  
  // Handle add to wishlist
  const handleToggleWishlist = () => {
    if (!product) return;
    
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast.success(`${product.name} removed from wishlist`);
    } else {
      addToWishlistContext({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        category: categoryName
      });
      toast.success(`${product.name} added to wishlist`);
    }
    
    setIsWishlisted(!isWishlisted);
  };
  
  return (
    <>
      <NavBar />
      
      <main className="container py-8 mt-16 animate-fade-in">
        {isLoading ? (
          <div className="text-center py-12">Loading product...</div>
        ) : !product ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
            <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to="/products">Return to Products</Link>
            </Button>
          </div>
        ) : (
          <>
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
                  <BreadcrumbLink href={`/categories/${product.category_id}`}>
                    {categoryName}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink>{product.name}</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            
            {/* Product info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Product image */}
              <div className="bg-muted/40 rounded-lg overflow-hidden hover-scale transition-all duration-300">
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-auto object-cover aspect-square transition-all duration-500 hover:scale-105"
                />
              </div>
              
              {/* Product details */}
              <div className="animate-fade-in">
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star}
                        className={`h-5 w-5 transition-all duration-300 ${
                          star <= Math.round(averageRating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`} 
                      />
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground">
                      {averageRating} ({reviews?.length || 0} reviews)
                    </span>
                  </div>
                </div>
                
                <div className="text-2xl font-bold mb-6">${product.price.toFixed(2)}</div>
                
                <p className="text-muted-foreground mb-6">
                  {product.description}
                </p>
                
                <div className="p-4 bg-muted/30 rounded-lg mb-6 hover:bg-muted/40 transition-colors duration-300">
                  <h3 className="font-medium mb-2">Dimensions</h3>
                  <p>{product.measurements}</p>
                </div>
                
                {/* Quantity selector */}
                <div className="flex items-center space-x-4 mb-6">
                  <span className="font-medium">Quantity:</span>
                  <div className="flex items-center">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="transition-all duration-200 hover:bg-primary/10"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="mx-4 w-8 text-center">{quantity}</span>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={increaseQuantity}
                      disabled={quantity >= product.quantity}
                      className="transition-all duration-200 hover:bg-primary/10"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.quantity} available
                  </span>
                </div>
                
                {/* Action buttons */}
                <div className="flex flex-wrap gap-4 mb-8">
                  <Button 
                    className="flex-1 transition-transform duration-200 hover:scale-105 shadow-md hover:shadow-lg" 
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </Button>
                  
                  <Button 
                    variant={isWishlisted ? "default" : "outline"} 
                    onClick={handleToggleWishlist}
                    className="transition-all duration-200"
                  >
                    <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-white' : ''}`} />
                    <span className="ml-2">{isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}</span>
                  </Button>
                  
                  <Button variant="outline" className="transition-transform duration-200 hover:scale-105">
                    <Share2 className="h-5 w-5" />
                    <span className="ml-2">Share</span>
                  </Button>
                </div>
                
                {/* Delivery info */}
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center p-2 rounded-md hover:bg-muted/30 transition-colors duration-300">
                    <Truck className="h-5 w-5 mr-2 text-muted-foreground" />
                    <span>Free delivery on orders over $100</span>
                  </div>
                  <div className="flex items-center p-2 rounded-md hover:bg-muted/30 transition-colors duration-300">
                    <Undo2 className="h-5 w-5 mr-2 text-muted-foreground" />
                    <span>30-day return policy</span>
                  </div>
                  <div className="flex items-center p-2 rounded-md hover:bg-muted/30 transition-colors duration-300">
                    <Shield className="h-5 w-5 mr-2 text-muted-foreground" />
                    <span>5-year warranty included</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Tabs for details and reviews */}
            <Tabs defaultValue="details" className="mb-12">
              <TabsList className="w-full max-w-md">
                <TabsTrigger value="details" className="flex-1 transition-all duration-200">Details</TabsTrigger>
                <TabsTrigger value="reviews" className="flex-1 transition-all duration-200">Reviews ({reviews?.length || 0})</TabsTrigger>
              </TabsList>
              
              <div className="mt-6">
                <TabsContent value="details" className="animate-fade-in">
                  <h2 className="text-xl font-bold mb-4">Product Details</h2>
                  <div className="space-y-4">
                    <p>{product.description}</p>
                    
                    <h3 className="font-medium mt-4">Specifications</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Dimensions: {product.measurements}</li>
                      <li>Category: {categoryName}</li>
                      <li>Material: Premium quality materials</li>
                      <li>Warranty: 5-year manufacturer warranty</li>
                    </ul>
                    
                    <h3 className="font-medium mt-4">Care Instructions</h3>
                    <p>
                      Dust regularly with a soft, dry cloth. For wooden surfaces, use appropriate wood cleaner.
                      Avoid direct sunlight and heat sources to prevent damage.
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="reviews" className="animate-fade-in">
                  <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
                  
                  {isLoadingReviews ? (
                    <div>Loading reviews...</div>
                  ) : reviews && reviews.length > 0 ? (
                    <div className="space-y-6">
                      {/* Rating summary */}
                      <div className="bg-muted/20 p-4 rounded-lg mb-6 hover:bg-muted/30 transition-colors duration-300">
                        <div className="flex items-center">
                          <div className="text-4xl font-bold mr-4">{averageRating}</div>
                          <div>
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star}
                                  className={`h-5 w-5 transition-colors duration-300 ${
                                    star <= Math.round(averageRating)
                                      ? 'text-yellow-400 fill-yellow-400'
                                      : 'text-gray-300'
                                  }`} 
                                />
                              ))}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Based on {reviews.length} reviews
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Review list */}
                      {reviews.map((review) => (
                        <div key={review.id} className="pb-6 border-b hover:bg-muted/5 p-3 rounded-lg transition-colors duration-300">
                          <div className="flex justify-between mb-2">
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= review.rating
                                      ? 'text-yellow-400 fill-yellow-400'
                                      : 'text-gray-300'
                                  }`} 
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {new Date(review.created_at || '').toLocaleDateString()}
                            </span>
                          </div>
                          <p className="mb-2">{review.comment}</p>
                          <p className="text-sm text-muted-foreground">
                            by {review.user_id ? 'Verified Buyer' : 'Anonymous'}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="mb-4">No reviews yet. Be the first to review this product!</p>
                      {user ? (
                        <Button asChild className="transition-transform duration-200 hover:scale-105">
                          <Link to={`/products/${id}/review`}>Write a Review</Link>
                        </Button>
                      ) : (
                        <Button asChild className="transition-transform duration-200 hover:scale-105">
                          <Link to="/auth">Sign in to Leave a Review</Link>
                        </Button>
                      )}
                    </div>
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </>
        )}
      </main>
      
      <Footer />
    </>
  );
};

export default ProductDetail;
