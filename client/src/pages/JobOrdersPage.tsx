import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { JobOrderForm } from '@/components/forms/JobOrderForm';
import { Factory, Plus, Package } from 'lucide-react';

export function JobOrdersPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { data: jobOrders = [], isLoading } = useQuery({
    queryKey: ['/api/job-orders'],
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Job Orders</h1>
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Job Orders</h1>
          <p className="text-muted-foreground">
            Production tracking and manufacturing management
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Job Order
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Job Order</DialogTitle>
            </DialogHeader>
            <JobOrderForm onSuccess={() => setShowCreateDialog(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Production Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobOrders.length}</div>
            <Badge variant="outline" className="mt-1">
              In Production
            </Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {jobOrders.length > 0 ? Math.round((jobOrders.filter((job: any) => job.status === 'completed').length / jobOrders.length) * 100) : 0}%
            </div>
            <Progress value={jobOrders.length > 0 ? (jobOrders.filter((job: any) => job.status === 'completed').length / jobOrders.length) * 100 : 0} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Job Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobOrders.length}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {jobOrders.filter((job: any) => job.status === 'completed').length} completed
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Factory className="h-5 w-5 mr-2" />
            All Job Orders ({jobOrders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center">
                      <Factory className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No job orders found</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Job orders are generated from confirmed sales orders
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                jobOrders.map((job: any) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">
                      {job.jobOrderNumber}
                    </TableCell>
                    <TableCell>{job.customerCode}</TableCell>
                    <TableCell>
                      {new Date(job.dueDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Progress value={Math.random() * 100} className="flex-1" />
                        <span className="text-sm text-muted-foreground">
                          {Math.floor(Math.random() * 100)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{job.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}