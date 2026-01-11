'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import * as Dialog from '@radix-ui/react-dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Search, Filter, ChevronRight, Edit, Trash } from 'lucide-react';

interface Patient {
  id: number;
  name: string;
  age: number;
  diagnosis: string;
}

const mockPatients: Patient[] = [
  { id: 1, name: 'John Doe', age: 45, diagnosis: 'Diabetes' },
  { id: 2, name: 'Jane Smith', age: 30, diagnosis: 'Hypertension' },
  { id: 3, name: 'Sam Johnson', age: 50, diagnosis: 'Arthritis' }
];

const MedicalRecordsViewer = () => {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>(mockPatients);

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredPatients(patients);
    } else {
      setFilteredPatients(
        patients.filter((patient) =>
          patient.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, patients]);

  const handleEdit = (id: number) => {
    setIsEditing(id);
  };

  const handleDelete = (id: number) => {
    setPatients(patients.filter((patient) => patient.id !== id));
  };

  const saveChanges = (id: number) => {
    setIsEditing(null);
    // Save changes to backend
  };

  return (
    <div className='bg-gradient-to-br from-ff6b6b to-ffd460 min-h-screen text-gray-900'>
      <header className='p-6 flex justify-between items-center border-b border-b-slate-200'>
        <h1 className='text-3xl font-bold'>Medical Records</h1>
        <Button variant='default' onClick={() => router.push('/add-patient')} className='transition-transform duration-300 hover:scale-105'>
          <Plus className='mr-2 w-4 h-4' /> Add Patient
        </Button>
      </header>
      <aside className='hidden md:block w-1/5 border-r border-r-slate-200 px-6 py-4 space-y-4'>
        <Tabs defaultValue='all'>
          <TabsList className='grid grid-cols-1 gap-2'>
            <TabsTrigger value='all'>All Patients</TabsTrigger>
            <TabsTrigger value='active'>Active</TabsTrigger>
            <TabsTrigger value='inactive'>Inactive</TabsTrigger>
          </TabsList>
          <TabsContent value='all'>
            <p>All Patients Content</p>
          </TabsContent>
          <TabsContent value='active'>
            <p>Active Patients Content</p>
          </TabsContent>
          <TabsContent value='inactive'>
            <p>Inactive Patients Content</p>
          </TabsContent>
        </Tabs>
      </aside>
      <main className='md:w-4/5 p-6 relative'>
        <div className='flex justify-between items-center mb-4'>
          <Input
            placeholder='Search patients...'
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full max-w-sm rounded-full bg-white shadow-lg px-4 py-2 pr-10'
          />
          <button className='absolute right-8 top-2'>
            <Search className='text-gray-500' size={24} />
          </button>
        </div>
        <Card className='border-none rounded-lg overflow-hidden shadow-2xl backdrop-blur-sm bg-white/30'>
          <CardHeader>
            <CardTitle>Patients List</CardTitle>
          </CardHeader>
          <CardContent className='p-0'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Diagnosis</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index} className='animate-pulse'>
                      <TableCell colSpan={4} className='h-12 bg-gray-100'></TableCell>
                    </TableRow>
                  ))
                ) : filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <TableRow key={patient.id} className='hover:bg-gray-50 transition-colors duration-300'>
                      <TableCell>{patient.name}</TableCell>
                      <TableCell>{patient.age}</TableCell>
                      <TableCell>{patient.diagnosis}</TableCell>
                      <TableCell className='flex space-x-2'>
                        <Button
                          variant='ghost'
                          aria-label={`Edit ${patient.name}`}
                          onClick={() => handleEdit(patient.id)}
                          className='transition-transform duration-300 hover:scale-105'
                        >
                          <Edit className='w-4 h-4' /> Edit
                        </Button>
                        <Button
                          variant='ghost'
                          aria-label={`Delete ${patient.name}`}
                          onClick={() => handleDelete(patient.id)}
                          className='transition-transform duration-300 hover:scale-105'
                        >
                          <Trash className='w-4 h-4' /> Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className='text-center'>No patients found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
      <footer className='py-4 text-center bg-white shadow-lg'>
        <p>&copy; 2023 Medical Records Inc. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MedicalRecordsViewer;