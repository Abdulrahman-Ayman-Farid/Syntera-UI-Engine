'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Check, MinusCircle, PlusCircle, Search, ShoppingCart, User, X } from 'lucide-react';

const mockProducts = [
  { id: 1, name: 'Wireless Bluetooth Headphones', price: 150, quantity: 1, image: 'https://via.placeholder.com/150' },
  { id: 2, name: 'Smartwatch', price: 250, quantity: 1, image: 'https://via.placeholder.com/150' }
];

const ShoppingCartPage = () => {
  const [products, setProducts] = useState(mockProducts);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Simulate data fetching delay
    const timer = setTimeout(() => {
      calculateTotalPrice();
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [products]);

  const calculateTotalPrice = () => {
    setTotalPrice(products.reduce((acc, curr) => acc + curr.price * curr.quantity, 0));
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity > 0) {
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId ? { ...product, quantity: newQuantity } : product
        )
      );
    }
  };

  const handleRemoveProduct = (productId) => {
    setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSuccess(true);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Failed to submit order. Please try again.');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='bg-gradient-to-br from-blue-900 via-blue-600 to-sky-400 min-h-screen text-white'>
      <header className='p-4 flex justify-between items-center'>
        <h1 className='text-3xl font-bold'>Shopping Cart</h1>
        <button onClick={() => router.push('/')} className='bg-transparent border-none cursor-pointer'>
          <X size={24} className='drop-shadow-lg' aria-label='Close Cart' />
        </button>
      </header>
      <main className='px-4 py-8'>
        {isLoading ? (
          <div className='space-y-4'>
            <Skeleton className='h-12 w-full rounded-lg' />
            <Skeleton className='h-12 w-full rounded-lg' />
            <Skeleton className='h-12 w-full rounded-lg' />
          </div>
        ) : products.length > 0 ? (
          <div className='grid gap-8'>
            {products.map((product) => (
              <Card key={product.id} className='relative bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl transition-transform duration-300 hover:scale-105'>
                <CardContent className='flex items-center justify-between space-x-4'>
                  <Avatar className='border border-white/20'>
                    <AvatarImage src={product.image} alt={product.name} />
                    <AvatarFallback>{product.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className='flex-1'>
                    <CardTitle className='font-semibold'>{product.name}</CardTitle>
                    <CardTitle className='text-gray-400'>${product.price.toFixed(2)}</CardTitle>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Button variant='ghost' size='icon' onClick={() => handleQuantityChange(product.id, product.quantity - 1)}>
                      <MinusCircle size={24} className='drop-shadow-lg' aria-label='Decrease Quantity' />
                    </Button>
                    <Input
                      type='number'
                      value={product.quantity}
                      onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                      className='w-12 text-center'
                      min={0}
                    />
                    <Button variant='ghost' size='icon' onClick={() => handleQuantityChange(product.id, product.quantity + 1)}>
                      <PlusCircle size={24} className='drop-shadow-lg' aria-label='Increase Quantity' />
                    </Button>
                  </div>
                  <Button variant='ghost' size='icon' onClick={() => handleRemoveProduct(product.id)}>
                    <X size={24} className='drop-shadow-lg' aria-label='Remove Product' />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center space-y-4'>
            <ShoppingCart size={48} className='opacity-50' />
            <p className='text-xl opacity-50'>Your cart is empty</p>
            <Button onClick={() => router.push('/')}>Browse Products</Button>
          </div>
        )}
      </main>
      <footer className='fixed bottom-0 left-0 right-0 px-4 py-6 bg-white/10 backdrop-blur-sm border-t border-t-blue-300/20 shadow-lg'>
        <div className='flex justify-between items-center'>
          <div className='flex items-center space-x-4'>
            <span>Total:</span>
            <span className='font-bold text-2xl'>${totalPrice.toFixed(2)}</span>
          </div>
          <Button disabled={isLoading || isSuccess} onClick={handleSubmit} className='bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white'>
            {isLoading ? 'Processing...' : isSuccess ? 'Order Placed!' : 'Place Order'}
          </Button>
        </div>
        {errorMessage && <p className='mt-2 text-red-500'>{errorMessage}</p>}
      </footer>
    </div>
  );
};

export default ShoppingCartPage;