
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { fetchProducts, fetchCategories, Product, Category } from '@/services/api';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAdmin, loading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
  
  // Form states
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    imageUrl: '',
    measurements: '',
    categoryId: ''
  });
  
  const [categoryForm, setCategoryForm] = useState({
    name: ''
  });
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
  // Fetch products and categories
  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  });
  
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });
  
  // Filter products by search query
  const filteredProducts = React.useMemo(() => {
    if (!products) return [];
    return products.filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);
  
  // Mutations
  const addProductMutation = useMutation({
    mutationFn: async (product: Omit<Product, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          name: product.name,
          description: product.description,
          price: product.price,
          quantity: product.quantity,
          image_url: product.imageUrl,
          measurements: product.measurements,
          category_id: product.category_id
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product added successfully');
      setIsAddProductDialogOpen(false);
      resetProductForm();
    },
    onError: (error: any) => {
      toast.error(`Failed to add product: ${error.message}`);
    }
  });
  
  const updateProductMutation = useMutation({
    mutationFn: async (product: Product) => {
      const { data, error } = await supabase
        .from('products')
        .update({
          name: product.name,
          description: product.description,
          price: product.price,
          quantity: product.quantity,
          image_url: product.imageUrl,
          measurements: product.measurements,
          category_id: product.category_id
        })
        .eq('id', product.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product updated successfully');
      setIsAddProductDialogOpen(false);
      setSelectedProduct(null);
      resetProductForm();
    },
    onError: (error: any) => {
      toast.error(`Failed to update product: ${error.message}`);
    }
  });
  
  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete product: ${error.message}`);
    }
  });
  
  const addCategoryMutation = useMutation({
    mutationFn: async (category: Omit<Category, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('categories')
        .insert([category])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category added successfully');
      setIsAddCategoryDialogOpen(false);
      setCategoryForm({ name: '' });
    },
    onError: (error: any) => {
      toast.error(`Failed to add category: ${error.message}`);
    }
  });
  
  const updateCategoryMutation = useMutation({
    mutationFn: async (category: Category) => {
      const { data, error } = await supabase
        .from('categories')
        .update({ name: category.name })
        .eq('id', category.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category updated successfully');
      setIsAddCategoryDialogOpen(false);
      setSelectedCategory(null);
      setCategoryForm({ name: '' });
    },
    onError: (error: any) => {
      toast.error(`Failed to update category: ${error.message}`);
    }
  });
  
  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete category: ${error.message}`);
    }
  });
  
  // Form handlers
  const handleProductFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProductForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCategoryFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCategoryForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCategorySelect = (value: string) => {
    setProductForm(prev => ({ ...prev, categoryId: value }));
  };
  
  const handleAddProduct = () => {
    const product = {
      name: productForm.name,
      description: productForm.description,
      price: parseFloat(productForm.price),
      quantity: parseInt(productForm.quantity),
      imageUrl: productForm.imageUrl,
      measurements: productForm.measurements,
      category_id: productForm.categoryId
    };
    
    addProductMutation.mutate(product);
  };
  
  const handleUpdateProduct = () => {
    if (!selectedProduct) return;
    
    const product = {
      ...selectedProduct,
      name: productForm.name,
      description: productForm.description,
      price: parseFloat(productForm.price),
      quantity: parseInt(productForm.quantity),
      imageUrl: productForm.imageUrl,
      measurements: productForm.measurements,
      category_id: productForm.categoryId
    };
    
    updateProductMutation.mutate(product);
  };
  
  const handleAddCategory = () => {
    addCategoryMutation.mutate({ name: categoryForm.name });
  };
  
  const handleUpdateCategory = () => {
    if (!selectedCategory) return;
    
    const category = {
      ...selectedCategory,
      name: categoryForm.name
    };
    
    updateCategoryMutation.mutate(category);
  };
  
  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      imageUrl: product.imageUrl,
      measurements: product.measurements || '',
      categoryId: product.category_id || ''
    });
    setIsAddProductDialogOpen(true);
  };
  
  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setCategoryForm({ name: category.name });
    setIsAddCategoryDialogOpen(true);
  };
  
  const resetProductForm = () => {
    setProductForm({
      name: '',
      description: '',
      price: '',
      quantity: '',
      imageUrl: '',
      measurements: '',
      categoryId: ''
    });
    setSelectedProduct(null);
  };
  
  if (authLoading) {
    return (
      <>
        <NavBar />
        <main className="container py-8 mt-16">
          <div className="text-center py-12">Verifying admin access...</div>
        </main>
        <Footer />
      </>
    );
  }
  
  if (!isAdmin) {
    return (
      <>
        <NavBar />
        <main className="container py-8 mt-16">
          <div className="text-center py-12">You do not have access to this page.</div>
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
              <BreadcrumbPage>Admin Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage products, categories, and more.
          </p>
        </div>
        
        {/* Dashboard Content */}
        <Tabs defaultValue="products" className="mb-12">
          <TabsList className="mb-6">
            <TabsTrigger value="products" className="transition-all duration-200">Products</TabsTrigger>
            <TabsTrigger value="categories" className="transition-all duration-200">Categories</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products" className="space-y-6 animate-fade-in">
            {/* Search and Add Product */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search products..." 
                  className="pl-10" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Dialog open={isAddProductDialogOpen} onOpenChange={setIsAddProductDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="transition-transform duration-200 hover:scale-105">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px]">
                  <DialogHeader>
                    <DialogTitle>{selectedProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                    <DialogDescription>
                      {selectedProduct ? 'Update product details below.' : 'Fill in the details for the new product.'}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">Product Name</label>
                        <Input 
                          id="name" 
                          name="name" 
                          value={productForm.name} 
                          onChange={handleProductFormChange}
                          placeholder="Modern Sofa"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="price" className="text-sm font-medium">Price ($)</label>
                        <Input 
                          id="price" 
                          name="price" 
                          type="number"
                          step="0.01"
                          value={productForm.price} 
                          onChange={handleProductFormChange}
                          placeholder="199.99"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="description" className="text-sm font-medium">Description</label>
                      <Textarea 
                        id="description" 
                        name="description" 
                        value={productForm.description} 
                        onChange={handleProductFormChange}
                        placeholder="A comfortable modern sofa with clean lines and plush cushions."
                        rows={4}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="quantity" className="text-sm font-medium">Quantity</label>
                        <Input 
                          id="quantity" 
                          name="quantity" 
                          type="number"
                          value={productForm.quantity} 
                          onChange={handleProductFormChange}
                          placeholder="10"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="category" className="text-sm font-medium">Category</label>
                        <Select 
                          value={productForm.categoryId} 
                          onValueChange={handleCategorySelect}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {categories?.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="imageUrl" className="text-sm font-medium">Image URL</label>
                      <Input 
                        id="imageUrl" 
                        name="imageUrl" 
                        value={productForm.imageUrl} 
                        onChange={handleProductFormChange}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="measurements" className="text-sm font-medium">Measurements</label>
                      <Input 
                        id="measurements" 
                        name="measurements" 
                        value={productForm.measurements} 
                        onChange={handleProductFormChange}
                        placeholder="W: 220cm × D: 95cm × H: 85cm"
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={resetProductForm}>Cancel</Button>
                    <Button 
                      onClick={selectedProduct ? handleUpdateProduct : handleAddProduct}
                      disabled={!productForm.name || !productForm.price || !productForm.description}
                    >
                      {selectedProduct ? 'Update Product' : 'Add Product'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            {/* Products Table */}
            {isLoadingProducts ? (
              <div className="text-center py-12">Loading products...</div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          {searchQuery ? 'No products match your search' : 'No products available'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProducts.map((product) => {
                        const category = categories?.find(c => c.id === product.category_id);
                        
                        return (
                          <TableRow key={product.id} className="hover:bg-muted/40 transition-colors duration-200">
                            <TableCell>
                              <img 
                                src={product.imageUrl} 
                                alt={product.name}
                                className="h-12 w-12 object-cover rounded"
                              />
                            </TableCell>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell>${product.price.toFixed(2)}</TableCell>
                            <TableCell>{product.quantity}</TableCell>
                            <TableCell>{category?.name || 'Uncategorized'}</TableCell>
                            <TableCell className="flex space-x-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleEditProduct(product)}
                                className="hover:bg-primary/10 transition-colors duration-200"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => {
                                  if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
                                    deleteProductMutation.mutate(product.id);
                                  }
                                }}
                                className="hover:bg-destructive/10 text-destructive transition-colors duration-200"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="categories" className="space-y-6 animate-fade-in">
            {/* Add Category */}
            <div className="flex justify-end">
              <Dialog open={isAddCategoryDialogOpen} onOpenChange={setIsAddCategoryDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="transition-transform duration-200 hover:scale-105">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[400px]">
                  <DialogHeader>
                    <DialogTitle>{selectedCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
                    <DialogDescription>
                      {selectedCategory ? 'Update category name below.' : 'Enter a name for the new category.'}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label htmlFor="categoryName" className="text-sm font-medium">Category Name</label>
                      <Input 
                        id="categoryName" 
                        name="name" 
                        value={categoryForm.name} 
                        onChange={handleCategoryFormChange}
                        placeholder="Living Room"
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setCategoryForm({ name: '' });
                        setSelectedCategory(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={selectedCategory ? handleUpdateCategory : handleAddCategory}
                      disabled={!categoryForm.name}
                    >
                      {selectedCategory ? 'Update Category' : 'Add Category'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            {/* Categories Table */}
            {isLoadingCategories ? (
              <div className="text-center py-12">Loading categories...</div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Products</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories && categories.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-8">
                          No categories available
                        </TableCell>
                      </TableRow>
                    ) : (
                      categories?.map((category) => {
                        const productCount = products?.filter(p => p.category_id === category.id).length || 0;
                        
                        return (
                          <TableRow key={category.id} className="hover:bg-muted/40 transition-colors duration-200">
                            <TableCell className="font-medium">{category.name}</TableCell>
                            <TableCell>{productCount}</TableCell>
                            <TableCell className="flex space-x-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleEditCategory(category)}
                                className="hover:bg-primary/10 transition-colors duration-200"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => {
                                  if (productCount > 0) {
                                    toast.error(`Cannot delete category with ${productCount} products`);
                                    return;
                                  }
                                  
                                  if (window.confirm(`Are you sure you want to delete ${category.name}?`)) {
                                    deleteCategoryMutation.mutate(category.id);
                                  }
                                }}
                                className="hover:bg-destructive/10 text-destructive transition-colors duration-200"
                                disabled={productCount > 0}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </>
  );
};

export default AdminDashboard;
