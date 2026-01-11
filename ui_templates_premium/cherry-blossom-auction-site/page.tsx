'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import * as Dialog from '@radix-ui/react-dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Search, Filter, ChevronRight, DollarSign, ClockIcon, UserCircle, FolderPlus, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

const mockProducts = [
  { id: 1, name: 'Vintage Camera', currentBid: '$500', highestBidder: 'John Doe', endTime: '2023-12-31T12:00:00Z', imageUrl: '/images/camera.jpg' },
  { id: 2, name: 'Art Deco Desk', currentBid: '$800', highestBidder: 'Jane Smith', endTime: '2023-12-31T15:00:00Z', imageUrl: '/images/desk.jpg' },
  { id: 3, name: 'Retro Typewriter', currentBid: '$300', highestBidder: 'Alice Johnson', endTime: '2023-12-31T18:00:00Z', imageUrl: '/images/typewriter.jpg' }
];

export default function AuctionPage() {
  const router = useRouter();
  const [products, setProducts] = useState(mockProducts);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [activeTab, setActiveTab] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setIsLoading(false);
      setFilteredProducts(products);
    }, 2000);
  }, [products]);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  const handleProductClick = (productId) => {
    router.push(`/product/${productId}`);
  };

  return (
    <div className='bg-white text-gray-900 min-h-screen'>
      <aside className='fixed inset-y-0 left-0 w-64 bg-gradient-to-l from-#FFB3BA via-#FFDFDD to-#FFF1D0 shadow-lg overflow-y-auto md:block hidden'>
        <div className='py-4 px-6'>
          <h1 className='text-2xl font-bold mb-4'>Auction House</h1>
          <ul className='space-y-2'>
            <li className='flex items-center gap-2'>
              <FolderPlus className='w-5 h-5' /> Home
            </li>
            <li className='flex items-center gap-2'>
              <RefreshCw className='w-5 h-5' /> Live Auctions
            </li>
            <li className='flex items-center gap-2'>
              <UserCircle className='w-5 h-5' /> My Bids
            </li>
          </ul>
        </div>
      </aside>
      <main className='md:ml-64 p-4'>
        <header className='mb-8'>
          <h1 className='text-3xl font-extrabold mb-4'>Live Auctions</h1>
          <p className='text-lg'>Explore our latest auctions and place your bids now!</p>
        </header>
        <div className='flex justify-between mb-6'>
          <Input
            type='text'
            placeholder='Search...'
            value={searchTerm}
            onChange={handleSearchChange}
            className='shadow-lg rounded-full px-4 py-2 flex-grow mr-4'
          />
          <Button variant='default' onClick={() => setIsDialogOpen(true)} className='shadow-lg rounded-full'>
            <Plus className='mr-2' /> Add Product
          </Button>
        </div>
        <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className='shadow-lg rounded-lg'>
          <TabsList className='grid grid-cols-3'>
            <TabsTrigger value='all'>All</TabsTrigger>
            <TabsTrigger value='live'>Live</TabsTrigger>
            <TabsTrigger value='upcoming'>Upcoming</TabsTrigger>
          </TabsList>
          <TabsContent value='all'>
            {isLoading ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                {[1, 2, 3].map((item) => (
                  <Skeleton key={item} className='aspect-square animate-pulse rounded-lg' />
                ))}
              </div>
            ) : (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                {filteredProducts.map((product) => (
                  <Card
                    key={product.id}
                    className='cursor-pointer shadow-lg hover:shadow-2xl transition-transform duration-300 ease-in-out transform hover:-translate-y-2'
                    onClick={() => handleProductClick(product.id)}
                  >
                    <CardHeader className='relative'>
                      <img src={product.imageUrl} alt={product.name} className='object-cover w-full aspect-square' />
                      <Badge className='absolute bottom-2 right-2 bg-accent text-primary'>{product.highestBidder}</Badge>
                    </CardHeader>
                    <CardContent className='pb-4'>
                      <CardTitle>{product.name}</CardTitle>
                      <div className='mt-2 flex items-center space-x-2'>
                        <DollarSign className='w-4 h-4' /> <span className='font-semibold'>{product.currentBid}</span>
                      </div>
                      <div className='mt-1 flex items-center space-x-2'>
                        <ClockIcon className='w-4 h-4' /> <span className='text-sm'>{new Date(product.endTime).toLocaleString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value='live'>
            <p>Live Auctions Content</p>
          </TabsContent>
          <TabsContent value='upcoming'>
            <p>Upcoming Auctions Content</p>
          </TabsContent>
        </Tabs>
      </main>
      <footer className='bg-gradient-to-l from-#FFB3BA via-#FFDFDD to-#FFF1D0 p-4 text-center mt-auto'>
        <p>&copy; 2023 Auction House. All rights reserved.</p>
      </footer>
      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className='fixed inset-0 bg-black opacity-50' />
          <Dialog.Content className='fixed top-[50%] left-[50%] max-h-[85vh] w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-2xl focus:outline-none'>
            <Dialog.Title className='text-xl font-bold mb-4'>Add New Product</Dialog.Title>
            <form className='space-y-4'>
              <Input label='Product Name' placeholder='Enter product name...' />
              <Input label='Starting Bid' placeholder='$0.00' />
              <Input label='End Time' type='datetime-local' />
              <Input label='Image URL' placeholder='https://example.com/image.jpg' />
              <div className='flex justify-end'>
                <Button variant='outline' onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type='submit' className='ml-4'>Submit</Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}