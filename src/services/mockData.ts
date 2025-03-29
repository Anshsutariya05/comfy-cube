
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string;
  categoryId: string;
  measurements: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  createdAt: string;
  imageUrl: string;
  productCount: number;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// Mock categories
export const categories: Category[] = [
  {
    id: '1',
    name: 'Living Room',
    createdAt: '2023-01-01T00:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1618219944342-824e40a13285?q=80&w=500',
    productCount: 10
  },
  {
    id: '2',
    name: 'Bedroom',
    createdAt: '2023-01-01T00:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1617104678098-de229db51175?q=80&w=500',
    productCount: 8
  },
  {
    id: '3',
    name: 'Dining',
    createdAt: '2023-01-01T00:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1615875605825-5eb95906447e?q=80&w=500',
    productCount: 6
  },
  {
    id: '4',
    name: 'Office',
    createdAt: '2023-01-01T00:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=500',
    productCount: 5
  }
];

// Mock products
export const products: Product[] = [
  {
    id: '1',
    name: 'Modern Sofa',
    description: 'A comfortable modern sofa with clean lines and plush cushions. Perfect for contemporary living rooms.',
    price: 1299.99,
    quantity: 10,
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=500',
    categoryId: '1',
    measurements: 'W: 220cm × D: 95cm × H: 85cm',
    createdAt: '2023-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Leather Armchair',
    description: 'Premium leather armchair with solid wood frame. Adds elegance to any living space.',
    price: 799.99,
    quantity: 5,
    imageUrl: 'https://images.unsplash.com/photo-1617103996702-96ff29b1c467?q=80&w=500',
    categoryId: '1',
    measurements: 'W: 85cm × D: 90cm × H: 100cm',
    createdAt: '2023-01-02T00:00:00Z'
  },
  {
    id: '3',
    name: 'Queen Size Bed',
    description: 'Elegant queen size bed with upholstered headboard and solid wood frame.',
    price: 899.99,
    quantity: 8,
    imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=500',
    categoryId: '2',
    measurements: 'W: 160cm × L: 200cm × H: 120cm',
    createdAt: '2023-01-03T00:00:00Z'
  },
  {
    id: '4',
    name: 'Nightstand',
    description: 'Compact nightstand with two drawers. Perfect for your bedside essentials.',
    price: 249.99,
    quantity: 15,
    imageUrl: 'https://images.unsplash.com/photo-1532372320572-cda25653a694?q=80&w=500',
    categoryId: '2',
    measurements: 'W: 50cm × D: 40cm × H: 60cm',
    createdAt: '2023-01-04T00:00:00Z'
  },
  {
    id: '5',
    name: 'Dining Table',
    description: 'Spacious dining table made from solid oak. Seats up to 6 people comfortably.',
    price: 899.99,
    quantity: 7,
    imageUrl: 'https://images.unsplash.com/photo-1615874694520-474822394e73?q=80&w=500',
    categoryId: '3',
    measurements: 'W: 180cm × D: 90cm × H: 75cm',
    createdAt: '2023-01-05T00:00:00Z'
  },
  {
    id: '6',
    name: 'Dining Chair',
    description: 'Comfortable dining chair with fabric upholstery and solid wood legs.',
    price: 149.99,
    quantity: 24,
    imageUrl: 'https://images.unsplash.com/photo-1551298698-66b830a4f11c?q=80&w=500',
    categoryId: '3',
    measurements: 'W: 50cm × D: 55cm × H: 90cm',
    createdAt: '2023-01-06T00:00:00Z'
  },
  {
    id: '7',
    name: 'Office Desk',
    description: 'Spacious office desk with drawer storage and cable management system.',
    price: 499.99,
    quantity: 12,
    imageUrl: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=500',
    categoryId: '4',
    measurements: 'W: 140cm × D: 70cm × H: 75cm',
    createdAt: '2023-01-07T00:00:00Z'
  },
  {
    id: '8',
    name: 'Ergonomic Office Chair',
    description: 'Fully adjustable ergonomic office chair with lumbar support and breathable mesh back.',
    price: 349.99,
    quantity: 18,
    imageUrl: 'https://images.unsplash.com/photo-1596079890744-c1a0462d0975?q=80&w=500',
    categoryId: '4',
    measurements: 'W: 65cm × D: 70cm × H: 110-120cm (adjustable)',
    createdAt: '2023-01-08T00:00:00Z'
  }
];

// Generate random reviews for products
const userNames = ['John D.', 'Sarah M.', 'Michael T.', 'Emma W.', 'Robert S.', 'Lisa G.'];
const reviewComments = [
  'Love this piece! It fits perfectly in my home.',
  'Great quality for the price. Very satisfied with my purchase.',
  'Comfortable and stylish. Exactly what I was looking for.',
  'The color is slightly different than pictured, but still happy with it.',
  'Sturdy construction and easy to assemble. Highly recommend!',
  'Looks even better in person than in the photos.',
  'Shipping was fast and the product arrived in perfect condition.',
  'Good value for money. Would buy from this store again.'
];

export const generateReviews = (productId: string, count: number = 5): Review[] => {
  const reviews: Review[] = [];
  
  for (let i = 0; i < count; i++) {
    const randomUserIndex = Math.floor(Math.random() * userNames.length);
    const randomCommentIndex = Math.floor(Math.random() * reviewComments.length);
    const randomRating = Math.floor(Math.random() * 3) + 3; // Ratings between 3-5
    
    reviews.push({
      id: `${productId}-review-${i}`,
      productId,
      userId: `user-${randomUserIndex}`,
      userName: userNames[randomUserIndex],
      rating: randomRating,
      comment: reviewComments[randomCommentIndex],
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() // Random date within last 30 days
    });
  }
  
  return reviews;
};

// Mock service functions
export const getProducts = (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(products);
    }, 500);
  });
};

export const getProductById = (id: string): Promise<Product | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const product = products.find(p => p.id === id);
      resolve(product);
    }, 500);
  });
};

export const getProductsByCategory = (categoryId: string): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filtered = products.filter(p => p.categoryId === categoryId);
      resolve(filtered);
    }, 500);
  });
};

export const getCategories = (): Promise<Category[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(categories);
    }, 500);
  });
};

export const getCategoryById = (id: string): Promise<Category | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const category = categories.find(c => c.id === id);
      resolve(category);
    }, 500);
  });
};

export const getReviewsForProduct = (productId: string): Promise<Review[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateReviews(productId));
    }, 500);
  });
};

export const searchProducts = (query: string): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filtered = products.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) || 
        p.description.toLowerCase().includes(query.toLowerCase())
      );
      resolve(filtered);
    }, 500);
  });
};
