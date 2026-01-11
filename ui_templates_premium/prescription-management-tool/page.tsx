'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import * as Dialog from '@radix-ui/react-dialog';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Plus, Search, Filter, Trash2, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface Prescription {
  id: number;
  patientName: string;
  medication: string;
  dosage: string;
  refills: number;
  status: 'active' | 'completed' | 'cancelled';
}

const mockData: Prescription[] = [
  { id: 1, patientName: 'John Doe', medication: 'Amoxicillin', dosage: '500mg', refills: 2, status: 'active' },
  { id: 2, patientName: 'Jane Smith', medication: 'Ibuprofen', dosage: '200mg', refills: 1, status: 'completed' },
  { id: 3, patientName: 'Alice Johnson', medication: 'Lisinopril', dosage: '10mg', refills: 3, status: 'cancelled' }
];

const PrescriptionManagementTool = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const prescriptionsPerPage = 5;

  const router = useRouter();

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      try {
        setPrescriptions(mockData);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load prescriptions.');
        setIsLoading(false);
      }
    }, 1500);
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterChange = (value: 'all' | 'active' | 'completed' | 'cancelled') => {
    setFilterStatus(value);
  };

  const filteredPrescriptions = prescriptions.filter((prescription) => {
    if (filterStatus !== 'all' && prescription.status !== filterStatus) return false;
    return prescription.patientName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const totalPages = Math.ceil(filteredPrescriptions.length / prescriptionsPerPage);
  const paginatedPrescriptions = filteredPrescriptions.slice(
    (currentPage - 1) * prescriptionsPerPage,
    currentPage * prescriptionsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getStatusColor = (status: 'active' | 'completed' | 'cancelled'): string => {
    switch (status) {
      case 'active':
        return '#22c55e';
      case 'completed':
        return '#34d399';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#1e293b';
    }
  };

  return (
    <div className='bg-white text-gray-900 min-h-screen flex flex-col'>
      <header className='bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 py-4 px-6 shadow-xl'>
        <h1 className='text-3xl font-bold text-white'>Prescription Management</h1>
      </header>
      <main className='flex-grow p-6'>
        <div className='mb-6 flex items-center justify-between'>
          <div className='flex space-x-4'>
            <Input
              type='text'
              placeholder='Search Prescriptions...'
              value={searchQuery}
              onChange={handleSearchChange}
              className='w-full sm:w-auto'
            />
            <Select defaultValue={filterStatus} onValueChange={handleFilterChange}>
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Filter by Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All</SelectItem>
                <SelectItem value='active'>Active</SelectItem>
                <SelectItem value='completed'>Completed</SelectItem>
                <SelectItem value='cancelled'>Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant='default' onClick={() => router.push('/add-prescription')} className='space-x-2'>
            <Plus className='w-4 h-4' /> Add Prescription
          </Button>
        </div>
        <Tabs defaultValue='overview' className='w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='statistics'>Statistics</TabsTrigger>
          </TabsList>
          <TabsContent value='overview'>
            {isLoading ? (
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                {[...Array(prescriptionsPerPage)].map((_, index) => (
                  <Skeleton key={index} className='rounded-lg h-64' />
                ))}
              </div>
            ) : error ? (
              <div className='p-4 bg-red-100 rounded-lg text-red-900'>{error}</div>
            ) : (
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                {paginatedPrescriptions.map((prescription) => (
                  <Card key={prescription.id} className='bg-white/10 backdrop-blur-md shadow-xl transition-all duration-300 hover:scale-105 rounded-lg'>
                    <CardHeader>
                      <CardTitle>{prescription.medication}</CardTitle>
                      <CardDescription>{prescription.dosage}</CardDescription>
                    </CardHeader>
                    <CardContent className='pt-0'>
                      <div className='flex items-center justify-between'>
                        <span>Patient: {prescription.patientName}</span>
                        <Badge style={{ backgroundColor: getStatusColor(prescription.status) }} className='rounded-lg'>
                          {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                        </Badge>
                      </div>
                      <div className='mt-2'>
                        Refills: {prescription.refills}
                      </div>
                    </CardContent>
                    <CardFooter className='flex items-center justify-between'>
                      <Button variant='ghost' className='hover:text-blue-600'>
                        Edit
                      </Button>
                      <Button variant='ghost' className='hover:text-red-600'>
                        Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
            <div className='mt-4 flex items-center justify-end'>
              <Button variant='outline' size='icon' disabled={currentPage === 1} onClick={handlePreviousPage} className='mr-2'>
                {'<'}
              </Button>
              <span className='mx-2'>
                Page {currentPage} of {totalPages}
              </span>
              <Button variant='outline' size='icon' disabled={currentPage === totalPages} onClick={handleNextPage}>
                {'>'}
              </Button>
            </div>
          </TabsContent>
          <TabsContent value='statistics'>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <Card className='bg-white/10 backdrop-blur-md shadow-xl rounded-lg'>
                <CardHeader>
                  <CardTitle>Active Prescriptions</CardTitle>
                </CardHeader>
                <CardContent className='flex items-center justify-between'>
                  <div className='space-y-1'>
                    <h4 className='font-semibold'>12</h4>
                    <p className='text-xs text-muted-foreground'>Total Active Prescriptions</p>
                  </div>
                  <CheckCircle className='w-8 h-8 text-green-500' />
                </CardContent>
              </Card>
              <Card className='bg-white/10 backdrop-blur-md shadow-xl rounded-lg'>
                <CardHeader>
                  <CardTitle>Completed Prescriptions</CardTitle>
                </CardHeader>
                <CardContent className='flex items-center justify-between'>
                  <div className='space-y-1'>
                    <h4 className='font-semibold'>7</h4>
                    <p className='text-xs text-muted-foreground'>Total Completed Prescriptions</p>
                  </div>
                  <XCircle className='w-8 h-8 text-red-500' />
                </CardContent>
              </Card>
              <Card className='col-span-full bg-white/10 backdrop-blur-md shadow-xl rounded-lg'>
                <CardHeader>
                  <CardTitle>Refill Statistics</CardTitle>
                </CardHeader>
                <CardContent className='py-4'>
                  <div className='relative'>
                    <Progress value={80} className='h-2 bg-gray-200 rounded-full overflow-hidden'>
                      <div className='absolute inset-0 bg-blue-500 rounded-full' style={{ width: '80%' }}></div>
                    </Progress>
                    <div className='flex items-center justify-between mt-2'>
                      <p className='text-sm text-gray-600'>Average Refills: 2.5</p>
                      <p className='text-sm text-gray-600'>Max Refills: 5</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <footer className='bg-gray-50 py-4 px-6 shadow-xl'>
        <p className='text-gray-600'>© 2023 Prescription Management Tool. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PrescriptionManagementTool;