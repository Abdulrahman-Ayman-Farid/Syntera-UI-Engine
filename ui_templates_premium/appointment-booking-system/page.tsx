'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Command } from '@/components/ui/command'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ArrowLeft, Calendar, CheckCircle, Clock, FileText, Loader2, MoreHorizontal, Plus, Search, UserPlus } from 'lucide-react'

interface Appointment {
  id: number
  patientName: string
  date: string
  time: string
  status: string
}

const mockAppointments: Appointment[] = [
  { id: 1, patientName: 'John Doe', date: '2023-10-15', time: '10:00 AM', status: 'Scheduled' },
  { id: 2, patientName: 'Jane Smith', date: '2023-10-16', time: '11:30 AM', status: 'Completed' },
  { id: 3, patientName: 'Alice Johnson', date: '2023-10-17', time: '2:00 PM', status: 'Pending' }
]

const AppointmentBookingSystem = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isAddingAppointment, setIsAddingAppointment] = useState<boolean>(false)
  const [newPatientName, setNewPatientName] = useState<string>('')
  const [newDate, setNewDate] = useState<string>('')
  const [newTime, setNewTime] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

  useEffect(() => {
    // Simulate data fetching
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }, [])

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  const addAppointment = () => {
    if (!newPatientName || !newDate || !newTime) {
      setError('Please fill in all fields.')
      return
    }
    const newAppointment: Appointment = {
      id: appointments.length + 1,
      patientName: newPatientName,
      date: newDate,
      time: newTime,
      status: 'Scheduled'
    }
    setAppointments([...appointments, newAppointment])
    setIsAddingAppointment(false)
    setNewPatientName('')
    setNewDate('')
    setNewTime('')
    setError(null)
  }

  const filteredAppointments = appointments.filter(appointment =>
    appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className='bg-gradient-to-b from-teal-500 via-purple-500 to-pink-500 min-h-screen text-white'>
      <header className='p-6 flex justify-between items-center'>
        <h1 className='text-3xl font-bold'>Appointment Booking</h1>
        <div className='flex space-x-2'>
          <Button variant='default' onClick={() => router.back()}><ArrowLeft /> Back</Button>
          <Dialog open={isAddingAppointment} onOpenChange={setIsAddingAppointment}>
            <DialogTrigger asChild>
              <Button variant='outline'><Plus /> New Appointment</Button>
            </DialogTrigger>
            <DialogContent className='bg-gray-900 text-white rounded-lg p-6 max-w-md mx-auto'>
              <DialogHeader>
                <DialogTitle>New Appointment</DialogTitle>
                <DialogDescription>Enter details for the new appointment.</DialogDescription>
              </DialogHeader>
              <div className='mt-4'>
                <div className='mb-4'>
                  <Label htmlFor='patient-name'>Patient Name</Label>
                  <Input id='patient-name' value={newPatientName} onChange={(e) => setNewPatientName(e.target.value)} placeholder='John Doe' className='mt-1' />
                </div>
                <div className='mb-4'>
                  <Label htmlFor='date'>Date</Label>
                  <Input type='date' id='date' value={newDate} onChange={(e) => setNewDate(e.target.value)} className='mt-1' />
                </div>
                <div className='mb-4'>
                  <Label htmlFor='time'>Time</Label>
                  <Input type='time' id='time' value={newTime} onChange={(e) => setNewTime(e.target.value)} className='mt-1' />
                </div>
                {error && <p className='text-red-500'>{error}</p>}
              </div>
              <DialogFooter className='mt-4'>
                <Button onClick={addAppointment}>Add Appointment</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>
      <main className='p-6'>
        <div className='mb-6'>
          <Input
            id='search'
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder='Search patients...'
            className='w-full md:w-1/2'
            icon={<Search size={16} className='mr-2' />}
          />
        </div>
        {isLoading ? (
          <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'>
            {[1, 2, 3, 4].map((item) => (
              <Skeleton key={item} className='h-40 rounded-lg animate-pulse' />
            ))}
          </div>
        ) : (
          <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'>
            {filteredAppointments.map((appointment) => (
              <Card key={appointment.id} className='bg-white/10 backdrop-blur-sm shadow-2xl rounded-2xl overflow-hidden relative group'>
                <CardHeader className='p-6'>
                  <CardTitle>{appointment.patientName}</CardTitle>
                  <div className='flex space-x-2 mt-2'>
                    <Clock size={16} className='text-teal-300' /><span className='text-sm'>{appointment.time}</span>
                    <Calendar size={16} className='text-purple-300' /><span className='text-sm'>{appointment.date}</span>
                  </div>
                </CardHeader>
                <CardContent className='p-6'>
                  <div className='flex justify-between items-center'>
                    <Badge variant={appointment.status === 'Scheduled' ? 'default' : appointment.status === 'Completed' ? 'success' : 'warning'} className='text-sm'>
                      {appointment.status}
                    </Badge>
                    <MoreHorizontal size={20} className='cursor-pointer group-hover:text-teal-300 transition-colors duration-300' />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <footer className='p-6 bg-gray-800'>
        <div className='flex justify-between items-center'>
          <p>&copy; 2023 Healthcare Co. All rights reserved.</p>
          <div className='flex space-x-2'>
            <a href='#' className='hover:text-teal-300 transition-colors duration-300'>Privacy Policy</a>
            <a href='#' className='hover:text-teal-300 transition-colors duration-300'>Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default AppointmentBookingSystem