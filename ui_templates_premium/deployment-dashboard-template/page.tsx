'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, CardContent, CardFooter, CardHeader, CardTitle, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Tabs, TabsContent, TabsList, TabsTrigger, Badge, Avatar, Progress, Separator, Skeleton } from '@/components/ui';
import * as Dialog from '@radix-ui/react-dialog';
import { Plus, Search, Filter, ChevronRight, RefreshCw, CheckCircle, AlertTriangle, X } from 'lucide-react';

interface Deployment {
  id: number;
  name: string;
  status: 'success' | 'error' | 'pending';
  progress: number;
}

const mockDeployments: Deployment[] = [
  { id: 1, name: 'Project Alpha', status: 'success', progress: 100 },
  { id: 2, name: 'Project Beta', status: 'pending', progress: 30 },
  { id: 3, name: 'Project Gamma', status: 'error', progress: 60 }
];

const DeploymentDashboard = () => {
  const [deployments, setDeployments] = useState<Deployment[]>(mockDeployments);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<'all' | 'success' | 'error'>('all');
  const router = useRouter();

  useEffect(() => {
    // Simulate data fetching
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredDeployments = deployments.filter(deployment =>
    deployment.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (currentTab === 'all' || deployment.status === currentTab)
  );

  const renderStatusBadge = (status: Deployment['status']) => {
    switch (status) {
      case 'success':
        return <Badge variant='default' className='bg-green-500 text-white'>Success</Badge>;
      case 'error':
        return <Badge variant='default' className='bg-red-500 text-white'>Error</Badge>;
      case 'pending':
        return <Badge variant='default' className='bg-yellow-500 text-black'>Pending</Badge>;
      default:
        return null;
    }
  };

  const handleRefreshClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className='flex flex-col min-h-screen bg-background text-text'>
      <header className='py-6 px-8 bg-primary shadow-xl'>
        <div className='container mx-auto flex items-center justify-between'>
          <h1 className='text-3xl font-bold'>Deployment Dashboard</h1>
          <div className='flex space-x-4'>
            <Input
              placeholder='Search deployments...'
              value={searchQuery}
              onChange={handleSearchChange}
              className='w-full max-w-md'
              icon={<Search size={16} />}
            />
            <Button onClick={() => setIsModalOpen(true)} icon={<Plus size={16} />}>New Deployment</Button>
          </div>
        </div>
      </header>
      <main className='p-8'>
        <div className='mb-6'>
          <Tabs defaultValue={currentTab} onValueChange={(value) => setCurrentTab(value as typeof currentTab)}>n            <TabsList className='grid w-full grid-cols-3'>
              <TabsTrigger value='all'>All</TabsTrigger>
              <TabsTrigger value='success'>Success</TabsTrigger>
              <TabsTrigger value='error'>Error</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className='aspect-square animate-pulse rounded-lg bg-gradient-to-br from-secondary via-primary to-accent' />
            ))
          ) : (
            filteredDeployments.map(deployment => (
              <div key={deployment.id} className='group relative overflow-hidden rounded-lg bg-gradient-to-br from-secondary via-primary to-accent shadow-xl transition-transform transform-gpu hover:rotate-y-180'>
                <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black bg-opacity-75 text-white'>
                  <button className='bg-white bg-opacity-20 text-white p-4 rounded-lg mr-2'>View Details</button>
                  <button className='bg-white bg-opacity-20 text-white p-4 rounded-lg'>Retry</button>
                </div>
                <Card className='backdrop-blur-sm bg-background/30 rounded-lg h-full flex flex-col'>
                  <CardHeader className='pb-2'>
                    <CardTitle>{deployment.name}</CardTitle>
                  </CardHeader>
                  <CardContent className='grow flex flex-col justify-center items-center'>
                    {renderStatusBadge(deployment.status)}
                    <Progress value={deployment.progress} className='mt-2' />
                  </CardContent>
                  <CardFooter className='pt-2'>
                    <div className='flex items-center space-x-2'>
                      {deployment.status === 'success' ? (
                        <CheckCircle size={16} className='text-green-500' />
                      ) : deployment.status === 'error' ? (
                        <AlertTriangle size={16} className='text-red-500' />
                      ) : (
                        <RefreshCw size={16} className='animate-spin' />
                      )}
                      <span className='text-sm'>{deployment.status.charAt(0).toUpperCase() + deployment.status.slice(1)}</span>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            ))
          )}
        </div>
      </main>
      <aside className='hidden md:block w-1/4 bg-primary shadow-xl p-8'>
        <h2 className='text-xl font-semibold mb-4'>Filters</h2>
        <form>
          <div className='mb-4'>
            <label htmlFor='environment' className='block mb-2'>Environment</label>
            <Select onValueChange={console.log}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select environment...' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='production'>Production</SelectItem>
                <SelectItem value='staging'>Staging</SelectItem>
                <SelectItem value='development'>Development</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='mb-4'>
            <label htmlFor='date-range' className='block mb-2'>Date Range</label>
            <Input placeholder='Select date range...' icon={<CalendarIcon size={16} />} />
          </div>
          <Button type='submit' icon={<Filter size={16} />}>Apply Filters</Button>
        </form>
      </aside>
      <footer className='py-4 px-8 bg-primary shadow-xl'>
        <div className='container mx-auto text-center'>
          <p>&copy; 2023 Deployment Inc.</p>
        </div>
      </footer>
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Trigger className='sr-only'>Add New Deployment</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className='fixed inset-0 bg-black bg-opacity-50' />
          <Dialog.Content className='fixed top-[50%] left-[50%] max-h-[85vh] w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-lg bg-background p-6 shadow-xl outline-none animate-in fade-in-90 slide-in-from-bottom-10 sm:slide-in-from-left-10'>
            <Dialog.Title className='text-lg font-semibold mb-4'>New Deployment</Dialog.Title>
            <form className='space-y-4'>
              <Input label='Project Name' placeholder='Enter project name...' />
              <Input label='Branch' placeholder='Enter branch...' />
              <Select onValueChange={console.log}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select environment...' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='production'>Production</SelectItem>
                  <SelectItem value='staging'>Staging</SelectItem>
                  <SelectItem value='development'>Development</SelectItem>
                </SelectContent>
              </Select>
              <Button type='submit' icon={<ChevronRight size={16} />}>Deploy</Button>
            </form>
            <Dialog.Close className='absolute right-4 top-4 rounded-full opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground'>
              <X className='h-4 w-4' aria-hidden='true' />
              <span className='sr-only'>Close</span>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default DeploymentDashboard;