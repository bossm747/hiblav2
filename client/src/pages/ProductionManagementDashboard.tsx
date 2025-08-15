import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import {
  Factory,
  ClipboardList,
  Timer,
  CheckCircle,
  AlertTriangle,
  Users,
  BarChart3,
  Plus,
  Eye,
  Edit,
  Play,
} from 'lucide-react';
import { JobOrderModule } from '@/components/modules/JobOrderModule';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { JobOrderForm } from '@/components/forms/JobOrderForm';

interface JobOrder {
  id: string;
  jobOrderNumber: string;
  customerCode: string;
  customerName?: string;
  status: string;
  priority?: string;
  dueDate: string;
  progress?: number;
  createdAt: string;
  updatedAt?: string;
  items?: any[];
}

export function ProductionManagementDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showJobOrderDialog, setShowJobOrderDialog] = useState(false);

  // Fetch production data with proper typing
  const { data: jobOrdersData = [] } = useQuery<JobOrder[]>({
    queryKey: ['/api/job-orders'],
  });

  const { data: jobOrderItems = [] } = useQuery({
    queryKey: ['/api/job-order-items'],
  });

  // Type-safe job orders
  const jobOrders = jobOrdersData as JobOrder[];

  // Calculate production metrics
  const totalJobs = jobOrders.length;
  const activeJobs = jobOrders.filter((job) => job.status === 'in-progress').length;
  const completedJobs = jobOrders.filter((job) => job.status === 'completed').length;
  const overdueJobs = jobOrders.filter((job) => 
    new Date(job.dueDate) < new Date() && job.status !== 'completed'
  ).length;

  const completionRate = totalJobs > 0 ? (completedJobs / totalJobs * 100) : 0;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Job Order Monitoring System</h1>
          <p className="text-muted-foreground">
            Comprehensive tracking system to identify bottlenecks, monitor production progress, and prevent delays
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            onClick={() => setShowJobOrderDialog(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Job Order
          </Button>
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Production Report
          </Button>
        </div>
      </div>

      {/* Production KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Job Orders</CardTitle>
            <Factory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalJobs}</div>
            <p className="text-xs text-muted-foreground">
              +5 new this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeJobs}</div>
            <p className="text-xs text-muted-foreground">
              Currently in production
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate.toFixed(1)}%</div>
            <Progress value={completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Jobs</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueJobs}</div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="job-orders">Job Orders</TabsTrigger>
          <TabsTrigger value="warehouse-tracking">Warehouse Tracking</TabsTrigger>
          <TabsTrigger value="bottleneck-analysis">Bottleneck Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Production Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Production Timeline</CardTitle>
                <CardDescription>Upcoming production milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobOrders.slice(0, 5).map((job) => (
                    <div key={job.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{job.jobOrderNumber}</p>
                        <p className="text-sm text-muted-foreground">
                          Due: {new Date(job.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge 
                        variant={
                          job.status === 'completed' ? 'default' : 
                          job.status === 'in-progress' ? 'secondary' : 'outline'
                        }
                      >
                        {job.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Production Efficiency */}
            <Card>
              <CardHeader>
                <CardTitle>Production Efficiency</CardTitle>
                <CardDescription>Current production metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>On-Time Delivery</span>
                    <Badge variant="default">92%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Quality Score</span>
                    <Badge variant="default">98.5%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Resource Utilization</span>
                    <Badge variant="secondary">85%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Average Cycle Time</span>
                    <Badge variant="outline">3.2 days</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="job-orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Job Orders</CardTitle>
              <CardDescription>Manage production job orders and track progress</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Order #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobOrders.map((job) => {
                    const progress = job.progress || (job.status === 'completed' ? 100 : 
                                   job.status === 'in-progress' ? 65 : 0);
                    return (
                      <TableRow key={job.id}>
                        <TableCell className="font-medium">{job.jobOrderNumber}</TableCell>
                        <TableCell>{job.customerCode}</TableCell>
                        <TableCell>{job.items?.length || 0} items</TableCell>
                        <TableCell>{new Date(job.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              job.status === 'completed' ? 'default' : 
                              job.status === 'in-progress' ? 'secondary' : 'outline'
                            }
                          >
                            {job.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={progress} className="w-16" />
                            <span className="text-sm">{progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
                            </Button>
                            {job.status === 'pending' && (
                              <Button size="sm" variant="outline">
                                <Play className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="warehouse-tracking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Warehouse Transfer Tracking</CardTitle>
              <CardDescription>Real-time tracking of product movements between warehouses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <h4 className="font-medium text-yellow-900 dark:text-yellow-100">Coming Soon: Real-time Transfer Tracking</h4>
                  </div>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    This feature will track warehouse transfers in real-time with timestamps:
                  </p>
                  <ul className="text-sm text-yellow-800 dark:text-yellow-200 mt-2 space-y-1 ml-4">
                    <li>• PH → Ready warehouse movements</li>
                    <li>• WIP → Production transfers</li>
                    <li>• Production → Ready stock movements</li>
                    <li>• Complete audit trail with timestamps</li>
                    <li>• Visible on printed PDF documents</li>
                  </ul>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transfer ID</TableHead>
                      <TableHead>Job Order</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">
                        No warehouse transfers recorded yet
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bottleneck-analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bottleneck Analysis</CardTitle>
              <CardDescription>Identify and resolve production bottlenecks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <h4 className="font-medium">Current Bottlenecks</h4>
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">Order Processing Delay</span>
                          <Badge variant="destructive">Critical</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">3 orders delayed by 2+ days</p>
                      </div>
                      <div className="p-3 border rounded-lg bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">Inventory Shortage</span>
                          <Badge variant="secondary">Medium</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">Low stock in PH warehouse</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Performance Metrics</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Average Cycle Time</span>
                        <Badge variant="outline">3.2 days</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">On-Time Delivery</span>
                        <Badge variant="default">92%</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Resource Utilization</span>
                        <Badge variant="secondary">85%</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Delay Resolution Time</span>
                        <Badge variant="outline">4.5 hours</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Resolution Actions</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Button variant="outline" className="justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      Reallocate Resources
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Package className="h-4 w-4 mr-2" />
                      Expedite Materials
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <ClipboardList className="h-4 w-4 mr-2" />
                      Adjust Priorities
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Job Order Creation Dialog */}
      <Dialog open={showJobOrderDialog} onOpenChange={setShowJobOrderDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Job Order</DialogTitle>
            <DialogDescription>
              Create a new production job order to track manufacturing progress
            </DialogDescription>
          </DialogHeader>
          <JobOrderForm onSuccess={() => setShowJobOrderDialog(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}