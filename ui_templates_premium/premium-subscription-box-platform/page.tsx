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
import { Command } from '@/components/ui/command';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Plus, Search, Filter, ChevronRight, ShoppingCart, DollarSign, Users, Package, CheckCircle, AlertTriangle } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

const mockProducts: Product[] = [
  { id: 1, name: 'Luxury Beauty Kit', price: 99.99, image: '/images/beauty-kit.jpg' },
  { id: 2, name: 'Gourmet Food Basket', price: 149.99, image: '/images/food-basket.jpg' },
  { id: 3, name: 'Exotic Tea Set', price: 49.99, image: '/images/tea-set.jpg' }
];

const shimmerEffect = `relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-[linear-gradient(90deg,transparent,hsla(0,0%,100%,0.4),transparent)]`;

export default function Home() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [filter, setFilter] = useState<'all' | 'beauty' | 'food' | 'tea'>('all');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredProducts = () => {
    return products.filter(product => {
      if (filter === 'all') {
        return product.name.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return product.name.toLowerCase().includes(searchTerm.toLowerCase()) && product.name.toLowerCase().includes(filter);
    });
  };

  return (
    <div className='bg-fdfcfegradients-to-l from-emerald-50 via-white to-gold-50 text-gray-900 min-h-screen relative'>
      <header className='sticky top-0 z-50 bg-white shadow-lg px-6 py-4 flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} aria-label='Toggle Sidebar' className='md:hidden'>
            <Package className='w-6 h-6 text-gray-500' />
          </button>
          <h1 className='font-bold text-2xl'>Subscription Boxes</h1>
        </div>
        <div className='hidden md:flex items-center gap-4'>
          <input
            type='text'
            placeholder='Search...'
            value={searchTerm}
            onChange={handleSearchChange}
            className='border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500'
          />
          <Filter className='w-6 h-6 text-gray-500 cursor-pointer' onClick={() => console.log('Filter clicked')} />          
        </div>
        <div className='flex items-center gap-4'>
          <ShoppingCart className='w-6 h-6 text-gray-500' />
          <Avatar className='cursor-pointer'>
            <AvatarImage src='/avatars/user.png' alt='User avatar' />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
      </header>
      <main className='p-6 flex flex-col md:flex-row gap-6'>
        <aside className={`w-full md:w-1/5 ${isSidebarOpen ? 'block' : 'hidden'} md:block bg-white shadow-lg rounded-xl p-6 fixed md:relative inset-y-0 left-0 md:left-auto md:right-auto transform md:transform-none ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>          <h2 className='font-semibold text-lg mb-4'>Filters</h2>
          <Collapsible open={activeTab === 'categories'} onOpenChange={(value) => setActiveTab(value ? 'categories' : '')}>
            <CollapsibleTrigger className='flex items-center justify-between w-full px-4 py-2 text-left font-medium bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200'>
              Categories <ChevronRight className={`w-4 h-4 ml-2 transition-transform duration-200 ${activeTab === 'categories' ? 'rotate-90' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className='mt-2'>
              <div className='space-y-2 pl-4'>
                <label className='inline-flex items-center'>
                  <input
                    type='radio'
                    className='form-radio h-4 w-4 text-emerald-600'
                    checked={filter === 'all'}
                    onChange={() => setFilter('all')}
                  />
                  <span className='ml-2'>All</span>
                </label>
                <label className='inline-flex items-center'>
                  <input
                    type='radio'
                    className='form-radio h-4 w-4 text-emerald-600'
                    checked={filter === 'beauty'}
                    onChange={() => setFilter('beauty')}
                  />
                  <span className='ml-2'>Beauty</span>
                </label>
                <label className='inline-flex items-center'>
                  <input
                    type='radio'
                    className='form-radio h-4 w-4 text-emerald-600'
                    checked={filter === 'food'}
                    onChange={() => setFilter('food')}
                  />
                  <span className='ml-2'>Food</span>
                </label>
                <label className='inline-flex items-center'>
                  <input
                    type='radio'
                    className='form-radio h-4 w-4 text-emerald-600'
                    checked={filter === 'tea'}
                    onChange={() => setFilter('tea')}
                  />
                  <span className='ml-2'>Tea</span>
                </label>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </aside>
        <section className='w-full md:w-4/5'>
          <div className='mb-6'>
            <Tabs defaultValue='all' className='w-full'>
              <TabsList className='grid grid-cols-4'>
                <TabsTrigger value='all' className='hover:text-emerald-600'>All</TabsTrigger>
                <TabsTrigger value='beauty' className='hover:text-emerald-600'>Beauty</TabsTrigger>
                <TabsTrigger value='food' className='hover:text-emerald-600'>Food</TabsTrigger>
                <TabsTrigger value='tea' className='hover:text-emerald-600'>Tea</TabsTrigger>
              </TabsList>
              <TabsContent value='all'>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                  {isLoading ? (
                    Array.from({ length: 12 }).map((_, index) => (
                      <Skeleton key={index} className='aspect-square rounded-xl' />
                    ))
                  ) : (
                    filteredProducts().map(product => (
                      <Card key={product.id} className='bg-white shadow-lg rounded-xl overflow-hidden'>
                        <CardContent className='relative'>
                          <img src={product.image} alt={product.name} className='w-full aspect-square object-cover' />
                          <div className={`${shimmerEffect} absolute inset-0`}>&nbsp;</div>
                        </CardContent>
                        <CardFooter className='p-4 space-y-2'>
                          <CardTitle className='font-semibold'>{product.name}</CardTitle>
                          <p className='text-gray-500'>${product.price.toFixed(2)}</p>
                          <Button variant='default' className='w-full'>Subscribe Now</Button>
                        </CardFooter>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
              {/* Additional tabs can be added here */}
            </Tabs>
          </div>
        </section>
      </main>
      <footer className='bg-white shadow-lg p-6 mt-6'>
        <div className='max-w-7xl mx-auto flex items-center justify-between'>
          <p className='text-gray-500'>© 2023 Luxury Subscription Boxes. All rights reserved.</p>
          <div className='flex items-center gap-4'>
            <Users className='w-4 h-4 text-gray-500' /> <span className='text-gray-500'>1,234 Members</span>
          </div>
        </div>
      </footer>
    </div>
  );
}