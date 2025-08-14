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

export function ProductionManagementDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch production data
  const { data: jobOrders = [] } = useQuery({
    queryKey: ['/api/job-orders'],
  });

  const { data: jobOrderItems = [] } = useQuery({
    queryKey: ['/api/job-order-items'],
  });

  // Calculate production metrics
  const totalJobs = jobOrders.length;
  const activeJobs = jobOrders.filter((job: any) => job.status === 'in-progress').length;
  const completedJobs = jobOrders.filter((job: any) => job.status === 'completed').length;
  const overdueJobs = jobOrders.filter((job: any) => 
    new Date(job.dueDate) < new Date() && job.status !== 'completed'
  ).length;

  const completionRate = totalJobs > 0 ? (completedJobs / totalJobs * 100) : 0;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Production Management Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor job orders, track production progress, and manage manufacturing workflows
          </p>
        </div>
        <div className="flex gap-2">
          <JobOrderModule 
            trigger={
              <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
                <Plus className="h-4 w-4 mr-2" />
                New Job Order
              </Button>
            }
          />
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
          <TabsTrigger value="production-line">Production Line</TabsTrigger>
          <TabsTrigger value="quality-control">Quality Control</TabsTrigger>
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
                  {jobOrders.slice(0, 5).map((job: any) => (
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
                  {jobOrders.map((job: any) => {
                    const progress = job.status === 'completed' ? 100 : 
                                   job.status === 'in-progress' ? 65 : 0;
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

        <TabsContent value="production-line" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Production Line Status</CardTitle>
              <CardDescription>Real-time production line monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Line A - Hair Processing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge variant="default">Active</Badge>
                      <span className="text-sm text-muted-foreground">85% capacity</span>
                    </div>
                    <Progress value={85} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Line B - Quality Control</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">Busy</Badge>
                      <span className="text-sm text-muted-foreground">92% capacity</span>
                    </div>
                    <Progress value={92} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Line C - Packaging</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">Maintenance</Badge>
                      <span className="text-sm text-muted-foreground">0% capacity</span>
                    </div>
                    <Progress value={0} className="mt-2" />
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality-control" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quality Control</CardTitle>
              <CardDescription>Quality assurance and control metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h4 className="font-medium">Quality Metrics</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Pass Rate</span>
                      <Badge variant="default">98.5%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Defect Rate</span>
                      <Badge variant="secondary">1.5%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Rework Rate</span>
                      <Badge variant="outline">2.1%</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Recent Quality Checks</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Batch #2025-001</span>
                      <Badge variant="default">Passed</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Batch #2025-002</span>
                      <Badge variant="default">Passed</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Batch #2025-003</span>
                      <Badge variant="destructive">Failed</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}