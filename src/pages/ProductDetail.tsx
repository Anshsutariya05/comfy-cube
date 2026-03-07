import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  fetchProduct,
  fetchSimilarProducts,
  fetchProductReviews,
  addProductReview,
  Review,
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
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { ArrowLeft, ArrowRight, ShoppingCart, Star } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';

const reviewFormSchema = z.object({
  rating: z.number().min(1, { message: 'Please choose a star rating.' }).max(5),
  comment: z
    .string()
    .trim()
    .min(10, { message: 'Please write at least 10 characters.' })
    .max(500, { message: 'Please keep your review under 500 characters.' }),
});

type ReviewFormValues = z.infer<typeof reviewFormSchema>;

const renderStars = (rating: number, sizeClass = 'h-4 w-4') =>
  Array.from({ length: 5 }, (_, index) => {
    const filled = index < rating;

    return (
      <Star
        key={`${rating}-${index}`}
        className={`${sizeClass} ${filled ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`}
      />
    );
  });

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);
  const reviewForm = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      rating: 5,
      comment: '',
    },
  });

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id!),
  });

  const {
    data: reviews = [],
    isLoading: isLoadingReviews,
    isError: isReviewsError,
  } = useQuery({
    queryKey: ['productReviews', id],
    queryFn: () => fetchProductReviews(id!),
    enabled: !!id,
  });

  const { data: similarProducts, isLoading: isLoadingSimilar } = useQuery({
    queryKey: ['similarProducts', product?.category_id, id],
    queryFn: () => fetchSimilarProducts(product?.category_id!, id!),
    enabled: !!product?.category_id, // Only fetch when product and categoryId are available
  });

  const addReviewMutation = useMutation({
    mutationFn: async (values: ReviewFormValues) => {
      if (!product) {
        throw new Error('Product not found');
      }

      return addProductReview({
        product_id: product.id,
        user_id: user?.id ?? null,
        rating: values.rating,
        comment: values.comment.trim(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productReviews', id] });
      reviewForm.reset({ rating: 5, comment: '' });
      toast.success('Thanks for sharing your review!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Unable to submit review right now.');
    },
  });

  const averageRating = React.useMemo(() => {
    if (!reviews.length) return 0;

    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return total / reviews.length;
  }, [reviews]);

  const handleReviewSubmit = (values: ReviewFormValues) => {
    addReviewMutation.mutate(values);
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const addToCart = async (productId: string, quantity: number) => {
    try {
      await addToCartApi(productId, quantity);
      toast.success(`${quantity} × ${product.name} added to cart`, {
        description: "Go to cart to checkout.",
      });
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product.id, quantity);
    }
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

  const formattedAverageRating = averageRating ? averageRating.toFixed(1) : null;

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
            <div className="mb-4 flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                {renderStars(Math.round(averageRating), 'h-5 w-5')}
              </div>
              <span>
                {formattedAverageRating ? `${formattedAverageRating}/5` : 'No ratings yet'}
              </span>
              <span>•</span>
              <span>{reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</span>
            </div>
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

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader>
              <CardTitle>Customer Reviews</CardTitle>
              <CardDescription>
                {formattedAverageRating
                  ? `${formattedAverageRating} out of 5 from ${reviews.length} customer ${reviews.length === 1 ? 'review' : 'reviews'}`
                  : 'Be the first to review this product.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoadingReviews ? (
                <div className="text-sm text-muted-foreground">Loading reviews...</div>
              ) : isReviewsError ? (
                <div className="text-sm text-destructive">We couldn't load reviews right now.</div>
              ) : reviews.length === 0 ? (
                <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                  No reviews yet. Share your thoughts below.
                </div>
              ) : (
                reviews.map((review: Review) => (
                  <div key={review.id} className="rounded-lg border p-4">
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1">{renderStars(review.rating)}</div>
                        <p className="mt-1 text-sm font-medium">
                          {review.user_id && review.user_id === user?.id ? 'You' : 'Customer review'}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {review.created_at ? new Date(review.created_at).toLocaleDateString() : 'Recently added'}
                      </p>
                    </div>
                    <p className="text-sm leading-6 text-foreground/90">{review.comment}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Write a Review</CardTitle>
              <CardDescription>
                Add a star rating out of 5 and tell other shoppers what you think.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...reviewForm}>
                <form onSubmit={reviewForm.handleSubmit(handleReviewSubmit)} className="space-y-6">
                  <FormField
                    control={reviewForm.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Star rating</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            {Array.from({ length: 5 }, (_, index) => {
                              const starValue = index + 1;
                              const filled = starValue <= field.value;

                              return (
                                <Button
                                  key={starValue}
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-10 w-10 rounded-full"
                                  onClick={() => field.onChange(starValue)}
                                  aria-label={`Rate this product ${starValue} out of 5`}
                                >
                                  <Star className={`h-6 w-6 ${filled ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`} />
                                </Button>
                              );
                            })}
                          </div>
                        </FormControl>
                        <FormDescription>{field.value} out of 5 stars selected.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={reviewForm.control}
                    name="comment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Comment</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            rows={5}
                            placeholder="Share what you liked, comfort, quality, delivery experience, or styling tips..."
                          />
                        </FormControl>
                        <FormDescription>
                          A short written review helps other customers decide.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={addReviewMutation.isPending}>
                    {addReviewMutation.isPending ? 'Submitting review...' : 'Submit Review'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
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
