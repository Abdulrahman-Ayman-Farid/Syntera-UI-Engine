'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import * as Dialog from '@radix-ui/react-dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { lucide } from 'lucide-react';
import { Plus, Search, Filter, ChevronRight, ClockIcon, DollarSignIcon } from 'lucide-react';

const AuctionSite = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('live-auctions');

  const mockProducts = [
    { id: 1, name: 'Vintage Watch', currentBid: '$120', timeLeft: '1h 30m', imageUrl: '/watch.jpg' },
    { id: 2, name: 'Classic Car Model', currentBid: '$85', timeLeft: '2h 15m', imageUrl: '/car-model.jpg' },
    { id: 3, name: 'Art Deco Lamp', currentBid: '$95', timeLeft: '45m', imageUrl: '/lamp.jpg' }
  ];

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      try {
        setFilteredProducts(mockProducts);
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    }, 2000);
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    filterProducts(event.target.value);
  };

  const filterProducts = (term) => {
    if (!term) {
      setFilteredProducts(mockProducts);
      return;
    }
    const filtered = mockProducts.filter((product) =>
      product.name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const renderProductCards = () => {
    if (isLoading) {
      return Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className='col-span-1 bg-background rounded-lg shadow-lg overflow-hidden animate-pulse'>
          <Skeleton className='w-full h-40' />
          <CardContent className='p-6'>
            <Skeleton className='h-5 w-2/3 mb-2' />
            <Skeleton className='h-4 w-1/2' />
          </CardContent>
        </div>
      ));
    }

    if (error || !filteredProducts.length) {
      return (
        <div className='col-span-full text-center mt-10'>
          <p className='text-xl font-semibold'>No products found</p>
        </div>
      );
    }

    return filteredProducts.map((product) => (
      <div
        key={product.id}
        className='group col-span-1 bg-background rounded-lg shadow-lg overflow-hidden relative transform transition-transform duration-300 hover:scale-105'
      >
        <div className='relative aspect-video'>
          <img
            src={product.imageUrl}
            alt={product.name}
            className='object-cover object-center w-full h-full'
          />
          <div className='absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300'></div>
        </div>
        <CardContent className='p-6'>
          <CardTitle className='font-bold'>{product.name}</CardTitle>
          <div className='flex justify-between items-center mt-2'>
            <div className='flex items-center space-x-2'>
              <DollarSignIcon className='w-4 h-4' /> <span>{product.currentBid}</span>
            </div>
            <div className='flex items-center space-x-2'>
              <ClockIcon className='w-4 h-4' /> <span>{product.timeLeft}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className='bg-background/80 backdrop-blur-md flex justify-end p-4'>
          <Button variant='outline' size='sm' className='rounded-full'>
            Bid Now
          </Button>
        </CardFooter>
      </div>
    ));
  };

  return (
    <div className='bg-[#2f4f4f] min-h-screen text-white'>
      <header className='bg-gradient-to-br from-black via-gray-800 to-gray-600 p-6 sticky top-0 z-50'>
        <nav className='container mx-auto flex justify-between items-center'>
          <div className='flex items-center'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='w-10 h-10 text-primary mr-4'
            >
              <circle cx='12' cy='12' r='10' />
              <line x1='12' y1='16' x2='12' y2='12' />
              <line x1='12' y1='8' x2='12' y2='8' />
            </svg>
            <h1 className='text-2xl font-bold'>Auction House</h1>
          </div>
          <div className='flex items-center'>
            <div className='relative'>
              <Input
                type='text'
                placeholder='Search...'
                value={searchTerm}
                onChange={handleSearchChange}
                className='pr-10'
              />
              <Search className='absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
            </div>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              className='ml-4 bg-secondary hover:bg-secondary/80 rounded-full'
            >
              <Filter className='w-4 h-4' />
            </Button>
          </div>
        </nav>
      </header>
      <main className='py-10 container mx-auto px-4'>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className='mb-4'>
            <TabsTrigger value='live-auctions'>Live Auctions</TabsTrigger>
            <TabsTrigger value='upcoming-auctions'>Upcoming Auctions</TabsTrigger>
            <TabsTrigger value='past-auctions'>Past Auctions</TabsTrigger>
          </TabsList>
          <TabsContent value='live-auctions'>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
              {renderProductCards()}
            </div>
          </TabsContent>
          <TabsContent value='upcoming-auctions'>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
              {renderProductCards()}
            </div>
          </TabsContent>
          <TabsContent value='past-auctions'>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
              {renderProductCards()}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <footer className='bg-black py-6'>
        <div className='container mx-auto flex justify-center'>
          <p>&copy; 2023 Auction House. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AuctionSite;