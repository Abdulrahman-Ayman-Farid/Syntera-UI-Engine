'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import * as Dialog from '@radix-ui/react-dialog'
import { Tab, Tabs, TabsList, TabsContent } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useRouter } from 'next/navigation'
import { Plus, Search, Filter, ChevronRight, Loader2, CheckCircle, XCircle, User, FileText, FolderOpen, Pencil, Trash2, ArrowLeft, ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Invoice {
  id: number
  customerName: string
  amount: number
  status: string
  date: string
}

const mockInvoices: Invoice[] = [
  { id: 1, customerName: 'John Doe', amount: 250, status: 'Paid', date: '2023-10-01' },
  { id: 2, customerName: 'Jane Smith', amount: 150, status: 'Pending', date: '2023-10-05' },
  { id: 3, customerName: 'Alice Johnson', amount: 300, status: 'Overdue', date: '2023-09-20' }
]

const shimmerEffect = `animate-shimmer w-full h-4 bg-gray-200 rounded-lg relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite_forwards] before:bg-gradient-to-r before:from-transparent before:via-white before:to-transparent`

const shimmerKeyframes = `@keyframes shimmer { 0% { transform: translateX(-100%) } 100% { transform: translateX(100%) } }`

export default function Home() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices)
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('All')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const itemsPerPage = 5
  const totalPages = Math.ceil(invoices.length / itemsPerPage)
  const currentItems = invoices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }, [])

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedInvoice(null)
  }

  const filterInvoices = (status: string) => {
    if (status === 'All') {
      setInvoices(mockInvoices)
    } else {
      setInvoices(mockInvoices.filter(inv => inv.status === status))
    }
    setFilterStatus(status)
  }

  return (
    <>
      <style>{shimmerKeyframes}</style>
      <div className='bg-gradient-to-br from-green-50 to-blue-50 min-h-screen flex flex-col'>
        <header className='p-6 bg-white shadow-md sticky top-0 z-10'>
          <div className='flex justify-between items-center'>
            <h1 className='text-3xl font-bold text-gray-900'>Invoice Management</h1>
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <button className='inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'>
                    <Plus size={16} /> New Invoice
                  </button>
                </TooltipTrigger>
                <TooltipContent>Create a new invoice</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </header>
        <main className='p-6 flex-grow'>
          <div className='mb-6'>
            <Input placeholder='Search Invoices...' className='w-full max-w-sm' />
          </div>
          <div className='mb-6'>
            <Tabs defaultValue='all'>
              <TabsList className='grid w-full grid-cols-3'>
                <TabsTrigger value='all' onClick={() => filterInvoices('All')} className={`hover:text-green-600 ${filterStatus === 'All' && 'text-green-600'}`}>All</TabsTrigger>
                <TabsTrigger value='paid' onClick={() => filterInvoices('Paid')} className={`hover:text-green-600 ${filterStatus === 'Paid' && 'text-green-600'}`}>Paid</TabsTrigger>
                <TabsTrigger value='pending' onClick={() => filterInvoices('Pending')} className={`hover:text-green-600 ${filterStatus === 'Pending' && 'text-green-600'}`}>Pending</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          {isLoading ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              {[...Array(6)].map((_, index) => (
                <div key={index} className={`${shimmerEffect}`} />
              ))}
            </div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              {currentItems.map(invoice => (
                <Card key={invoice.id} className='shadow-md bg-white hover:shadow-lg transition-shadow duration-300 cursor-pointer' onClick={() => handleViewInvoice(invoice)}>
                  <CardHeader>
                    <CardTitle className='font-semibold'>{invoice.customerName}</CardTitle>
                  </CardHeader>
                  <CardContent className='pb-4'>
                    <div className='flex justify-between items-center'>
                      <div className='text-sm text-gray-600'>Amount:</div>
                      <div className='text-sm font-medium text-gray-900'>$ {invoice.amount.toFixed(2)}</div>
                    </div>
                    <div className='mt-1 flex justify-between items-center'>
                      <div className='text-sm text-gray-600'>Date:</div>
                      <div className='text-sm font-medium text-gray-900'>{invoice.date}</div>
                    </div>
                    <div className='mt-2'>
                      <Badge variant={invoice.status.toLowerCase() as any}>{invoice.status}</Badge>
                    </div>
                  </CardContent>
                  <CardFooter className='pt-0'>
                    <TooltipProvider>
                      <Tooltip delayDuration={300}>
                        <TooltipTrigger asChild>
                          <FileText size={16} className='text-gray-500 hover:text-gray-700' />
                        </TooltipTrigger>
                        <TooltipContent>View Details</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
          <div className='mt-6 flex justify-end'>
            <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
          </div>
        </main>
        <footer className='p-6 bg-white shadow-md'>
          <div className='flex justify-between items-center'>
            <div className='text-gray-600'>© 2023 Invoice Manager Inc.</div>
            <div className='text-gray-600'>Version 1.0.0</div>
          </div>
        </footer>
      </div>
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className='fixed inset-0 bg-black opacity-50' />
          <Dialog.Content className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-lg p-6 shadow-2xl backdrop-blur-sm'>
            <Dialog.Title className='text-lg font-semibold mb-4'>Invoice Details</Dialog.Title>
            {selectedInvoice ? (
              <>
                <div className='mb-4'>
                  <div className='flex justify-between items-center'>
                    <div className='text-sm text-gray-600'>Customer Name:</div>
                    <div className='text-sm font-medium text-gray-900'>{selectedInvoice.customerName}</div>
                  </div>
                  <div className='mt-1 flex justify-between items-center'>
                    <div className='text-sm text-gray-600'>Amount:</div>
                    <div className='text-sm font-medium text-gray-900'>$ {selectedInvoice.amount.toFixed(2)}</div>
                  </div>
                  <div className='mt-1 flex justify-between items-center'>
                    <div className='text-sm text-gray-600'>Date:</div>
                    <div className='text-sm font-medium text-gray-900'>{selectedInvoice.date}</div>
                  </div>
                  <div className='mt-2'>
                    <Badge variant={selectedInvoice.status.toLowerCase() as any}>{selectedInvoice.status}</Badge>
                  </div>
                </div>
                <div className='flex space-x-2'>
                  <TooltipProvider>
                    <Tooltip delayDuration={300}>
                      <TooltipTrigger asChild>
                        <Button variant='outline' size='icon' aria-label='Edit Invoice'>
                          <Pencil size={16} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Edit Invoice</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip delayDuration={300}>
                      <TooltipTrigger asChild>
                        <Button variant='outline' size='icon' aria-label='Delete Invoice'>
                          <Trash2 size={16} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete Invoice</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </>
            ) : (
              <div className='text-gray-600'>No invoice selected.</div>
            )}
            <Dialog.Close className='absolute top-4 right-4 inline-flex items-center justify-center rounded-full p-1.5 hover:bg-gray-100 hover:text-gray-900' aria-label='Close'>
              <XCircle size={20} />
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}

function Pagination({ totalPages, currentPage, setCurrentPage }: { totalPages: number; currentPage: number; setCurrentPage: (page: number) => void }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className='flex space-x-2'>
      <button
        onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
        disabled={currentPage === 1}
        className={`px-3 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${currentPage === 1 && 'opacity-50 cursor-not-allowed'}`}
      >
        <ArrowLeft size={16} />
      </button>
      {pages.map(page => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`px-3 py-2 text-sm font-medium bg-white rounded-lg shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${currentPage === page && 'bg-green-600 text-white hover:bg-green-700'}`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
        disabled={currentPage === totalPages}
        className={`px-3 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${currentPage === totalPages && 'opacity-50 cursor-not-allowed'}`}
      >
        <ArrowRight size={16} />
      </button>
    </div>
  )
}