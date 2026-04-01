import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from 'sonner';
import { User, Package, CreditCard, Heart, LogOut, Settings } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const Account = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // ── Active tab (single source of truth for sidebar + content) ──
  const [activeTab, setActiveTab] = useState('profile');

  // ── Profile state (starts empty, not hardcoded) ──
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  // ── Password state ──
  const [passwords, setPasswords] = useState({
    current: '',
    newPass: '',
    confirm: ''
  });

  // ── Settings state (controlled checkboxes) ──
  const [settings, setSettings] = useState({
    marketing: true,
    orderUpdates: true,
    newsletter: true,
    cookies: true,
    sharing: false
  });

  // ── Payment state ──
  const [paymentForm, setPaymentForm] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });
  const [savedCards, setSavedCards] = useState<{ cardName: string; last4: string; expiry: string }[]>([]);
  const [isAddingCard, setIsAddingCard] = useState(false);

  // ── Handlers ──
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
      toast.success('Successfully logged out');
    } catch {
      toast.error('Error logging out');
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    if (!profile.firstName.trim() || !profile.lastName.trim()) {
      toast.error('First and last name are required');
      return;
    }
    setIsEditingProfile(false);
    toast.success('Profile saved successfully');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwords.current) { toast.error('Enter your current password'); return; }
    if (passwords.newPass.length < 6) { toast.error('New password must be at least 6 characters'); return; }
    if (passwords.newPass !== passwords.confirm) { toast.error('Passwords do not match'); return; }
    setPasswords({ current: '', newPass: '', confirm: '' });
    toast.success('Password changed successfully');
  };

  const handleSettingsChange = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveSettings = () => {
    toast.success('Preferences saved successfully');
  };

  const handlePaymentFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCard = () => {
    if (!paymentForm.cardName || !paymentForm.cardNumber || !paymentForm.expiry || !paymentForm.cvv) {
      toast.error('Please fill in all card details');
      return;
    }
    const last4 = paymentForm.cardNumber.replace(/\s/g, '').slice(-4);
    setSavedCards(prev => [...prev, { cardName: paymentForm.cardName, last4, expiry: paymentForm.expiry }]);
    setPaymentForm({ cardName: '', cardNumber: '', expiry: '', cvv: '' });
    setIsAddingCard(false);
    toast.success('Payment method added');
  };

  const handleRemoveCard = (index: number) => {
    setSavedCards(prev => prev.filter((_, i) => i !== index));
    toast.success('Card removed');
  };

  // ── Sample orders ──
  const orders = [
    { id: "ORD-12345", date: "March 15, 2024", total: 349.98, status: "Delivered", items: 2 },
    { id: "ORD-12346", date: "February 28, 2024", total: 1249.99, status: "Processing", items: 1 },
    { id: "ORD-12347", date: "January 10, 2024", total: 199.95, status: "Delivered", items: 3 }
  ];

  const navItems = [
    { value: 'profile', label: 'Profile', icon: User },
    { value: 'orders', label: 'Orders', icon: Package },
    { value: 'payment', label: 'Payment Methods', icon: CreditCard },
    { value: 'wishlist', label: 'Wishlist', icon: Heart },
    { value: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      <NavBar />

      <main className="container py-8 mt-16">
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
          {/* ── Sidebar ── */}
          <aside className="md:w-64 shrink-0">
            <div className="mb-6 p-6 bg-muted/30 rounded-lg text-center">
              <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <User className="h-10 w-10 text-primary" />
              </div>
              <h2 className="font-medium">
                {profile.firstName || profile.lastName
                  ? `${profile.firstName} ${profile.lastName}`.trim()
                  : 'Your Name'}
              </h2>
              <p className="text-sm text-muted-foreground">{profile.email || user?.email || 'your@email.com'}</p>
            </div>

            <nav className="flex flex-col gap-1">
              {navItems.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setActiveTab(value)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-colors w-full text-left
                    ${activeTab === value
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted text-foreground'
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </nav>

            <Button variant="outline" className="w-full mt-6" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Log Out
            </Button>
          </aside>

          {/* ── Main Content ── */}
          <div className="flex-1 min-w-0">

            {/* Profile */}
            {activeTab === 'profile' && (
              <div className="bg-card rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">Personal Information</h2>
                  {!isEditingProfile ? (
                    <Button variant="outline" onClick={() => setIsEditingProfile(true)}>
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setIsEditingProfile(false)}>Cancel</Button>
                      <Button onClick={handleSaveProfile}>Save Changes</Button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" name="firstName" value={profile.firstName}
                      onChange={handleProfileChange} disabled={!isEditingProfile}
                      placeholder="Enter first name" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" name="lastName" value={profile.lastName}
                      onChange={handleProfileChange} disabled={!isEditingProfile}
                      placeholder="Enter last name" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" value={profile.email}
                      onChange={handleProfileChange} disabled={!isEditingProfile}
                      placeholder="Enter email address" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" value={profile.phone}
                      onChange={handleProfileChange} disabled={!isEditingProfile}
                      placeholder="Enter phone number" />
                  </div>
                </div>

                <Separator className="my-8" />

                <h3 className="text-xl font-medium mb-6">Address Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 space-y-1">
                    <Label htmlFor="address">Street Address</Label>
                    <Input id="address" name="address" value={profile.address}
                      onChange={handleProfileChange} disabled={!isEditingProfile}
                      placeholder="Enter street address" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" name="city" value={profile.city}
                      onChange={handleProfileChange} disabled={!isEditingProfile}
                      placeholder="Enter city" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="state">State / Province</Label>
                    <Input id="state" name="state" value={profile.state}
                      onChange={handleProfileChange} disabled={!isEditingProfile}
                      placeholder="Enter state or province" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="zipCode">Zip / Postal Code</Label>
                    <Input id="zipCode" name="zipCode" value={profile.zipCode}
                      onChange={handleProfileChange} disabled={!isEditingProfile}
                      placeholder="Enter zip or postal code" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" name="country" value={profile.country}
                      onChange={handleProfileChange} disabled={!isEditingProfile}
                      placeholder="Enter country" />
                  </div>
                </div>

                <Separator className="my-8" />

                <h3 className="text-xl font-medium mb-6">Change Password</h3>
                <form onSubmit={handleChangePassword} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <Label htmlFor="current">Current Password</Label>
                    <Input id="current" name="current" type="password"
                      value={passwords.current} onChange={handlePasswordChange}
                      placeholder="Enter current password" />
                  </div>
                  <div className="md:col-span-2"><Separator /></div>
                  <div className="space-y-1">
                    <Label htmlFor="newPass">New Password</Label>
                    <Input id="newPass" name="newPass" type="password"
                      value={passwords.newPass} onChange={handlePasswordChange}
                      placeholder="Enter new password" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="confirm">Confirm New Password</Label>
                    <Input id="confirm" name="confirm" type="password"
                      value={passwords.confirm} onChange={handlePasswordChange}
                      placeholder="Confirm new password" />
                  </div>
                  <div>
                    <Button type="submit">Change Password</Button>
                  </div>
                </form>
              </div>
            )}

            {/* Orders */}
            {activeTab === 'orders' && (
              <div className="bg-card rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-6">Order History</h2>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                    <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
                    <Button asChild><a href="/products">Start Shopping</a></Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-5">
                        <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium">Order {order.id}</h3>
                              <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                                order.status === 'Delivered'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {order.status}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Placed on {order.date} · {order.items} item{order.items > 1 ? 's' : ''}
                            </p>
                          </div>
                          <span className="font-semibold mt-2 md:mt-0">{formatCurrency(order.total)}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">View Order</Button>
                          <Button variant="outline" size="sm">Track Package</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Payment Methods */}
            {activeTab === 'payment' && (
              <div className="bg-card rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">Payment Methods</h2>
                  {!isAddingCard && (
                    <Button onClick={() => setIsAddingCard(true)}>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Add Card
                    </Button>
                  )}
                </div>

                {isAddingCard && (
                  <div className="border rounded-lg p-5 mb-6 bg-muted/20">
                    <h3 className="font-medium mb-4">Add New Card</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2 space-y-1">
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input id="cardName" name="cardName" value={paymentForm.cardName}
                          onChange={handlePaymentFormChange} placeholder="John Doe" />
                      </div>
                      <div className="md:col-span-2 space-y-1">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input id="cardNumber" name="cardNumber" value={paymentForm.cardNumber}
                          onChange={handlePaymentFormChange} placeholder="1234 5678 9012 3456"
                          maxLength={19} />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" name="expiry" value={paymentForm.expiry}
                          onChange={handlePaymentFormChange} placeholder="MM/YY" maxLength={5} />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" name="cvv" value={paymentForm.cvv}
                          onChange={handlePaymentFormChange} placeholder="123" maxLength={4} />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button onClick={handleAddCard}>Save Card</Button>
                      <Button variant="outline" onClick={() => { setIsAddingCard(false); setPaymentForm({ cardName: '', cardNumber: '', expiry: '', cvv: '' }); }}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {savedCards.length === 0 && !isAddingCard ? (
                  <div className="text-center py-12">
                    <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No payment methods saved</h3>
                    <p className="text-muted-foreground">Click "Add Card" to save a payment method.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {savedCards.map((card, i) => (
                      <div key={i} className="border rounded-lg p-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <CreditCard className="h-6 w-6 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{card.cardName}</p>
                            <p className="text-sm text-muted-foreground">•••• •••• •••• {card.last4} · Expires {card.expiry}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive"
                          onClick={() => handleRemoveCard(i)}>
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Wishlist */}
            {activeTab === 'wishlist' && (
              <div className="bg-card rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-6">Wishlist</h2>
                <div className="text-center py-12">
                  <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Your Wishlist</h3>
                  <p className="text-muted-foreground mb-4">Manage your saved items.</p>
                  <Button asChild><a href="/wishlist">View Wishlist</a></Button>
                </div>
              </div>
            )}

            {/* Settings */}
            {activeTab === 'settings' && (
              <div className="bg-card rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-6">Account Settings</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Email Preferences</h3>
                    <div className="space-y-3">
                      {([
                        { key: 'marketing', label: 'Receive marketing emails and special offers' },
                        { key: 'orderUpdates', label: 'Receive order status updates' },
                        { key: 'newsletter', label: 'Subscribe to newsletter' },
                      ] as const).map(({ key, label }) => (
                        <label key={key} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={settings[key]}
                            onChange={() => handleSettingsChange(key)}
                            className="rounded" />
                          <span className="text-sm">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-4">Privacy Settings</h3>
                    <div className="space-y-3">
                      {([
                        { key: 'cookies', label: 'Allow cookies for personalized experience' },
                        { key: 'sharing', label: 'Allow data sharing with trusted partners' },
                      ] as const).map(({ key, label }) => (
                        <label key={key} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={settings[key]}
                            onChange={() => handleSettingsChange(key)}
                            className="rounded" />
                          <span className="text-sm">{label}</span>
                        </label>
                      ))}
                    </div>
                    <Button className="mt-4" onClick={handleSaveSettings}>
                      Save Preferences
                    </Button>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-2 text-destructive">Manage Account</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Account;