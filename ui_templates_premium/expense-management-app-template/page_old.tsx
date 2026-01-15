'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover'
import { Slider } from '@radix-ui/react-slider'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { Switch } from '@radix-ui/react-switch'
import { Tab, Tabs as RadixTabs } from '@radix-ui/react-tabs'
import { Plus, Search, Filter, ChevronRight, ArrowLeft, ChartBarHorizontal, DollarSign, FolderPlus, FileText, Pencil, Trash, MoreVertical } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useState, useEffect } from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import clsx from 'clsx'

const formSchema = z.object({
  amount: z.string().nonempty('Amount is required'),
  description: z.string(),
  category: z.string().optional()
})

interface Transaction {
  id: number
  date: string
  description: string
  amount: number
  category: string
}

const initialTransactions: Transaction[] = [
  { id: 1, date: '2023-10-01', description: 'Groceries', amount: 120.5, category: 'Food' },
  { id: 2, date: '2023-10-02', description: 'Rent', amount: 800, category: 'Housing' }
]

export default function HomePage() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }, [])

  const filteredTransactions = transactions.filter(transaction =>
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: '',
      description: '',
      category: ''
    }
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    // Add new transaction
    const newTransaction = {
      id: transactions.length + 1,
      date: new Date().toISOString().split('T')[0],
      description: values.description,
      amount: parseFloat(values.amount),
      category: values.category || 'Uncategorized'
    }
    setTransactions([...transactions, newTransaction])
    setIsDialogOpen(false)
  }

  return (
    <div className='bg-gradient-to-tr from-primary to-secondary text-white min-h-screen overflow-hidden'>
      <header className='py-8 px-4 flex justify-between items-center'>
        <div className='flex items-center space-x-4'>
          <button onClick={() => router.push('/')} aria-label='Go Back' className='p-2 bg-accent rounded-lg hover:bg-opacity-80 transition-colors'>
            <ArrowLeft className='w-5 h-5' />
          </button>
          <h1 className='text-2xl font-bold'>Expense Manager</h1>
        </div>
        <div className='space-x-2'>
          <button className='p-2 bg-accent rounded-lg hover:bg-opacity-80 transition-colors'>
            <Search className='w-5 h-5' />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className='p-2 bg-accent rounded-lg hover:bg-opacity-80 transition-colors'>
                <MoreVertical className='w-5 h-5' />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='bg-background p-2 w-48 rounded-lg shadow-xl'>
              <DropdownMenuLabel>Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />n              <DropdownMenuItem onClick={() => router.push('/settings')}>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Help</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className='pb-8'>
        <section className='relative'>
          <div className='absolute inset-0 bg-background opacity-20 blur-3xl'></div>
          <div className='relative max-w-7xl mx-auto px-4 py-16 sm:py-24 lg:py-32'>
            <h1 className='text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl'>Manage Your Expenses</h1>
            <p className='mt-6 text-lg leading-8 text-gray-300'>Effortlessly track your spending and stay within budget.</p>
            <div className='mt-10 flex items-center gap-x-6'>
              <Button variant='default' size='lg' onClick={() => setIsDialogOpen(true)}>Add New Expense</Button>
              <a href='#' className='text-base font-semibold leading-7 text-accent'>Learn more <span aria-hidden='true'>&rarr;</span></a>
            </div>
          </div>
        </section>
        <section className='max-w-7xl mx-auto px-4 py-16 sm:py-24 lg:py-32' id='overview'>
          <h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>Overview</h2>
          <p className='mt-6 text-lg leading-8 text-gray-300'>Get a quick look at your financial health.</p>
          <div className='mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
            <Card className='border-t border-l border-accent bg-backdrop-blur-sm backdrop-filter backdrop-blur-md bg-opacity-20 shadow-xl rounded-2xl'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <ChartBarHorizontal className='w-8 h-8 text-accent' />
                  <Badge variant='outline' className='border-accent'>Monthly</Badge>
                </div>
                <div className='mt-4'>
                  <h3 className='text-xl font-bold'>$1,200</h3>
                  <p className='text-gray-300'>Spent This Month</p>
                </div>
                <Progress value={75} className='mt-4' />
              </CardContent>
            </Card>
            <Card className='border-t border-l border-accent bg-backdrop-blur-sm backdrop-filter backdrop-blur-md bg-opacity-20 shadow-xl rounded-2xl'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <DollarSign className='w-8 h-8 text-accent' />
                  <Badge variant='outline' className='border-accent'>Yearly</Badge>
                </div>
                <div className='mt-4'>
                  <h3 className='text-xl font-bold'>$15,000</h3>
                  <p className='text-gray-300'>Spent This Year</p>
                </div>
                <Progress value={60} className='mt-4' />
              </CardContent>
            </Card>
            <Card className='border-t border-l border-accent bg-backdrop-blur-sm backdrop-filter backdrop-blur-md bg-opacity-20 shadow-xl rounded-2xl'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <FolderPlus className='w-8 h-8 text-accent' />
                  <Badge variant='outline' className='border-accent'>Total</Badge>
                </div>
                <div className='mt-4'>
                  <h3 className='text-xl font-bold'>$50,000</h3>
                  <p className='text-gray-300'>Total Spent</p>
                </div>
                <Progress value={40} className='mt-4' />
              </CardContent>
            </Card>
          </div>
        </section>
        <section className='max-w-7xl mx-auto px-4 py-16 sm:py-24 lg:py-32' id='transactions'>
          <h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>Recent Transactions</h2>
          <p className='mt-6 text-lg leading-8 text-gray-300'>See your latest expenses in detail.</p>
          <div className='mt-10 relative'>
            <div className='absolute inset-0 bg-background opacity-20 blur-3xl'></div>
            <div className='relative bg-backdrop-blur-sm backdrop-filter backdrop-blur-md bg-opacity-20 shadow-xl rounded-2xl p-6'>
              <div className='mb-6 flex justify-between items-center'>
                <div className='flex items-center space-x-2'>
                  <Search className='w-5 h-5' />
                  <Input
                    placeholder='Search transactions...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='bg-background/10 border-none outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent rounded-lg pl-8'
                  />
                </div>
                <div className='flex items-center space-x-2'>
                  <Filter className='w-5 h-5 cursor-pointer' onClick={() => router.push('/filters')} />n                  <ChevronRight className='w-5 h-5 cursor-pointer' onClick={() => router.push('/sort')} />
                </div>
              </div>
              {isLoading ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                  {[1, 2, 3].map((item) => (
                    <div key={item} className='p-4 bg-background/10 rounded-lg shadow-xl animate-pulse'>
                      <Skeleton width={200} height={20} className='mb-2' />
                      <Skeleton width={150} height={15} />
                    </div>
                  ))}
                </div>
              ) : (
                <ScrollArea className='h-[400px]'>
                  <table className='w-full'>
                    <thead className='bg-background/10'>
                      <tr className='text-left'>
                        <th className='p-4'>Date</th>
                        <th className='p-4'>Description</th>
                        <th className='p-4'>Amount</th>
                        <th className='p-4'>Category</th>
                        <th className='p-4'>Actions</th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-700'>
                      {filteredTransactions.map((transaction) => (
                        <tr key={transaction.id} className='hover:bg-background/20 transition-colors'>
                          <td className='p-4'>{transaction.date}</td>
                          <td className='p-4'>{transaction.description}</td>
                          <td className='p-4'>${transaction.amount.toFixed(2)}</td>
                          <td className='p-4'>{transaction.category}</td>
                          <td className='p-4'>
                            <Popover>
                              <PopoverTrigger asChild>
                                <button className='p-2 bg-accent rounded-lg hover:bg-opacity-80 transition-colors'>
                                  <MoreVertical className='w-5 h-5' />
                                </button>
                              </PopoverTrigger>
                              <PopoverContent className='bg-background p-2 w-48 rounded-lg shadow-xl'>
                                <button className='flex items-center space-x-2 p-2 w-full hover:bg-background/10 rounded-lg transition-colors'>
                                  <Pencil className='w-5 h-5' /> Edit
                                </button>
                                <button className='flex items-center space-x-2 p-2 w-full hover:bg-background/10 rounded-lg transition-colors'>
                                  <Trash className='w-5 h-5' /> Delete
                                </button>
                              </PopoverContent>
                            </Popover>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </ScrollArea>
              )}
            </div>
          </div>
        </section>
        <section className='max-w-7xl mx-auto px-4 py-16 sm:py-24 lg:py-32' id='statistics'>
          <h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>Statistics</h2>
          <p className='mt-6 text-lg leading-8 text-gray-300'>Analyze your spending habits with detailed statistics.</p>
          <div className='mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
            <Card className='border-t border-l border-accent bg-backdrop-blur-sm backdrop-filter backdrop-blur-md bg-opacity-20 shadow-xl rounded-2xl'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <FileText className='w-8 h-8 text-accent' />
                  <Badge variant='outline' className='border-accent'>Income</Badge>
                </div>
                <div className='mt-4'>
                  <h3 className='text-xl font-bold'>$20,000</h3>
                  <p className='text-gray-300'>This Month</p>
                </div>
                <Progress value={85} className='mt-4' />
              </CardContent>
            </Card>
            <Card className='border-t border-l border-accent bg-backdrop-blur-sm backdrop-filter backdrop-blur-md bg-opacity-20 shadow-xl rounded-2xl'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <FileText className='w-8 h-8 text-accent' />
                  <Badge variant='outline' className='border-accent'>Expenses</Badge>
                </div>
                <div className='mt-4'>
                  <h3 className='text-xl font-bold'>$12,000</h3>
                  <p className='text-gray-300'>This Month</p>
                </div>
                <Progress value={60} className='mt-4' />
              </CardContent>
            </Card>
            <Card className='border-t border-l border-accent bg-backdrop-blur-sm backdrop-filter backdrop-blur-md bg-opacity-20 shadow-xl rounded-2xl'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <FileText className='w-8 h-8 text-accent' />
                  <Badge variant='outline' className='border-accent'>Net Savings</Badge>
                </div>
                <div className='mt-4'>
                  <h3 className='text-xl font-bold'>$8,000</h3>
                  <p className='text-gray-300'>This Month</p>
                </div>
                <Progress value={40} className='mt-4' />
              </CardContent>
            </Card>
          </div>
        </section>
        <section className='max-w-7xl mx-auto px-4 py-16 sm:py-24 lg:py-32' id='settings'>
          <h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>Settings</h2>
          <p className='mt-6 text-lg leading-8 text-gray-300'>Configure your account preferences.</p>
          <div className='mt-10'>
            <Tabs defaultValue='account'>
              <TabsList className='grid grid-cols-3'>
                <TabsTrigger value='account'>Account</TabsTrigger>
                <TabsTrigger value='notifications'>Notifications</TabsTrigger>
                <TabsTrigger value='privacy'>Privacy</TabsTrigger>
              </TabsList>
              <TabsContent value='account'>
                <Card className='border-t border-l border-accent bg-backdrop-blur-sm backdrop-filter backdrop-blur-md bg-opacity-20 shadow-xl rounded-2xl mt-4'>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className='p-6'>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                        <FormField
                          control={form.control}
                          name='name'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input placeholder='John Doe' {...field} readOnly className='bg-background/10 border-none outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent rounded-lg' />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name='email'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder='john.doe@example.com' {...field} readOnly className='bg-background/10 border-none outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent rounded-lg' />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type='submit'>Save Changes</Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value='notifications'>
                <Card className='border-t border-l border-accent bg-backdrop-blur-sm backdrop-filter backdrop-blur-md bg-opacity-20 shadow-xl rounded-2xl mt-4'>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                  </CardHeader>
                  <CardContent className='p-6'>
                    <div className='flex items-center space-x-2'>
                      <Switch id='email-notifications' />
                      <label htmlFor='email-notifications' className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>Email Notifications</label>
                    </div>
                    <div className='flex items-center space-x-2 mt-4'>
                      <Switch id='sms-notifications' />
                      <label htmlFor='sms-notifications' className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>SMS Notifications</label>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value='privacy'>
                <Card className='border-t border-l border-accent bg-backdrop-blur-sm backdrop-filter backdrop-blur-md bg-opacity-20 shadow-xl rounded-2xl mt-4'>
                  <CardHeader>
                    <CardTitle>Privacy Settings</CardTitle>
                  </CardHeader>
                  <CardContent className='p-6'>
                    <div className='flex items-center space-x-2'>
                      <Switch id='share-data' />
                      <label htmlFor='share-data' className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>Share Data with Third Parties</label>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <footer className='bg-background/10 py-8 px-4'>
        <div className='max-w-7xl mx-auto'>
          <div className='flex justify-center'>
            <p className='text-gray-300'>© 2023 Expense Manager. All rights reserved.</p>
          </div>
        </div>
      </footer>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant='default' size='lg'>Add New Expense</Button>
        </DialogTrigger>
        <DialogContent className='bg-backdrop-blur-sm backdrop-filter backdrop-blur-md bg-opacity-20 shadow-xl rounded-2xl'>
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
            <DialogDescription>Enter the details of your expense below.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='amount'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input placeholder='$100.00' {...field} className='bg-background/10 border-none outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent rounded-lg' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder='Groceries' {...field} className='bg-background/10 border-none outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent rounded-lg' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='category'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Command>
                        <Popover>
                          <PopoverTrigger asChild className='w-full'>
                            <FormControl>
                              <Input
                                className='bg-background/10 border-none outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent rounded-lg pr-10'
                                readOnly
                                placeholder='Select a category'
                                value={field.value}
                                onChange={field.onChange}
                              />
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className='bg-backdrop-blur-sm backdrop-filter backdrop-blur-md bg-opacity-20 shadow-xl rounded-2xl w-full'>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup heading='Categories'>
                              <CommandItem onSelect={() => field.onChange('Food')}>Food</CommandItem>
                              <CommandItem onSelect={() => field.onChange('Housing')}>Housing</CommandItem>
                              <CommandItem onSelect={() => field.onChange('Transportation')}>Transportation</CommandItem>
                              <CommandItem onSelect={() => field.onChange('Entertainment')}>Entertainment</CommandItem>
                              <CommandItem onSelect={() => field.onChange('Utilities')}>Utilities</CommandItem>
                            </CommandGroup>
                          </PopoverContent>
                        </Popover>
                      </Command>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type='submit'>Add Expense</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}