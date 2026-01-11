'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Command } from '@/components/ui/command';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Popover from '@radix-ui/react-popover';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import * as Switch from '@radix-ui/react-switch';
import * as Slider from '@radix-ui/react-slider';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { Plus, Search, Filter, ChevronRight, Menu, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const formSchema = z.object({
  productName: z.string().min(2, {
    message: 'Product name must be at least 2 characters.',
  }),
  quantity: z.number().min(1, {
    message: 'Quantity must be at least 1.',
  }),
});
type FormData = z.infer<typeof formSchema>;

const SubscriptionBoxPlatform = () => {
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<FormData[]>([]);
  const [filterText, setFilterText] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const router = useRouter();

  useEffect(() => {
    // Simulate data fetching
    const fetchData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setProducts([
        { productName: 'Gourmet Chocolates', quantity: 12 },
        { productName: 'Organic Tea Set', quantity: 6 },
        { productName: 'Artisanal Cheese Platter', quantity: 4 },
        { productName: 'Luxury Candle Collection', quantity: 8 },
      ]);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const handleAddProduct = (data: FormData) => {
    setProducts([...products, data]);
    setIsAddingProduct(false);
  };

  const handleDeleteProduct = (index: number) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };

  const filteredProducts = products.filter(product =>
    product.productName.toLowerCase().includes(filterText.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.productName.localeCompare(b.productName);
    }
    return b.productName.localeCompare(a.productName);
  });

  const form = useForm<FormData>({ resolver: zodResolver(formSchema), defaultValues: { productName: '', quantity: 1 } });

  return (
    <div className='bg-gradient-to-b from-[#5BC0BE] to-[#FF6B6B] min-h-screen text-white'>
      <header className='sticky top-0 bg-white text-black flex items-center justify-between px-4 py-2 shadow-xl z-10'>
        <div className='flex items-center gap-4'>
          <img src='/logo.png' alt='Logo' className='w-10 h-10 rounded-full' />
          <span className='font-bold text-2xl'>Subscription Box</span>
        </div>
        <div className='flex items-center gap-4'>
          <Search className='w-5 h-5' /> <input
            type='text'
            placeholder='Search...'
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
            className='border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-accent'
          /> <button onClick={() => setIsAddingProduct(true)} className='bg-primary text-white px-4 py-2 rounded-full hover:bg-secondary transition-colors duration-300'>
            <Plus className='mr-2 w-4 h-4' /> Add Product
          </button>
        </div>
        <div className='flex items-center gap-2'>
          <Avatar className='cursor-pointer'>
            <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <ChevronRight className='w-5 h-5' />
        </div>
      </header>
      <aside className='hidden md:flex flex-col bg-white text-black w-64 p-4 shadow-xl'>
        <nav className='space-y-2'>
          <a href='#' className='block px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-300'>Dashboard</a>
          <a href='#' className='block px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-300'>Subscriptions</a>
          <a href='#' className='block px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-300'>Customers</a>
          <a href='#' className='block px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-300'>Analytics</a>
        </nav>
      </aside>
      <main className='p-4 md:ml-64'>
        <section className='mb-8'>
          <h1 className='text-3xl font-bold mb-4'>Manage Products</h1>
          {isLoading ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
              {[...Array(6)].map((_, index) => (
                <Skeleton key={index} className='aspect-square rounded-lg animate-pulse' />
              ))}
            </div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
              {sortedProducts.map((product, index) => (
                <Card key={index} className='shadow-xl rounded-lg overflow-hidden'>
                  <CardHeader className='bg-white text-black p-4'>
                    <CardTitle>{product.productName}</CardTitle>
                    <CardDescription>Quantity: {product.quantity}</CardDescription>
                  </CardHeader>
                  <CardContent className='p-4'>
                    <Progress value={(product.quantity / 20) * 100} className='bg-gray-200' />
                  </CardContent>
                  <CardFooter className='p-4 flex justify-end'>
                    <Button variant='ghost' size='icon' className='hover:text-red-500' aria-label='Delete product' onClick={() => handleDeleteProduct(index)}> <Trash2 className='w-4 h-4' />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </section>
        <section>
          <h1 className='text-3xl font-bold mb-4'>Recent Orders</h1>
          <Table className='bg-white text-black rounded-lg shadow-xl'>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[100px]'>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className='font-medium'>01</TableCell>
                <TableCell>John Doe</TableCell>
                <TableCell>Jan 23, 2023</TableCell>
                <TableCell><Badge variant='success'>Paid</Badge></TableCell>
                <TableCell className='text-right'><CheckCircle className='w-4 h-4 mr-2' /></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='font-medium'>02</TableCell>
                <TableCell>Jane Smith</TableCell>
                <TableCell>Feb 14, 2023</TableCell>
                <TableCell><Badge variant='secondary'>Pending</Badge></TableCell>
                <TableCell className='text-right'><XCircle className='w-4 h-4 mr-2' /></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </section>
      </main>
      <footer className='fixed bottom-0 left-0 right-0 bg-white text-black p-4 text-center shadow-xl'>
        &copy; 2023 Subscription Box. All rights reserved.
      </footer>
      <Dialog open={isAddingProduct} onOpenChange={setIsAddingProduct}>
        <DialogContent className='bg-white text-black max-w-md rounded-lg p-6 shadow-xl'>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>Create a new product to add to your subscription box.</DialogDescription>
          <Form {...form}> <form onSubmit={form.handleSubmit(handleAddProduct)} className='space-y-4 mt-4'>
              <FormField control={form.control} name='productName' render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter product name...' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name='quantity' render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input type='number' placeholder='Enter quantity...' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <DialogFooter className='mt-4'>
                <DialogClose asChild>
                  <Button type='button' variant='secondary'>Cancel</Button>
                </DialogClose>
                <Button type='submit'>Save Product</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionBoxPlatform;