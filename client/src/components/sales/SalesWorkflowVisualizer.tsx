import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  FileText,
  ShoppingCart,
  Briefcase,
  FileCheck,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle,
  Play
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  status: 'completed' | 'active' | 'pending' | 'error';
  automated?: boolean;
  count?: number;
}

interface SalesWorkflowVisualizerProps {
  quotationsCount: number;
  salesOrdersCount: number;
  jobOrdersCount: number;
  invoicesCount: number;
  onStepClick?: (step: string) => void;
}

export function SalesWorkflowVisualizer({
  quotationsCount,
  salesOrdersCount, 
  jobOrdersCount,
  invoicesCount,
  onStepClick
}: SalesWorkflowVisualizerProps) {
  
  const workflowSteps: WorkflowStep[] = [
    {
      id: 'quotations',
      title: 'Quotations',
      description: 'Customer requests & pricing',
      icon: FileText,
      status: quotationsCount > 0 ? 'active' : 'pending',
      count: quotationsCount
    },
    {
      id: 'sales-orders',
      title: 'Sales Orders',
      description: 'Confirmed orders',
      icon: ShoppingCart,
      status: salesOrdersCount > 0 ? 'active' : 'pending',
      automated: true,
      count: salesOrdersCount
    },
    {
      id: 'job-orders',
      title: 'Job Orders',
      description: 'Production planning',
      icon: Briefcase,
      status: jobOrdersCount > 0 ? 'active' : 'pending',
      automated: true,
      count: jobOrdersCount
    },
    {
      id: 'invoices',
      title: 'Invoices',
      description: 'Payment documents',
      icon: FileCheck,
      status: invoicesCount > 0 ? 'completed' : 'pending',
      automated: true,
      count: invoicesCount
    }
  ];

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-500 bg-green-50 dark:bg-green-950';
      case 'active':
        return 'border-blue-500 bg-blue-50 dark:bg-blue-950';
      case 'pending':
        return 'border-gray-300 bg-gray-50 dark:bg-gray-900';
      case 'error':
        return 'border-red-500 bg-red-50 dark:bg-red-950';
      default:
        return 'border-gray-300 bg-gray-50 dark:bg-gray-900';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'active':
        return <Play className="h-4 w-4 text-blue-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-gray-400" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Sales Process Flow</h2>
          <p className="text-sm text-muted-foreground">
            Automated workflow from quotation to invoice
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
            95% Automated
          </Badge>
          <Badge variant="outline" className="bg-gradient-to-r from-green-500 to-blue-500 text-white border-0">
            Real-time Tracking
          </Badge>
        </div>
      </div>

      {/* Workflow Steps */}
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {workflowSteps.map((step, index) => {
            const Icon = step.icon;
            
            return (
              <div key={step.id} className="relative">
                {/* Connector Arrow */}
                {index < workflowSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                    <div className="bg-white dark:bg-gray-900 rounded-full p-1 border-2 border-gray-200 dark:border-gray-700">
                      <ArrowRight className="h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                )}

                {/* Step Card */}
                <Card 
                  className={cn(
                    "transition-all duration-200 cursor-pointer hover:shadow-lg",
                    getStepColor(step.status),
                    onStepClick && "hover:scale-105"
                  )}
                  onClick={() => onStepClick?.(step.id)}
                >
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Icon & Status */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Icon className="h-6 w-6 text-primary" />
                          {step.automated && (
                            <Badge variant="secondary" className="text-xs">AUTO</Badge>
                          )}
                        </div>
                        {getStatusIcon(step.status)}
                      </div>

                      {/* Title & Description */}
                      <div>
                        <h3 className="font-medium">{step.title}</h3>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>

                      {/* Count */}
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-primary">
                          {step.count || 0}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            onStepClick?.(step.id);
                          }}
                        >
                          View →
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* Automation Benefits */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 border-green-200 dark:border-green-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium text-green-800 dark:text-green-200">Full Process Automation</p>
                <p className="text-sm text-green-600 dark:text-green-300">
                  One-click document generation • Auto SO & JO creation • Reserved warehouse updates • Real-time monitoring
                </p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-100">
              95% Time Saved
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}