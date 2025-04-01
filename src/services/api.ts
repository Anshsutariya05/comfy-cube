
import { supabase } from "@/integrations/supabase/client";

// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string;
  measurements: string;
  category_id: string;
  category?: string;  // Optional field for joined category name
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
  created_at?: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id?: string;
  rating: number;
  comment: string;
  created_at?: string;
}

// Get all products
export const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*');
  
  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
  
  return data.map(product => ({
    ...product,
    imageUrl: product.image_url // Map snake_case from DB to camelCase for frontend
  }));
};

// Get a single product by ID
export const fetchProductById = async (id: string): Promise<Product> => {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name)')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
  
  return {
    ...data,
    imageUrl: data.image_url,
    category: data.categories?.name
  };
};

// Alias for fetchProductById to match what's used in ProductDetail.tsx
export const fetchProduct = fetchProductById;

// Get similar products (products in the same category, excluding the current one)
export const fetchSimilarProducts = async (categoryId: string, currentProductId: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name)')
    .eq('category_id', categoryId)
    .neq('id', currentProductId)
    .limit(4);
  
  if (error) {
    console.error(`Error fetching similar products:`, error);
    throw error;
  }
  
  return data.map(product => ({
    ...product,
    imageUrl: product.image_url,
    category: product.categories?.name
  }));
};

// Get all categories
export const fetchCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*');
  
  if (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
  
  return data;
};

// Get products by category
export const fetchProductsByCategory = async (categoryId: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', categoryId);
  
  if (error) {
    console.error(`Error fetching products for category ${categoryId}:`, error);
    throw error;
  }
  
  return data.map(product => ({
    ...product,
    imageUrl: product.image_url
  }));
};

// Get reviews for a product
export const fetchProductReviews = async (productId: string): Promise<Review[]> => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', productId);
  
  if (error) {
    console.error(`Error fetching reviews for product ${productId}:`, error);
    throw error;
  }
  
  return data;
};

// Add a review for a product
export const addProductReview = async (review: Omit<Review, 'id' | 'created_at'>): Promise<Review> => {
  const { data, error } = await supabase
    .from('reviews')
    .insert([review])
    .select()
    .single();
  
  if (error) {
    console.error('Error adding review:', error);
    throw error;
  }
  
  return data;
};

// Add item to cart
export const addToCart = async (productId: string, quantity: number = 1) => {
  // First, check if the user has a cart
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('User must be logged in to add to cart');
  
  const { data: existingCart } = await supabase
    .from('cart')
    .select('*')
    .eq('user_id', userData.user.id)
    .maybeSingle();
  
  let cartId;
  
  // If no cart exists, create one
  if (!existingCart) {
    const { data: newCart, error: cartError } = await supabase
      .from('cart')
      .insert([{ user_id: userData.user.id }])
      .select()
      .single();
    
    if (cartError) throw cartError;
    cartId = newCart.id;
  } else {
    cartId = existingCart.id;
  }
  
  // Check if product already exists in cart
  const { data: existingItem } = await supabase
    .from('cart_items')
    .select('*')
    .eq('cart_id', cartId)
    .eq('product_id', productId)
    .maybeSingle();
  
  if (existingItem) {
    // Update quantity if the item already exists
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity: existingItem.quantity + quantity })
      .eq('id', existingItem.id);
    
    if (error) throw error;
  } else {
    // Add new item to cart
    const { error } = await supabase
      .from('cart_items')
      .insert([
        { cart_id: cartId, product_id: productId, quantity }
      ]);
    
    if (error) throw error;
  }
  
  return { success: true };
};

// Get user's cart with items
export const fetchCart = async () => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('User must be logged in to view cart');
  
  // Get the user's cart
  const { data: cart } = await supabase
    .from('cart')
    .select('*')
    .eq('user_id', userData.user.id)
    .maybeSingle();
  
  if (!cart) return { items: [], total: 0 };
  
  // Get cart items with product details
  const { data: cartItems, error } = await supabase
    .from('cart_items')
    .select(`
      id,
      quantity,
      product_id,
      products (
        id,
        name,
        price,
        image_url
      )
    `)
    .eq('cart_id', cart.id);
  
  if (error) throw error;
  
  // Format the response
  const items = cartItems.map(item => ({
    id: item.id,
    quantity: item.quantity,
    product: {
      id: item.products.id,
      name: item.products.name,
      price: item.products.price,
      imageUrl: item.products.image_url
    }
  }));
  
  const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  
  return { items, total };
};

// Add to wishlist
export const addToWishlist = async (productId: string) => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('User must be logged in to add to wishlist');
  
  const { error } = await supabase
    .from('wishlist')
    .insert([
      { user_id: userData.user.id, product_id: productId }
    ]);
  
  if (error) throw error;
  
  return { success: true };
};

// Get wishlist
export const fetchWishlist = async () => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('User must be logged in to view wishlist');
  
  const { data, error } = await supabase
    .from('wishlist')
    .select(`
      id,
      product_id,
      products (
        id,
        name,
        price,
        image_url
      )
    `)
    .eq('user_id', userData.user.id);
  
  if (error) throw error;
  
  return data.map(item => ({
    id: item.id,
    product: {
      id: item.products.id,
      name: item.products.name,
      price: item.products.price,
      imageUrl: item.products.image_url
    }
  }));
};

// Create an order
export const createOrder = async (items: {productId: string, quantity: number}[]) => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('User must be logged in to create an order');
  
  // Calculate total price
  let totalPrice = 0;
  const processedItems = [];
  
  for (const item of items) {
    const { data: product } = await supabase
      .from('products')
      .select('price')
      .eq('id', item.productId)
      .single();
    
    totalPrice += product.price * item.quantity;
    processedItems.push({
      product_id: item.productId,
      quantity: item.quantity,
      price_at_purchase: product.price
    });
  }
  
  // Create the order
  const { data: order, error } = await supabase
    .from('orders')
    .insert([
      { 
        user_id: userData.user.id, 
        total_price: totalPrice,
        status: 'pending'
      }
    ])
    .select()
    .single();
  
  if (error) throw error;
  
  // Add order items
  const orderItems = processedItems.map(item => ({
    ...item,
    order_id: order.id
  }));
  
  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);
  
  if (itemsError) throw itemsError;
  
  // Clear the cart after successful order
  const { data: cart } = await supabase
    .from('cart')
    .select('id')
    .eq('user_id', userData.user.id)
    .maybeSingle();
  
  if (cart) {
    await supabase
      .from('cart_items')
      .delete()
      .eq('cart_id', cart.id);
  }
  
  return order;
};

// Get user's orders
export const fetchOrders = async () => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('User must be logged in to view orders');
  
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userData.user.id)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  
  return orders;
};

// Get order details
export const fetchOrderDetails = async (orderId: string) => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('User must be logged in to view order details');
  
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .eq('user_id', userData.user.id)
    .single();
  
  if (orderError) throw orderError;
  
  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select(`
      id,
      quantity,
      price_at_purchase,
      product_id,
      products (
        id,
        name,
        image_url
      )
    `)
    .eq('order_id', orderId);
  
  if (itemsError) throw itemsError;
  
  return {
    ...order,
    items: items.map(item => ({
      id: item.id,
      quantity: item.quantity,
      price: item.price_at_purchase,
      product: {
        id: item.products.id,
        name: item.products.name,
        imageUrl: item.products.image_url
      }
    }))
  };
};
