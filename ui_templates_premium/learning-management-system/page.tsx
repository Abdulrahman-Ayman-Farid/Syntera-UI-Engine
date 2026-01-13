'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { 
  BookOpen, GraduationCap, Clock, Award, Users,
  PlayCircle, FileText, CheckCircle, Calendar,
  Search, Filter, ChevronRight, Bell, MessageSquare,
  BarChart3, Bookmark, Download, Target
} from 'lucide-react'

export default function LearningManagementSystem() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeCourse, setActiveCourse] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1200)
  }, [])

  const courses = [
    { 
      id: 1, 
      title: 'Advanced React Patterns', 
      category: 'Web Development', 
      progress: 85, 
      instructor: 'Sarah Chen', 
      duration: '12h 30m',
      students: 1245,
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      id: 2, 
      title: 'Data Science Fundamentals', 
      category: 'Data Science', 
      progress: 45, 
      instructor: 'Dr. Alex Rivera', 
      duration: '18h',
      students: 987,
      color: 'from-purple-500 to-pink-500'
    },
    { 
      id: 3, 
      title: 'UI/UX Design Principles', 
      category: 'Design', 
      progress: 30, 
      instructor: 'Maya Patel', 
      duration: '10h 15m',
      students: 1567,
      color: 'from-amber-500 to-orange-500'
    },
  ]

  const assignments = [
    { id: 1, title: 'React Hook Form Project', course: 'Advanced React', due: 'Tomorrow', status: 'pending' },
    { id: 2, title: 'Data Visualization Report', course: 'Data Science', due: 'In 3 days', status: 'submitted' },
    { id: 3, title: 'Design System Exercise', course: 'UI/UX Design', due: 'Next Week', status: 'pending' },
  ]

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/50 flex flex-col'>
      <header className='p-6 bg-white/90 backdrop-blur-sm border-b border-slate-200'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <div className='p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl'>
              <GraduationCap className='w-8 h-8 text-white' />
            </div>
            <div>
              <h1 className='text-3xl font-bold text-slate-900'>LearnHub</h1>
              <p className='text-slate-600'>Your personal learning platform</p>
            </div>
          </div>
          <div className='flex items-center space-x-4'>
            <Button variant='ghost' size='icon'>
              <Bell className='w-5 h-5' />
            </Button>
            <Button variant='ghost' size='icon'>
              <MessageSquare className='w-5 h-5' />
            </Button>
            <Avatar>
              <AvatarImage src="/student-avatar.jpg" />
              <AvatarFallback>SD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className='flex-1 p-6 space-y-8'>
        {/* Welcome & Stats */}
        <section className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <Card className='lg:col-span-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white'>
            <CardContent className='p-8'>
              <div className='flex justify-between items-start'>
                <div>
                  <h2 className='text-2xl font-bold mb-2'>Welcome back, Alex!</h2>
                  <p className='opacity-90'>Continue your learning journey</p>
                  <div className='flex items-center space-x-6 mt-6'>
                    <div className='text-center'>
                      <div className='text-3xl font-bold'>42</div>
                      <div className='text-sm opacity-90'>Courses</div>
                    </div>
                    <div className='text-center'>
                      <div className='text-3xl font-bold'>156</div>
                      <div className='text-sm opacity-90'>Hours</div>
                    </div>
                    <div className='text-center'>
                      <div className='text-3xl font-bold'>8</div>
                      <div className='text-sm opacity-90'>Certificates</div>
                    </div>
                  </div>
                </div>
                <div className='bg-white/20 p-4 rounded-xl'>
                  <div className='text-sm'>Daily Streak</div>
                  <div className='text-2xl font-bold mt-2'>14 days 🔥</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='border border-slate-200'>
            <CardHeader>
              <CardTitle className='text-slate-900'>Learning Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div>
                  <div className='flex justify-between text-sm mb-2'>
                    <span>Weekly Target</span>
                    <span>8/10 hours</span>
                  </div>
                  <Progress value={80} className='h-2' />
                </div>
                <div>
                  <div className='flex justify-between text-sm mb-2'>
                    <span>Course Completion</span>
                    <span>65%</span>
                  </div>
                  <Progress value={65} className='h-2' />
                </div>
                <Button className='w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600'>
                  <Target className='w-4 h-4 mr-2' />
                  Set New Goal
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Course Grid */}
        <section>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-2xl font-bold text-slate-900'>My Courses</h2>
            <div className='flex space-x-4'>
              <Input
                placeholder='Search courses...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-64 border-slate-300 focus:border-blue-500'
                startIcon={Search}
              />
              <Select defaultValue='all'>
                <SelectTrigger className='w-32'>
                  <SelectValue placeholder='Category' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All</SelectItem>
                  <SelectItem value='web-dev'>Web Dev</SelectItem>
                  <SelectItem value='data-science'>Data Science</SelectItem>
                  <SelectItem value='design'>Design</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className='h-80 rounded-xl' />
              ))}
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {courses.map((course) => (
                <Card 
                  key={course.id}
                  className='border border-slate-200 hover:shadow-xl transition-all duration-300 group cursor-pointer'
                  onClick={() => setActiveCourse(course)}
                >
                  <div className={`h-2 bg-gradient-to-r ${course.color} rounded-t-xl`} />
                  <CardContent className='p-6'>
                    <div className='flex items-start justify-between mb-4'>
                      <div>
                        <Badge className='mb-2 bg-slate-100 text-slate-700'>
                          {course.category}
                        </Badge>
                        <h3 className='text-xl font-bold text-slate-900 group-hover:text-blue-600'>
                          {course.title}
                        </h3>
                      </div>
                      <Button variant='ghost' size='icon'>
                        <Bookmark className='w-4 h-4' />
                      </Button>
                    </div>
                    
                    <div className='space-y-4'>
                      <div className='flex items-center justify-between text-sm text-slate-600'>
                        <span className='flex items-center'>
                          <Users className='w-3 h-3 mr-1' />
                          {course.students} students
                        </span>
                        <span className='flex items-center'>
                          <Clock className='w-3 h-3 mr-1' />
                          {course.duration}
                        </span>
                      </div>
                      
                      <div>
                        <div className='flex justify-between text-sm mb-2'>
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className='h-2' />
                      </div>
                      
                      <div className='flex items-center justify-between pt-4 border-t border-slate-100'>
                        <div className='flex items-center'>
                          <Avatar className='w-8 h-8 mr-3'>
                            <AvatarFallback>{course.instructor.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <span className='text-sm'>{course.instructor}</span>
                        </div>
                        <Button variant='outline' size='sm'>
                          <PlayCircle className='w-3 h-3 mr-1' />
                          Continue
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Assignments & Schedule */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Assignments */}
          <Card className='border border-slate-200'>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <FileText className='w-5 h-5 mr-2 text-blue-600' />
                Upcoming Assignments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {assignments.map((assignment) => (
                  <div key={assignment.id} className='flex items-center justify-between p-4 bg-slate-50 rounded-lg'>
                    <div className='flex items-center space-x-4'>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        assignment.status === 'submitted' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-amber-100 text-amber-600'
                      }`}>
                        {assignment.status === 'submitted' ? 
                          <CheckCircle className='w-4 h-4' /> : 
                          <FileText className='w-4 h-4' />
                        }
                      </div>
                      <div>
                        <h4 className='font-medium'>{assignment.title}</h4>
                        <p className='text-sm text-slate-600'>{assignment.course}</p>
                      </div>
                    </div>
                    <div className='text-right'>
                      <div className='text-sm text-slate-600'>Due {assignment.due}</div>
                      <Badge variant={assignment.status === 'submitted' ? 'success' : 'secondary'} className='mt-1'>
                        {assignment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                <Button variant='outline' className='w-full border-dashed border-slate-300'>
                  <Plus className='w-4 h-4 mr-2' />
                  View All Assignments
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card className='border border-slate-200'>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <Calendar className='w-5 h-5 mr-2 text-purple-600' />
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-6'>
                {[
                  { time: '10:00 AM', title: 'React Workshop', type: 'Live Session', color: 'bg-blue-100 text-blue-600' },
                  { time: '2:00 PM', title: 'Mentor Session', type: '1-on-1', color: 'bg-purple-100 text-purple-600' },
                  { time: '4:30 PM', title: 'Group Study', type: 'Collaboration', color: 'bg-green-100 text-green-600' },
                ].map((event, i) => (
                  <div key={i} className='flex items-start space-x-4'>
                    <div className='text-center'>
                      <div className='font-medium text-slate-900'>{event.time.split(' ')[0]}</div>
                      <div className='text-sm text-slate-500'>{event.time.split(' ')[1]}</div>
                    </div>
                    <div className='flex-1'>
                      <div className='flex items-center justify-between'>
                        <h4 className='font-medium'>{event.title}</h4>
                        <Badge className={event.color.replace('bg-', 'bg-').replace('text-', '')}>
                          {event.type}
                        </Badge>
                      </div>
                      <p className='text-sm text-slate-600 mt-1'>Join via Zoom Meeting</p>
                    </div>
                    <Button variant='ghost' size='icon'>
                      <ChevronRight className='w-4 h-4' />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Learning Resources */}
        <Card className='border border-slate-200'>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <BookOpen className='w-5 h-5 mr-2 text-slate-600' />
              Recommended Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              {[
                { title: 'React Documentation', type: 'Guide', icon: '📚', action: 'Read' },
                { title: 'Design Patterns', type: 'E-book', icon: '📖', action: 'Download' },
                { title: 'Coding Exercises', type: 'Practice', icon: '💻', action: 'Start' },
              ].map((resource, i) => (
                <div key={i} className='bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-xl p-6'>
                  <div className='text-3xl mb-4'>{resource.icon}</div>
                  <h4 className='font-bold text-slate-900'>{resource.title}</h4>
                  <p className='text-sm text-slate-600 mt-1'>{resource.type}</p>
                  <Button variant='outline' className='mt-4 w-full'>
                    {resource.action === 'Download' ? <Download className='w-4 h-4 mr-2' /> : null}
                    {resource.action}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}