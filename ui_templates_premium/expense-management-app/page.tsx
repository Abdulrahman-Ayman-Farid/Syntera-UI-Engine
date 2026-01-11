'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import * as Dialog from '@radix-ui/react-dialog'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Tab, Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Breadcrumbs, BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb'
import { LucideSearch, LucideFilter, LucidePlus, LucideChevronDown, LucideDollarSign } from 'lucide-react'

interface Transaction {
  id: number,
  date: string,
  amount: number,
  category: string,
  description: string
}

const mockTransactions: Transaction[] = [
  { id: 1, date: '2023-10-01', amount: 150, category: 'Groceries', description: 'Weekly shopping' },
  { id: 2, date: '2023-10-02', amount: 300, category: 'Utilities', description: 'Electricity bill' },
  { id: 3, date: '2023-10-03', amount: 25, category: 'Entertainment', description: 'Movie night' }
]

const ExpenseManagementApp = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(mockTransactions)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }, [])

  useEffect(() => {
    if (!searchTerm) {
      setFilteredTransactions(mockTransactions)
      return
    }
    setFilteredTransactions(
      mockTransactions.filter((transaction) =>
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  }, [searchTerm])

  const handleAddTransaction = () => {
    // Navigate to add transaction form
    router.push('/add-transaction')
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  return (
    <div className='bg-gradient-to-r from-[#1f1d2b] to-[#3c3a4e] min-h-screen text-white'>
      <header className='p-6 flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Expense Manager</h1>
        <div className='flex gap-4'>
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button className='transition-transform transform hover:scale-105'>
                  <LucideFilter size={24} aria-label='Filter Transactions'/>
                </button>
              </TooltipTrigger>
              <TooltipContent side='bottom' className='bg-black text-white p-2 rounded-md'>
                Filter
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button onClick={handleAddTransaction} variant='outline' className='hover:bg-purple-800'>
            <LucidePlus size={24} /> Add Transaction
          </Button>
        </div>
      </header>
      <main className='py-6 px-4'>
        <section className='mb-8'>
          <Breadcrumbs>
            <BreadcrumbItem>
              <BreadcrumbLink href='/dashboard'>Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href='/expenses'>Expenses</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumbs>
          <Card className='mt-4'>
            <CardHeader className='border-b border-slate-700 pb-4'>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
              <div className='p-4 bg-slate-800 rounded-lg shadow-lg relative'>
                <LucideDollarSign className='absolute top-2 right-2 w-10 h-10 opacity-10'/>
                <h3 className='font-semibold'>Total Expenses</h3>
                <p className='text-2xl'>$500.00</p>
              </div>
              <div className='p-4 bg-slate-800 rounded-lg shadow-lg relative'>
                <LucideDollarSign className='absolute top-2 right-2 w-10 h-10 opacity-10'/>
                <h3 className='font-semibold'>Average Spend</h3>
                <p className='text-2xl'>$166.67</p>
              </div>
              <div className='p-4 bg-slate-800 rounded-lg shadow-lg relative'>
                <LucideDollarSign className='absolute top-2 right-2 w-10 h-10 opacity-10'/>
                <h3 className='font-semibold'>This Month</h3>
                <p className='text-2xl'>$300.00</p>
              </div>
            </CardContent>
          </Card>
        </section>
        <section className='mb-8'>
          <Card className='shadow-lg'>
            <CardHeader className='pb-4'>
              <div className='flex items-center justify-between'>
                <CardTitle>Recent Transactions</CardTitle>
                <Input
                  placeholder='Search transactions...'
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className='w-full max-w-sm'
                />
              </div>
            </CardHeader>
            <CardContent className='overflow-x-auto'>
              {isLoading ? (
                <Skeleton className='w-full h-48'/>
              ) : error ? (
                <div className='p-4'>Error loading transactions.</div>
              ) : filteredTransactions.length === 0 ? (
                <div className='p-4'>No transactions found.</div>
              ) : (
                <Table className='mt-4'>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id} className='hover:bg-slate-800 transition-colors duration-300'>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                        <TableCell>{transaction.category}</TableCell>
                        <TableCell>{transaction.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </section>
        <section className='mb-8'>
          <Card className='shadow-lg'>
            <CardHeader>
              <CardTitle>Spending Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='p-4 bg-slate-800 rounded-lg shadow-lg relative'>
                <h3 className='font-semibold'>Monthly Spending by Category</h3>
                <div className='mt-4'>
                  <Progress value={75} className='bg-slate-700'/>
                  <div className='flex justify-between mt-2'>
                    <span>Groceries</span>
                    <span>$300</span>
                  </div>
                </div>
                <div className='mt-4'>
                  <Progress value={50} className='bg-slate-700'/>
                  <div className='flex justify-between mt-2'>
                    <span>Utilities</span>
                    <span>$200</span>
                  </div>
                </div>
                <div className='mt-4'>
                  <Progress value={20} className='bg-slate-700'/>
                  <div className='flex justify-between mt-2'>
                    <span>Entertainment</span>
                    <span>$100</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
      <footer className='p-6 text-center'>
        © 2023 Expense Manager. All rights reserved.
      </footer>
    </div>
  )
}

export default ExpenseManagementApp