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
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Command } from '@/components/ui/command';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Plus, Search, Filter, ChevronRight, UserCircle2, CalendarDays, ClockIcon, FileText } from 'lucide-react';

const mockPatients = [
  { id: 1, name: 'John Doe', age: 30, status: 'Active' },
  { id: 2, name: 'Jane Smith', age: 25, status: 'Inactive' },
  { id: 3, name: 'Alice Johnson', age: 45, status: 'Active' }
];

const mockAppointments = [
  { id: 1, date: '2023-10-15', time: '10:00 AM', patient: 'John Doe', reason: 'Checkup' },
  { id: 2, date: '2023-10-16', time: '11:30 AM', patient: 'Jane Smith', reason: 'Follow-up' }
];

const PatientPortal = () => {
  const router = useRouter();
  const [patients, setPatients] = useState(mockPatients);
  const [appointments, setAppointments] = useState(mockAppointments);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    // Simulate data fetching delay
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='bg-[#34495e] text-white min-h-screen'>
      <header className='py-6 px-8 flex items-center justify-between bg-[#2c3e50] shadow-md'>
        <h1 className='text-3xl font-bold'>Patient Portal</h1>
        <div className='flex gap-4'>
          <Input
            placeholder='Search patients...'
            value={searchQuery}
            onChange={handleSearchChange}
            className='w-full sm:w-64'
          />
          <Button variant='default' className='bg-gradient-to-br from-[#f39c12] to-[#d35400] hover:opacity-90'>
            <Plus className='mr-2' /> Add New Patient
          </Button>
        </div>
      </header>

      <Tabs defaultValue='overview' className='mt-8 mx-8'>
        <TabsList className='bg-transparent space-x-2'>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='patients'>Patients</TabsTrigger>
          <TabsTrigger value='appointments'>Appointments</TabsTrigger>
        </TabsList>
        <TabsContent value='overview'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6'>
            <Card className='bg-[#2c3e50] shadow-md'>
              <CardHeader>
                <CardTitle>Total Patients</CardTitle>
              </CardHeader>
              <CardContent className='text-4xl font-semibold'>3</CardContent>
            </Card>
            <Card className='bg-[#2c3e50] shadow-md'>
              <CardHeader>
                <CardTitle>Active Patients</CardTitle>
              </CardHeader>
              <CardContent className='text-4xl font-semibold'>2</CardContent>
            </Card>
            <Card className='bg-[#2c3e50] shadow-md'>
              <CardHeader>
                <CardTitle>Inactive Patients</CardTitle>
              </CardHeader>
              <CardContent className='text-4xl font-semibold'>1</CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value='patients'>
          <div className='mt-6'>
            <Table className='bg-[#2c3e50] shadow-md'>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <TableRow key={index} className='animate-pulse'>
                      <TableCell colSpan={4} className='h-12'>
                        <Skeleton className='h-full w-full' />
                      </TableCell>
                    </TableRow>
                  ))
                ) : isError ? (
                  <TableRow>
                    <TableCell colSpan={4} className='text-red-500'>Failed to load data</TableCell>
                  </TableRow>
                ) : filteredPatients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4}>No patients found</TableCell>
                  </TableRow>
                ) : (
                  filteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell>{patient.name}</TableCell>
                      <TableCell>{patient.age}</TableCell>
                      <TableCell>
                        <Badge variant={patient.status === 'Active' ? 'success' : 'secondary'}>
                          {patient.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant='outline'
                          className='border-none text-[#f39c12] hover:bg-[#2c3e50] hover:text-white'
                          onClick={() => router.push(`/patients/${patient.id}`)}
                          aria-label={`View details for ${patient.name}`}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value='appointments'>
          <div className='mt-6'>
            <Table className='bg-[#2c3e50] shadow-md'>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <TableRow key={index} className='animate-pulse'>
                      <TableCell colSpan={5} className='h-12'>
                        <Skeleton className='h-full w-full' />
                      </TableCell>
                    </TableRow>
                  ))
                ) : isError ? (
                  <TableRow>
                    <TableCell colSpan={5} className='text-red-500'>Failed to load data</TableCell>
                  </TableRow>
                ) : appointments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5}>No appointments scheduled</TableCell>
                  </TableRow>
                ) : (
                  appointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>{appointment.date}</TableCell>
                      <TableCell>{appointment.time}</TableCell>
                      <TableCell>{appointment.patient}</TableCell>
                      <TableCell>{appointment.reason}</TableCell>
                      <TableCell>
                        <Button
                          variant='outline'
                          className='border-none text-[#f39c12] hover:bg-[#2c3e50] hover:text-white'
                          onClick={() => router.push(`/appointments/${appointment.id}`)}
                          aria-label={`View appointment details for ${appointment.patient}`}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <footer className='py-6 px-8 bg-[#2c3e50] shadow-md mt-8'>
        <p className='text-center'>© 2023 Healthcare Provider. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PatientPortal;