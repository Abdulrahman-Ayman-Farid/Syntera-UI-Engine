'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import * as Dialog from '@radix-ui/react-dialog';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { LucidePlus, LucideSearch, LucideFilter, LucideChevronRight, LucideHeart, LucideShoppingCart, LucideUser } from 'lucide-react';

const mockProducts = [
  { id: 1, name: 'Product 1', price: '$29.99', image: '/images/product1.jpg' },
  { id: 2, name: 'Product 2', price: '$49.99', image: '/images/product2.jpg' },
  { id: 3, name: 'Product 3', price: '$19.99', image: '/images/product3.jpg' }
];

const VendorMarketplace = () => {
  const [products, setProducts] = useState(mockProducts);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter((product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, products]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleAddToCart = (productId: number) => {
    console.log(`Added product ${productId} to cart`);
  };

  return (
    <div className='bg-gradient-to-tr from-cyan-100 via-blue-200 to-indigo-200 min-h-screen'>
      <header className='p-6 flex justify-between items-center'>
        <div className='flex gap-4'>
          <LucideUser size={24} className='text-primary' /> <span className='font-bold text-xl'>Vendor Marketplace</span>
        </div>
        <nav className='space-x-4'>
          <Button variant='default' onClick={() => router.push('/dashboard')}>Dashboard</Button>
          <Button variant='outline'>Profile</Button>
        </nav>
      </header>
      <main className='px-6 pb-12'>
        <div className='mb-8'>
          <Input
            placeholder='Search products...'
            onChange={handleSearchChange}
            value={searchTerm}
            className='w-full sm:w-auto'
            aria-label='Search products'
          />
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger>
                <LucideSearch size={24} className='ml-2 cursor-pointer text-gray-500' />
              </TooltipTrigger>
              <TooltipContent>
                <p>Search for products by name</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Tabs defaultValue='all'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='all'>All Products</TabsTrigger>
            <TabsTrigger value='featured'>Featured</TabsTrigger>
          </TabsList>
          <TabsContent value='all'>
            {isLoading ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {[1, 2, 3, 4].map((item) => (
                  <Skeleton key={item} className='aspect-square rounded-xl' />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {filteredProducts.map((product) => (
                  <Card key={product.id} className='shadow-xl hover:shadow-2xl transition-transform transform hover:-translate-y-1 rounded-xl'>
                    <CardContent className='relative'>
                      <img src={product.image} alt={product.name} className='w-full aspect-square object-cover rounded-t-xl' />
                      <div className='absolute top-4 right-4'>
                        <Button variant='ghost' aria-label={`Add ${product.name} to favorites`}>
                          <LucideHeart size={24} className='text-primary' />
                        </Button>
                      </div>
                    </CardContent>
                    <CardFooter className='p-4'>
                      <div className='flex justify-between items-center'>
                        <div className='flex flex-col'>
                          <CardTitle>{product.name}</CardTitle>
                          <CardDescription>{product.price}</CardDescription>
                        </div>
                        <Button variant='default' onClick={() => handleAddToCart(product.id)}>
                          <LucideShoppingCart size={16} className='mr-2' /> Add to Cart
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className='text-center p-8'>
                <h2 className='text-2xl font-semibold'>No products found</h2>
                <p className='mt-2 text-gray-500'>Try searching for something else.</p>
              </div>
            )}
          </TabsContent>
          <TabsContent value='featured'>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
              {mockProducts.slice(0, 4).map((product) => (
                <Card key={product.id} className='shadow-xl hover:shadow-2xl transition-transform transform hover:-translate-y-1 rounded-xl'>
                  <CardContent className='relative'>
                    <img src={product.image} alt={product.name} className='w-full aspect-square object-cover rounded-t-xl' />
                    <div className='absolute top-4 right-4'>
                      <Button variant='ghost' aria-label={`Add ${product.name} to favorites`}>
                        <LucideHeart size={24} className='text-primary' />
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter className='p-4'>
                    <div className='flex justify-between items-center'>
                      <div className='flex flex-col'>
                        <CardTitle>{product.name}</CardTitle>
                        <CardDescription>{product.price}</CardDescription>
                      </div>
                      <Button variant='default' onClick={() => handleAddToCart(product.id)}>
                        <LucideShoppingCart size={16} className='mr-2' /> Add to Cart
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <footer className='bg-background p-4 text-center'>
        <p>&copy; 2023 Vendor Marketplace. All rights reserved.</p>
      </footer>
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Trigger asChild>
          <Button className='fixed bottom-8 right-8'><LucidePlus size={24} /></Button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className='fixed inset-0 bg-black opacity-50' />
          <Dialog.Content className='fixed left-[50%] top-[50%] max-h-[85vh] w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg outline-none animate-in fade-in-90 slide-in-from-bottom-10 sm:slide-in-from-left-10 duration-300'>
            <Dialog.Title className='text-lg font-semibold'>Add New Product</Dialog.Title>
            <Dialog.Description className='mt-2 text-slate-500'>Fill out the form below to add a new product to your marketplace.</Dialog.Description>
            <form onSubmit={(e) => e.preventDefault()} className='mt-4 space-y-4'>
              <div>
                <label htmlFor='name' className='block text-sm font-medium leading-6 text-gray-900'>Name</label>
                <div className='mt-2'>
                  <Input id='name' placeholder='Product Name' className='w-full' required />
                </div>
              </div>
              <div>
                <label htmlFor='price' className='block text-sm font-medium leading-6 text-gray-900'>Price</label>
                <div className='mt-2'>
                  <Input id='price' type='number' step='0.01' placeholder='$0.00' className='w-full' required />
                </div>
              </div>
              <div>
                <label htmlFor='image' className='block text-sm font-medium leading-6 text-gray-900'>Image URL</label>
                <div className='mt-2'>
                  <Input id='image' placeholder='https://example.com/image.jpg' className='w-full' required />
                </div>
              </div>
              <Button type='submit' className='w-full'>Add Product</Button>
            </form>
            <Dialog.Close className='text-violet11 absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-violet7 focus:ring-offset-4 disabled:pointer-events-none'>Close</Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default VendorMarketplace;