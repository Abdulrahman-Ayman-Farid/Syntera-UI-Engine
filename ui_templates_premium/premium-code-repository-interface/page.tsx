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
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TooltipProvider, TooltipRoot, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { LucideArrowLeft, LucideGitBranch, LucideSearch, LucideStar, LucideUser, LucideChevronDown, LucideChevronUp } from 'lucide-react';

interface Repo {
  id: number;
  name: string;
  owner: string;
  stars: number;
  forks: number;
}

const mockRepos: Repo[] = [
  { id: 1, name: 'React', owner: 'facebook', stars: 190000, forks: 45000 },
  { id: 2, name: 'Next.js', owner: 'vercel', stars: 100000, forks: 20000 },
  { id: 3, name: 'Tailwind CSS', owner: 'tailwindlabs', stars: 80000, forks: 15000 }
];

export default function CodeRepository() {
  const [repos, setRepos] = useState<Repo[]>(mockRepos);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // Simulate data fetching
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      const filteredRepos = mockRepos.filter(repo => repo.name.toLowerCase().includes(searchTerm.toLowerCase()));
      setRepos(filteredRepos);
    } else {
      setRepos(mockRepos);
    }
  };

  return (
    <div className='bg-[#1F2937] text-white min-h-screen flex flex-col overflow-hidden'>
      <header className='p-4 bg-gradient-to-tr from-[#DC2626] via-[#18181B] to-[#1F2937] shadow-xl shadow-black/50'>
        <nav className='flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <LucideArrowLeft size={24} className='cursor-pointer' onClick={() => router.back()} aria-label='Go Back'/>
            <h1 className='text-2xl font-bold'>Code Repositories</h1>
          </div>
          <div className='flex items-center space-x-4'>
            <div className='relative w-64'>
              <Input
                type='text'
                placeholder='Search repositories...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className='pl-10'
              />
              <LucideSearch size={20} className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'/>
            </div>
            <TooltipProvider delayDuration={300}>
              <TooltipRoot>
                <TooltipTrigger asChild>
                  <Button variant='outline' onClick={() => setIsModalOpen(true)}>New Repo</Button>
                </TooltipTrigger>
                <TooltipContent>Click to create a new repository</TooltipContent>
              </TooltipRoot>
            </TooltipProvider>
          </div>
        </nav>
      </header>
      <main className='overflow-auto p-4'>
        <Tabs defaultValue='all' className='w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='all'>All</TabsTrigger>
            <TabsTrigger value='stars'>Stars</TabsTrigger>
          </TabsList>
          <TabsContent value='all'>
            <div className='mt-6 grid gap-4 grid-flow-row-dense auto-rows-fr sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
              {isLoading ? (
                Array.from({ length: 10 }).map((_, index) => (
                  <Skeleton key={index} className='aspect-video rounded-lg bg-gradient-to-tr from-[#DC2626]/50 to-[#18181B]/50 animate-pulse'/>
                ))
              ) : repos.length > 0 ? (
                repos.map(repo => (
                  <Card key={repo.id} className='group relative bg-gradient-to-tr from-[#DC2626]/20 via-[#18181B]/30 to-[#1F2937]/50 rounded-lg overflow-hidden shadow-2xl shadow-black/50 cursor-pointer hover:shadow-none hover:scale-105 transition-transform duration-300'>
                    <CardContent className='p-6 space-y-2'>
                      <CardTitle>{repo.name}</CardTitle>
                      <p className='text-sm text-gray-400'>{repo.owner}</p>
                    </CardContent>
                    <CardFooter className='border-t border-t-[#DC2626]/50 flex justify-between'>
                      <div className='flex items-center space-x-2'>
                        <LucideStar size={16} className='text-yellow-400'/>
                        <span>{repo.stars.toLocaleString()}</span>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <LucideGitBranch size={16} className='text-gray-400'/>
                        <span>{repo.forks.toLocaleString()}</span>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className='text-center mt-10'>
                  <p className='text-xl'>No repositories found.</p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value='stars'>
            <div className='mt-6 grid gap-4 grid-flow-row-dense auto-rows-fr sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
              {isLoading ? (
                Array.from({ length: 10 }).map((_, index) => (
                  <Skeleton key={index} className='aspect-video rounded-lg bg-gradient-to-tr from-[#DC2626]/50 to-[#18181B]/50 animate-pulse'/>
                ))
              ) : repos.length > 0 ? (
                [...repos].sort((a, b) => b.stars - a.stars).map(repo => (
                  <Card key={repo.id} className='group relative bg-gradient-to-tr from-[#DC2626]/20 via-[#18181B]/30 to-[#1F2937]/50 rounded-lg overflow-hidden shadow-2xl shadow-black/50 cursor-pointer hover:shadow-none hover:scale-105 transition-transform duration-300'>
                    <CardContent className='p-6 space-y-2'>
                      <CardTitle>{repo.name}</CardTitle>
                      <p className='text-sm text-gray-400'>{repo.owner}</p>
                    </CardContent>
                    <CardFooter className='border-t border-t-[#DC2626]/50 flex justify-between'>
                      <div className='flex items-center space-x-2'>
                        <LucideStar size={16} className='text-yellow-400'/>
                        <span>{repo.stars.toLocaleString()}</span>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <LucideGitBranch size={16} className='text-gray-400'/>
                        <span>{repo.forks.toLocaleString()}</span>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className='text-center mt-10'>
                  <p className='text-xl'>No repositories found.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <footer className='p-4 bg-gradient-to-tr from-[#DC2626] via-[#18181B] to-[#1F2937] shadow-xl shadow-black/50'>
        <div className='flex items-center justify-between'>
          <p className='text-sm'>© 2023 Premium Code Repositories. All rights reserved.</p>
          <div className='flex items-center space-x-4'>
            <LucideUser size={18} className='text-gray-400'/>
            <p className='text-sm'>Signed in as User</p>
          </div>
        </div>
      </footer>
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className='fixed inset-0 bg-black/50'/>n          <Dialog.Content className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-tr from-[#DC2626]/20 via-[#18181B]/30 to-[#1F2937]/50 rounded-lg p-6 shadow-2xl shadow-black/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DC2626] focus-visible:ring-offset-2'>
            <Dialog.Title className='text-lg font-semibold'>Create New Repository</Dialog.Title>
            <form className='mt-4 space-y-4'>
              <Input type='text' placeholder='Repository Name' className='focus:border-[#DC2626]'/>n              <Textarea placeholder='Description' className='resize-none focus:border-[#DC2626]'/>n              <div className='flex justify-end'>
                <Dialog.Close asChild>
                  <Button variant='outline' className='mr-2'>Cancel</Button>
                </Dialog.Close>
                <Button>Create</Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}