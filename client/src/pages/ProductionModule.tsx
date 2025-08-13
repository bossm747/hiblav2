import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { 
  Factory, 
  CheckCircle, 
  Clock,
  Play,
  Pause,
  Plus,
  Search,
  Filter,
  Download,
  AlertCircle,
  TrendingUp,
  Users
} from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function ProductionModule() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('job-orders');

  // Fetch job orders data
  const { data: jobOrders, isLoading: jobOrdersLoading } = useQuery({
    queryKey: ['/api/job-orders'],
    queryFn: async () => {
      const response = await fetch('/api/job-orders');
      if (!response.ok) throw new Error('Failed to fetch job orders');
      return response.json();
    },
  });

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      'on-hold': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
      'quality-check': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300',
      normal: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
      urgent: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
    };
    return colors[priority as keyof typeof colors] || colors.normal;
  };

  // Calculate production metrics
  const totalJobs = jobOrders?.length || 0;
  const inProgressJobs = jobOrders?.filter((job: any) => job.status === 'in-progress').length || 0;
  const completedJobs = jobOrders?.filter((job: any) => job.status === 'completed').length || 0;
  const overdueJobs = jobOrders?.filter((job: any) => 
    new Date(job.dueDate) < new Date() && job.status !== 'completed').length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Production</h1>
          <p className="text-muted-foreground">
            Manage job orders, production tracking, and quality control
          </p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>New Job Order</span>
        </Button>
      </div>

      {/* Production Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Job Orders</p>
                <p className="text-2xl font-bold">{totalJobs}</p>
              </div>
              <Factory className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{inProgressJobs}</p>
              </div>
              <Play className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{completedJobs}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{overdueJobs}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="job-orders">Job Orders</TabsTrigger>
          <TabsTrigger value="production">Production Tracking</TabsTrigger>
          <TabsTrigger value="ready-items">Ready Items</TabsTrigger>
        </TabsList>

        {/* Search and Filters */}
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search job orders, products, customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        <TabsContent value="job-orders" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Job Orders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Factory className="h-5 w-5" />
                  <span>Active Job Orders</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {jobOrdersLoading ? (
                  <div className="text-center py-8">Loading job orders...</div>
                ) : (
                  <div className="space-y-4">
                    {jobOrders?.filter((job: any) => job.status !== 'completed').slice(0, 6).map((job: any) => (
                      <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="font-medium">{job.orderNumber}</div>
                            <Badge className={getPriorityColor(job.priority)}>
                              {job.priority}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">{job.customerName}</div>
                          <div className="text-sm text-muted-foreground">Due: {new Date(job.dueDate).toLocaleDateString()}</div>
                          <div className="text-sm text-muted-foreground">Items: {job.totalItems}</div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(job.status)}>
                            {job.status}
                          </Badge>
                          <div className="mt-2">
                            <div className="text-xs text-muted-foreground">Progress</div>
                            <div className="w-20 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${job.progress || 0}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-muted-foreground text-center">
                              {job.progress || 0}%
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="text-center pt-4">
                      <Button variant="outline">View All Job Orders</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Production Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Today's Production Schedule</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { time: '08:00 - 10:00', task: 'Hair Processing - Batch A', status: 'completed' },
                    { time: '10:00 - 12:00', task: 'Quality Inspection - Batch B', status: 'in-progress' },
                    { time: '13:00 - 15:00', task: 'Packaging - Orders 2025.01.001-005', status: 'pending' },
                    { time: '15:00 - 17:00', task: 'Final QC - Export Orders', status: 'pending' },
                    { time: '17:00 - 18:00', task: 'Shipping Preparation', status: 'pending' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg">
                      <div className="text-sm font-medium text-muted-foreground w-24">
                        {item.time}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{item.task}</div>
                      </div>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="production" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Production Tracking</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">92%</div>
                  <div className="text-sm text-muted-foreground">Production Efficiency</div>
                </div>
                <div className="text-center p-6 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">15.2</div>
                  <div className="text-sm text-muted-foreground">Avg. Production Time (hrs)</div>
                </div>
                <div className="text-center p-6 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">98.5%</div>
                  <div className="text-sm text-muted-foreground">Quality Pass Rate</div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <Button>View Detailed Production Reports</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ready-items" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Ready Items Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">Ready for Shipment</div>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                        Ready
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold">247</div>
                    <div className="text-sm text-muted-foreground">Items completed and ready</div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">Pending QC</div>
                      <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
                        QC Required
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold">18</div>
                    <div className="text-sm text-muted-foreground">Items awaiting quality check</div>
                  </div>
                </div>
                <div className="text-center pt-4">
                  <Button>View Full Ready Items Report</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}