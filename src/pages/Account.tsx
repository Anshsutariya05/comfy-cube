
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from 'sonner';
import { User, Package, CreditCard, Heart, LogOut, Settings } from 'lucide-react';

const Account = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: user?.email || "john.doe@example.com",
    phone: "555-123-4567",
    address: "123 Main St, Apt 4B",
    city: "San Francisco",
    state: "CA",
    zipCode: "94105",
    country: "United States"
  });
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
      toast.success('Successfully logged out');
    } catch (error) {
      toast.error('Error logging out');
    }
  };
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSaveProfile = () => {
    setIsEditingProfile(false);
    toast.success('Profile updated successfully');
  };
  
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Password changed successfully');
  };
  
  // Sample orders data for demonstration
  const orders = [
    {
      id: "ORD-12345",
      date: "March 15, 2024",
      total: 349.98,
      status: "Delivered",
      items: 2
    },
    {
      id: "ORD-12346",
      date: "February 28, 2024",
      total: 1249.99,
      status: "Processing",
      items: 1
    },
    {
      id: "ORD-12347",
      date: "January 10, 2024",
      total: 199.95,
      status: "Delivered",
      items: 3
    }
  ];
  
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
              <BreadcrumbPage>My Account</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="md:w-64">
            <div className="mb-6 p-6 bg-muted/30 rounded-lg text-center">
              <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <User className="h-10 w-10 text-primary" />
              </div>
              <h2 className="font-medium">
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
            </div>
            
            <Tabs defaultValue="profile" orientation="vertical" className="w-full">
              <TabsList className="w-full flex flex-col h-auto">
                <TabsTrigger value="profile" className="justify-start">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="orders" className="justify-start">
                  <Package className="h-4 w-4 mr-2" />
                  Orders
                </TabsTrigger>
                <TabsTrigger value="payment" className="justify-start">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Payment Methods
                </TabsTrigger>
                <TabsTrigger value="wishlist" className="justify-start">
                  <Heart className="h-4 w-4 mr-2" />
                  Wishlist
                </TabsTrigger>
                <TabsTrigger value="settings" className="justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Button 
              variant="outline" 
              className="w-full mt-6"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Log Out
            </Button>
          </aside>
          
          <div className="flex-1">
            <Tabs defaultValue="profile">
              <TabsContent value="profile" className="p-0">
                <div className="bg-card rounded-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Personal Information</h2>
                    {!isEditingProfile ? (
                      <Button variant="outline" onClick={() => setIsEditingProfile(true)}>
                        Edit Profile
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSaveProfile}>
                          Save Changes
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={profile.firstName}
                        onChange={handleProfileChange}
                        disabled={!isEditingProfile}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={profile.lastName}
                        onChange={handleProfileChange}
                        disabled={!isEditingProfile}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profile.email}
                        onChange={handleProfileChange}
                        disabled={!isEditingProfile}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={profile.phone}
                        onChange={handleProfileChange}
                        disabled={!isEditingProfile}
                      />
                    </div>
                  </div>
                  
                  <Separator className="my-8" />
                  
                  <h3 className="text-xl font-medium mb-6">Address Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <Label htmlFor="address">Street Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={profile.address}
                        onChange={handleProfileChange}
                        disabled={!isEditingProfile}
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={profile.city}
                        onChange={handleProfileChange}
                        disabled={!isEditingProfile}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State/Province</Label>
                      <Input
                        id="state"
                        name="state"
                        value={profile.state}
                        onChange={handleProfileChange}
                        disabled={!isEditingProfile}
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">Zip/Postal Code</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={profile.zipCode}
                        onChange={handleProfileChange}
                        disabled={!isEditingProfile}
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        name="country"
                        value={profile.country}
                        onChange={handleProfileChange}
                        disabled={!isEditingProfile}
                      />
                    </div>
                  </div>
                  
                  <Separator className="my-8" />
                  
                  <h3 className="text-xl font-medium mb-6">Change Password</h3>
                  <form onSubmit={handleChangePassword} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        placeholder="Enter current password"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Separator className="my-2" />
                    </div>
                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="Enter new password"
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm new password"
                      />
                    </div>
                    <div>
                      <Button type="submit">Change Password</Button>
                    </div>
                  </form>
                </div>
              </TabsContent>
              
              <TabsContent value="orders" className="p-0">
                <div className="bg-card rounded-lg p-6">
                  <h2 className="text-2xl font-semibold mb-6">Order History</h2>
                  
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                      <p className="text-muted-foreground mb-4">
                        You haven't placed any orders yet.
                      </p>
                      <Button asChild>
                        <a href="/products">Start Shopping</a>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-6">
                          <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">Order {order.id}</h3>
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  order.status === "Delivered" 
                                    ? "bg-green-100 text-green-800" 
                                    : "bg-amber-100 text-amber-800"
                                }`}>
                                  {order.status}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Placed on {order.date} ({order.items} items)
                              </p>
                            </div>
                            <div className="mt-4 md:mt-0">
                              <span className="font-semibold">${order.total.toFixed(2)}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              View Order
                            </Button>
                            <Button variant="outline" size="sm">
                              Track Package
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="payment" className="p-0">
                <div className="bg-card rounded-lg p-6">
                  <h2 className="text-2xl font-semibold mb-6">Payment Methods</h2>
                  
                  <div className="text-center py-12">
                    <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No payment methods saved</h3>
                    <p className="text-muted-foreground mb-4">
                      You haven't saved any payment methods yet.
                    </p>
                    <Button>Add Payment Method</Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="wishlist" className="p-0">
                <div className="bg-card rounded-lg p-6">
                  <h2 className="text-2xl font-semibold mb-6">Wishlist</h2>
                  
                  <div className="text-center py-12">
                    <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Your wishlist</h3>
                    <p className="text-muted-foreground mb-4">
                      Manage your wishlist items.
                    </p>
                    <Button asChild>
                      <a href="/wishlist">View Wishlist</a>
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="settings" className="p-0">
                <div className="bg-card rounded-lg p-6">
                  <h2 className="text-2xl font-semibold mb-6">Account Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Email Preferences</h3>
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="marketing"
                            className="mr-2"
                            defaultChecked
                          />
                          <Label htmlFor="marketing">
                            Receive marketing emails and special offers
                          </Label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="orderUpdates"
                            className="mr-2"
                            defaultChecked
                          />
                          <Label htmlFor="orderUpdates">
                            Receive order status updates
                          </Label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="newsletter"
                            className="mr-2"
                            defaultChecked
                          />
                          <Label htmlFor="newsletter">
                            Subscribe to newsletter
                          </Label>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Privacy Settings</h3>
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="cookies"
                            className="mr-2"
                            defaultChecked
                          />
                          <Label htmlFor="cookies">
                            Allow cookies for personalized experience
                          </Label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="sharing"
                            className="mr-2"
                          />
                          <Label htmlFor="sharing">
                            Allow data sharing with trusted partners
                          </Label>
                        </div>
                      </div>
                      <Button className="mt-4">
                        Save Preferences
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4 text-destructive">Danger Zone</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                      <Button variant="destructive">
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Account;
