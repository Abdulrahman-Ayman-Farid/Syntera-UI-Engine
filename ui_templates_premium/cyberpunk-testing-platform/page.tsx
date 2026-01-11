'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import * as Dialog from '@radix-ui/react-dialog';
import { Plus, Search, Filter, ChevronRight, Folder, File, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const shimmerAnimation = 'bg-[linear-gradient(110deg,#fcac14_0%,#fcac14_30%,#f8d806_100%)] animate-shimmer bg-size-200 bg-repeat-x';

interface TestCase {
  id: number;
  title: string;
  status: 'success' | 'error' | 'pending';
}

const mockTestCases: TestCase[] = [
  { id: 1, title: 'Login Flow Test', status: 'success' },
  { id: 2, title: 'API Response Test', status: 'pending' },
  { id: 3, title: 'Error Handling Test', status: 'error' },
];

const getStatusColor = (status: TestCase['status']) => {
  switch (status) {
    case 'success':
      return '#34D399';
    case 'error':
      return '#EF4444';
    case 'pending':
      return '#EAB308';
    default:
      return '#fff';
  }
};

export default function TestingPlatform() {
  const [testCases, setTestCases] = useState<TestCase[]>(mockTestCases);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingCase, setIsAddingCase] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleAddCase = () => {
    setIsAddingCase(!isAddingCase);
  };

  const handleSubmitNewCase = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Mock submission logic
    setIsAddingCase(false);
  };

  const filteredTestCases = testCases.filter((testCase) =>
    testCase.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='bg-black text-white min-h-screen flex flex-col'>
      <header className='bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-500 p-6 shadow-2xl'>
        <div className='container mx-auto flex justify-between items-center'>
          <h1 className='text-2xl font-bold'>Testing Platform</h1>
          <div className='flex space-x-4'>
            <Input
              type='text'
              placeholder='Search tests...'
              value={searchTerm}
              onChange={handleSearchChange}
              className='w-full sm:w-auto'
            />
            <Button onClick={handleAddCase} aria-label='Add New Test Case'>
              <Plus className='mr-2' /> Add Test Case
            </Button>
          </div>
        </div>
      </header>
      <main className='container mx-auto flex-1 flex overflow-hidden'>
        <aside className='hidden sm:block w-64 border-r border-gray-800 p-4'>
          <nav>
            <ul className='space-y-2'>
              <li>
                <a href='#' className='flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg'>
                  <Folder className='mr-2' /> All Tests
                </a>
              </li>
              <li>
                <a href='#' className='flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg'>
                  <File className='mr-2' /> Recent
                </a>
              </li>
            </ul>
          </nav>
        </aside>
        <section className='flex-1 p-4'>
          <Tabs defaultValue='all-tests'>
            <TabsList className='mb-4'>
              <TabsTrigger value='all-tests'>All Tests</TabsTrigger>
              <TabsTrigger value='failed-tests'>Failed Tests</TabsTrigger>
            </TabsList>
            <TabsContent value='all-tests'>
              {isLoading ? (
                <div className='grid gap-4'>
                  {[...Array(5)].map((_, index) => (
                    <Skeleton key={index} className='h-24 rounded-xl' />
                  ))}
                </div>
              ) : (
                <div className='grid gap-4'>
                  {filteredTestCases.map((testCase) => (
                    <Card key={testCase.id} className='border-t border-l border-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 backdrop-blur-sm bg-black/30 rounded-xl shadow-2xl hover:scale-105 transition-transform duration-300'>
                      <CardHeader className='p-4'>
                        <CardTitle>{testCase.title}</CardTitle>
                        <CardDescription>Details about the test case.</CardDescription>
                      </CardHeader>
                      <CardContent className='p-4'>
                        <Progress value={testCase.status === 'success' ? 100 : testCase.status === 'error' ? 20 : 50} className={`bg-transparent ${shimmerAnimation}`} />
                        <div className='mt-2 flex justify-end'>
                          <Badge className={`bg-${getStatusColor(testCase.status)} text-white`}>{testCase.status}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value='failed-tests'>
              {isLoading ? (
                <div className='grid gap-4'>
                  {[...Array(3)].map((_, index) => (
                    <Skeleton key={index} className='h-24 rounded-xl' />
                  ))}
                </div>
              ) : (
                <div className='grid gap-4'>
                  {filteredTestCases
                    .filter((testCase) => testCase.status === 'error')
                    .map((testCase) => (
                      <Card key={testCase.id} className='border-t border-l border-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 backdrop-blur-sm bg-black/30 rounded-xl shadow-2xl hover:scale-105 transition-transform duration-300'>
                        <CardHeader className='p-4'>
                          <CardTitle>{testCase.title}</CardTitle>
                          <CardDescription>Details about the test case.</CardDescription>
                        </CardHeader>
                        <CardContent className='p-4'>
                          <Progress value={20} className={`bg-transparent ${shimmerAnimation}`} />
                          <div className='mt-2 flex justify-end'>
                            <Badge className={`bg-red-500 text-white`}>error</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </section>
      </main>
      <footer className='bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-500 p-6'>
        <div className='container mx-auto flex justify-between items-center'>
          <p>&copy; 2023 Testing Platform Inc.</p>
          <div className='flex space-x-4'>
            <Button variant='outline'>Terms</Button>
            <Button variant='outline'>Privacy</Button>
          </div>
        </div>
      </footer>
      <Dialog.Root open={isAddingCase} onOpenChange={setIsAddingCase}>
        <Dialog.Trigger className='sr-only'>Open</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className='fixed inset-0 bg-black opacity-50' />
          <Dialog.Content className='fixed left-1/2 top-1/2 max-h-[85vh] w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-lg bg-black/80 p-6 shadow-lg shadow-black outline-none backdrop-blur-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'>
            <Dialog.Title className='text-lg font-semibold'>Add New Test Case</Dialog.Title>
            <form onSubmit={handleSubmitNewCase} className='mt-4 space-y-4'>
              <Input type='text' placeholder='Test Title' required className='border-t border-l border-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 backdrop-blur-sm bg-black/30 rounded-xl shadow-2xl focus:ring-2 focus:ring-offset-2 focus:ring-pink-500' />
              <Textarea placeholder='Description' required className='border-t border-l border-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 backdrop-blur-sm bg-black/30 rounded-xl shadow-2xl focus:ring-2 focus:ring-offset-2 focus:ring-pink-500' />
              <div className='flex justify-end space-x-4'>
                <Dialog.Close asChild>
                  <Button variant='outline'>Cancel</Button>
                </Dialog.Close>
                <Button type='submit'>Save</Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}