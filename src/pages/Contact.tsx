
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Mail, Phone, MapPin } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name is required' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  subject: z.string().min(5, { message: 'Subject is required' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' })
});

const Contact = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: ''
    }
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
    toast.success('Your message has been sent! We\'ll get back to you soon.');
    form.reset();
  };

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
              <BreadcrumbPage>Contact</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
          <p className="text-lg mb-10 max-w-2xl">
            We'd love to hear from you! Whether you have a question about our products, 
            delivery, or returns, our team is ready to assist you.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="p-6 bg-muted/30 rounded-lg text-center">
              <Mail className="mx-auto h-8 w-8 mb-3 text-primary" />
              <h3 className="font-medium text-lg mb-2">Email</h3>
              <p className="text-muted-foreground">support@comfycube.com</p>
              <p className="text-muted-foreground">sales@comfycube.com</p>
            </div>
            
            <div className="p-6 bg-muted/30 rounded-lg text-center">
              <Phone className="mx-auto h-8 w-8 mb-3 text-primary" />
              <h3 className="font-medium text-lg mb-2">Phone</h3>
              <p className="text-muted-foreground">Toll-free: (800) 123-4567</p>
              <p className="text-muted-foreground">International: +1 (555) 987-6543</p>
            </div>
            
            <div className="p-6 bg-muted/30 rounded-lg text-center">
              <MapPin className="mx-auto h-8 w-8 mb-3 text-primary" />
              <h3 className="font-medium text-lg mb-2">Visit Us</h3>
              <p className="text-muted-foreground">123 Design District Avenue</p>
              <p className="text-muted-foreground">San Francisco, CA 94103</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-semibold mb-6">Send a Message</h2>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Email</FormLabel>
                          <FormControl>
                            <Input placeholder="you@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input placeholder="How can we help you?" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Message</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Please provide details about your inquiry..." rows={5} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button type="submit">Send Message</Button>
                </form>
              </Form>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">What are your shipping options?</h3>
                  <p className="text-muted-foreground">
                    We offer standard shipping (5-7 business days), express shipping (2-3 business days), 
                    and premium delivery with white-glove service for larger furniture pieces.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Do you offer assembly services?</h3>
                  <p className="text-muted-foreground">
                    Yes, we offer optional assembly services for most furniture items. 
                    You can select this option during checkout for an additional fee.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">What is your return policy?</h3>
                  <p className="text-muted-foreground">
                    We offer a 30-day return policy for most items in their original condition. 
                    Custom orders cannot be returned unless damaged or defective.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Do you ship internationally?</h3>
                  <p className="text-muted-foreground">
                    Yes, we ship to select international destinations. Shipping costs and 
                    delivery times vary by location. Please contact us for specific details.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">How can I track my order?</h3>
                  <p className="text-muted-foreground">
                    Once your order ships, you'll receive a tracking number via email. 
                    You can also check your order status in your account dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Contact;
