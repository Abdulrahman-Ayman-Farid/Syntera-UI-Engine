'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@radix-ui/react-dialog';
import { Plus, Search, Filter, ChevronRight, UserCircle2, AlertTriangle, CheckCircle2, X } from 'lucide-react';
import Skeleton from '@/components/ui/skeleton';

interface Patient {
  id: number;
  name: string;
  age: number;
  status: string;
}

const mockPatients: Patient[] = [
  { id: 1, name: 'John Doe', age: 30, status: 'Active' },
  { id: 2, name: 'Jane Smith', age: 45, status: 'Inactive' },
  { id: 3, name: 'Alice Johnson', age: 28, status: 'Active' }
];

const PatientPortal = () => {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>(mockPatients);
  const [showSidebar, setShowSidebar] = useState<boolean>(true);

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    if (Math.random() > 0.8) {
      setIsError(true);
    }
  }, []);

  useEffect(() => {
    // Filter patients based on search term
    if (searchTerm === '') {
      setFilteredPatients(patients);
    } else {
      setFilteredPatients(
        patients.filter((patient) =>
          patient.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, patients]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handlePatientClick = (id: number) => {
    router.push(`/patient/${id}`);
  };

  return (
    <div className='bg-background text-text min-h-screen flex overflow-hidden'>
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 transform transition-transform duration-300 ease-in-out ${
          showSidebar ? 'translate-x-0' : '-translate-x-full'
        } bg-primary shadow-glow`}
      >
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className='absolute top-4 right-4 text-secondary hover:text-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent'
        >
          <ChevronRight />
        </button>
        <div className='p-6 space-y-6'>
          <div className='flex items-center gap-4'>
            <UserCircle2 className='w-10 h-10 text-secondary' />
            <div className='space-y-1'>
              <h2 className='text-xl font-semibold text-secondary'>Dr. Jane Doe</h2>
              <span className='text-sm text-accent'>General Practitioner</span>
            </div>
          </div>
          <nav aria-label='Main Navigation'>
            <ul className='space-y-2'>
              <li>
                <Button variant='secondary' className='w-full justify-start px-4 py-2 rounded-lg'>
                  Dashboard
                </Button>
              </li>
              <li>
                <Button variant='secondary' className='w-full justify-start px-4 py-2 rounded-lg'>
                  Patients
                </Button>
              </li>
              <li>
                <Button variant='secondary' className='w-full justify-start px-4 py-2 rounded-lg'>
                  Appointments
                </Button>
              </li>
              <li>
                <Button variant='secondary' className='w-full justify-start px-4 py-2 rounded-lg'>
                  Settings
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className='flex-grow pl-64 pt-20 pb-8 bg-background relative'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='md:flex md:items-center md:justify-between'>
            <div className='flex-1 min-w-0'>
              <h2 className='text-2xl font-bold leading-7 text-secondary sm:text-3xl sm:truncate'>
                Patient Portal
              </h2>
            </div>
            <div className='mt-4 flex md:mt-0 md:ml-4'>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant='default' className='transition-transform duration-300 ease-in-out hover:rotate-12'>
                    <Plus className='mr-2 h-4 w-4' /> New Patient
                  </Button>
                </DialogTrigger>
                <DialogContent className='bg-white p-8 rounded-lg shadow-lg w-full max-w-lg'>
                  <h3 className='text-lg font-medium leading-6 text-secondary'>Add New Patient</h3>
                  <form className='mt-4 space-y-4'>
                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <label htmlFor='name' className='block text-sm font-medium text-gray-700'>Name</label>
                        <input
                          type='text'
                          id='name'
                          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                        />
                      </div>
                      <div>
                        <label htmlFor='age' className='block text-sm font-medium text-gray-700'>Age</label>
                        <input
                          type='number'
                          id='age'
                          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                        />
                      </div>
                    </div>
                    <div className='mt-4'>
                      <label htmlFor='status' className='block text-sm font-medium text-gray-700'>Status</label>
                      <select
                        id='status'
                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                      >
                        <option>Active</option>
                        <option>Inactive</option>
                      </select>
                    </div>
                    <div className='mt-6 flex justify-end'>
                      <Button variant='outline' className='mr-2'>Cancel</Button>
                      <Button variant='default'>Save</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className='mt-8'>
            <div className='relative flex items-stretch flex-wrap mt-4'>
              <div className='pr-2'>
                <Input
                  type='text'
                  placeholder='Search patients...'
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className='border border-accent rounded-lg shadow-md focus:ring-2 focus:ring-offset-2 focus:ring-accent'
                />
              </div>
              <div className='pl-2'>
                <Button variant='outline' className='rounded-lg shadow-md'>
                  <Filter className='mr-2 h-4 w-4' /> Filters
                </Button>
              </div>
            </div>
          </div>
          <div className='mt-4'>
            {isLoading ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className='aspect-square rounded-lg animate-pulse bg-gradient-to-br from-primary to-secondary shadow-glow' />
                ))}
              </div>
            ) : isError ? (
              <div className='flex items-center justify-center space-x-2 text-red-500'>
                <AlertTriangle className='w-6 h-6' />
                <span>Error loading data</span>
              </div>
            ) : filteredPatients.length === 0 ? (
              <div className='flex items-center justify-center space-x-2 text-gray-500'>
                <X className='w-6 h-6' />
                <span>No patients found</span>
              </div>
            ) : (
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {filteredPatients.map((patient) => (
                  <Card
                    key={patient.id}
                    className='bg-background border border-accent shadow-glow hover:shadow-2xl hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer'
                    onClick={() => handlePatientClick(patient.id)}
                  >
                    <CardContent className='p-4'>
                      <div className='flex items-center justify-between'>
                        <div className='space-y-1'>
                          <h3 className='text-lg font-semibold'>{patient.name}</h3>
                          <p className='text-sm text-accent'>Age: {patient.age}</p>
                        </div>
                        <Badge variant={patient.status === 'Active' ? 'default' : 'secondary'}>{patient.status}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className='bg-background text-secondary py-4'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <p className='text-center text-sm'>© 2023 Royal Healthcare. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PatientPortal;