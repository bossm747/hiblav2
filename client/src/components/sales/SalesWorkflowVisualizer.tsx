import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  FileText,
  ShoppingCart,
  Briefcase,
  FileCheck,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle,
  Play,
  Zap,
  Timer,
  Info
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
  
  // Enhanced workflow steps with detailed descriptions and time estimates
  const workflowSteps: WorkflowStep[] = [
    {
      id: 'quotations',
      title: 'Quotations',
      description: 'Initial customer pricing and product details',
      icon: FileText,
      status: quotationsCount > 0 ? 'active' : 'pending',
      count: quotationsCount
    },
    {
      id: 'sales-orders',
      title: 'Sales Orders',
      description: 'AUTO-GENERATED from approved quotations',
      icon: ShoppingCart,
      status: salesOrdersCount > 0 ? 'active' : 'pending',
      automated: true,
      count: salesOrdersCount
    },
    {
      id: 'job-orders',
      title: 'Job Orders',
      description: 'AUTO-GENERATED production planning',
      icon: Briefcase,
      status: jobOrdersCount > 0 ? 'active' : 'pending',
      automated: true,
      count: jobOrdersCount
    },
    {
      id: 'invoices',
      title: 'Invoices',
      description: 'AUTO-GENERATED payment documentation',
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
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Card
                        className={cn(
                          'cursor-pointer transition-all duration-200 hover:shadow-lg transform hover:scale-105',
                          'border-2', 
                          getStepColor(step.status)
                        )}
                        onClick={() => onStepClick?.(step.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <div className={cn(
                                'p-2 rounded-full',
                                step.status === 'completed' ? 'bg-green-100 dark:bg-green-900' :
                                step.status === 'active' ? 'bg-blue-100 dark:bg-blue-900' :
                                'bg-gray-100 dark:bg-gray-800'
                              )}>
                                <Icon className={cn(
                                  'h-5 w-5',
                                  step.status === 'completed' ? 'text-green-600 dark:text-green-300' :
                                  step.status === 'active' ? 'text-blue-600 dark:text-blue-300' :
                                  'text-gray-500'
                                )} />
                              </div>
                              <div>
                                <h3 className="font-semibold text-sm">{step.title}</h3>
                                {step.automated && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <Zap className="h-3 w-3 text-yellow-500" />
                                    <Badge variant="secondary" className="text-xs px-1 py-0">
                                      AUTO
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(step.status)}
                              <Badge variant="outline" className="ml-1">
                                {step.count || 0}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {step.description}
                          </p>
                          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                            <Timer className="h-3 w-3" />
                            <span>
                              {step.automated ? '1 day (Instant)' : '2-3 days'}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="max-w-xs">
                        <p className="font-semibold">{step.title}</p>
                        <p className="text-sm">{step.description}</p>
                        {step.automated && (
                          <p className="text-xs text-blue-300 mt-1">
                            ⚡ Automatically generated from previous step
                          </p>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
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