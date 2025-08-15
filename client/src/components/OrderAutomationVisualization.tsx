import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  FileText,
  ShoppingCart,
  Factory,
  Receipt,
  ArrowRight,
  CheckCircle,
  Clock,
  Zap,
  BarChart3,
  TrendingUp,
  RefreshCw,
  Database,
  Hash,
  FileCheck,
  CreditCard,
  Package,
  Settings,
  Activity,
  Target,
  Users,
  DollarSign,
  Timer,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  AlertTriangle,
  CheckSquare,
  Workflow,
  Cpu,
  Calendar,
  Upload
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AutomationProcess {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  automatedSteps: string[];
  timeSaved: string;
  accuracy: string;
  status: 'active' | 'completed' | 'processing' | 'idle';
}

interface OrderAutomationVisualizationProps {
  quotationsCount?: number;
  salesOrdersCount?: number;
  jobOrdersCount?: number;
  invoicesCount?: number;
  paymentsCount?: number;
  className?: string;
}

export function OrderAutomationVisualization({
  quotationsCount = 0,
  salesOrdersCount = 0,
  jobOrdersCount = 0,
  invoicesCount = 0,
  paymentsCount = 0,
  className
}: OrderAutomationVisualizationProps) {
  const [expandedProcesses, setExpandedProcesses] = useState<string[]>([]);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationProgress(prev => (prev + 1) % 100);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const automationProcesses: AutomationProcess[] = [
    {
      id: 'quotation-to-sales',
      name: 'Quotation to Sales Order',
      description: 'One-click conversion from quotation to sales order',
      icon: RefreshCw,
      automatedSteps: [
        'One-click quotation approval converts to sales order',
        'Automatic data transfer with same series number',
        'Customer details auto-populated from quotation',
        'Print-ready sales order PDF generated instantly',
        'Status updates across all related documents'
      ],
      timeSaved: '95%',
      accuracy: '100%',
      status: salesOrdersCount > 0 ? 'active' : 'idle'
    },
    {
      id: 'sales-to-job-order',
      name: 'Sales Order to Job Order',
      description: 'Automatic job order creation from confirmed sales orders',
      icon: Factory,
      automatedSteps: [
        'Confirmed sales order automatically creates job order',
        'Production items transferred with specifications',
        '8-column shipment tracking table initialized',
        'Production timeline and due dates calculated',
        'Reserved warehouse inventory automatically updated'
      ],
      timeSaved: '92%',
      accuracy: '100%',
      status: jobOrdersCount > 0 ? 'active' : 'idle'
    },
    {
      id: 'job-order-monitoring',
      name: 'Job Order Production Monitoring',
      description: 'Real-time production tracking with 8-column shipment system',
      icon: BarChart3,
      automatedSteps: [
        'Real-time production progress calculation',
        '8-column shipment tracking with auto-calculations',
        'Order balance and ready quantity auto-updates',
        'Production bottleneck identification and alerts',
        'Completion status tracking and notifications'
      ],
      timeSaved: '90%',
      accuracy: '99.9%',
      status: jobOrdersCount > 0 ? 'processing' : 'idle'
    }
  ];

  const overallStats = {
    totalProcesses: automationProcesses.length,
    activeProcesses: automationProcesses.filter(p => p.status === 'active' || p.status === 'processing').length,
    averageTimeSaved: Math.round(automationProcesses.reduce((sum, p) => sum + parseInt(p.timeSaved), 0) / automationProcesses.length),
    totalOrders: quotationsCount + salesOrdersCount + jobOrdersCount + invoicesCount,
    automationEfficiency: 95
  };

  const toggleProcess = (processId: string) => {
    setExpandedProcesses(prev => 
      prev.includes(processId) 
        ? prev.filter(id => id !== processId)
        : [...prev, processId]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'border-green-500 bg-green-50 dark:bg-green-950';
      case 'processing':
        return 'border-blue-500 bg-blue-50 dark:bg-blue-950';
      case 'completed':
        return 'border-purple-500 bg-purple-50 dark:bg-purple-950';
      case 'idle':
        return 'border-gray-300 bg-gray-50 dark:bg-gray-900';
      default:
        return 'border-gray-300 bg-gray-50 dark:bg-gray-900';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Activity className="h-4 w-4 text-green-500 animate-pulse" />;
      case 'processing':
        return <Cpu className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-purple-500" />;
      case 'idle':
        return <Clock className="h-4 w-4 text-gray-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header Section */}
      <Card className="bg-gradient-to-r from-purple-50 via-cyan-50 to-pink-50 dark:from-purple-950 dark:via-cyan-950 dark:to-pink-950 border-purple-200 dark:border-purple-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                <Workflow className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">Quotation to Job Order Automation</CardTitle>
                <p className="text-muted-foreground">Automated workflow: Quotation → Sales Order → Job Order</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-purple-600">{overallStats.automationEfficiency}%</div>
              <div className="text-sm text-muted-foreground">Automation Rate</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Real-time Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{overallStats.totalOrders}</div>
              <div className="text-sm text-muted-foreground">Total Orders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{overallStats.activeProcesses}</div>
              <div className="text-sm text-muted-foreground">Active Processes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{overallStats.averageTimeSaved}%</div>
              <div className="text-sm text-muted-foreground">Avg Time Saved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">100%</div>
              <div className="text-sm text-muted-foreground">Data Accuracy</div>
            </div>
          </div>

          {/* Automation Flow Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Automation Progress</span>
              <span className="text-sm text-muted-foreground">{overallStats.automationEfficiency}% Complete</span>
            </div>
            <Progress value={overallStats.automationEfficiency} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Manual Processes: 5%</span>
              <span>Automated Processes: 95%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Automated Processes Grid */}
      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Core Workflow Automation</h3>
          <Badge variant="outline" className="bg-gradient-to-r from-green-500 to-blue-500 text-white border-0">
            {overallStats.activeProcesses} Active
          </Badge>
        </div>
        
        <div className="grid gap-4">
          {automationProcesses.map((process) => {
            const Icon = process.icon;
            const isExpanded = expandedProcesses.includes(process.id);
            
            return (
              <Card 
                key={process.id} 
                className={cn(
                  "transition-all duration-300 cursor-pointer hover:shadow-lg",
                  getStatusColor(process.status)
                )}
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Process Header */}
                    <div 
                      className="flex items-center justify-between"
                      onClick={() => toggleProcess(process.id)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{process.name}</h4>
                            <p className="text-sm text-muted-foreground">{process.description}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        {/* Performance Badges */}
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="text-xs">
                            <Timer className="h-3 w-3 mr-1" />
                            {process.timeSaved} saved
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            <Target className="h-3 w-3 mr-1" />
                            {process.accuracy}
                          </Badge>
                        </div>
                        
                        {/* Status Indicator */}
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(process.status)}
                          <span className="text-sm font-medium capitalize">{process.status}</span>
                        </div>
                        
                        {/* Expand Toggle */}
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-muted">
                        <div className="space-y-3">
                          <h5 className="font-medium flex items-center">
                            <Settings className="h-4 w-4 mr-2" />
                            Automated Steps
                          </h5>
                          <div className="grid gap-2">
                            {process.automatedSteps.map((step, index) => (
                              <div key={index} className="flex items-center space-x-3">
                                <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                                  <CheckSquare className="h-3 w-3 text-green-600" />
                                </div>
                                <span className="text-sm">{step}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Order Flow Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Workflow className="h-5 w-5 mr-2" />
            Live Order Flow
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'Quotations', count: quotationsCount, icon: FileText, color: 'purple' },
                { name: 'Sales Orders', count: salesOrdersCount, icon: ShoppingCart, color: 'blue' },
                { name: 'Job Orders', count: jobOrdersCount, icon: Factory, color: 'orange' }
              ].map((stage, index) => {
                const Icon = stage.icon;
                const isActive = stage.count > 0;
                
                return (
                  <div key={stage.name} className="relative">
                    {/* Connector */}
                    {index < 2 && (
                      <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                        <div className="bg-white dark:bg-gray-900 rounded-full p-1 border-2 border-gray-200 dark:border-gray-700">
                          <ArrowRight className={cn(
                            "h-4 w-4",
                            isActive ? "text-primary animate-pulse" : "text-gray-400"
                          )} />
                        </div>
                      </div>
                    )}

                    {/* Stage Card */}
                    <div className={cn(
                      "p-4 rounded-lg border-2 transition-all duration-300",
                      isActive 
                        ? `border-${stage.color}-500 bg-${stage.color}-50 dark:bg-${stage.color}-950` 
                        : "border-gray-200 bg-gray-50 dark:bg-gray-900"
                    )}>
                      <div className="text-center space-y-2">
                        <Icon className={cn(
                          "h-8 w-8 mx-auto",
                          isActive ? `text-${stage.color}-500` : "text-gray-400"
                        )} />
                        <div className="font-semibold">{stage.name}</div>
                        <div className={cn(
                          "text-2xl font-bold",
                          isActive ? `text-${stage.color}-600` : "text-gray-400"
                        )}>
                          {stage.count}
                        </div>
                        {isActive && (
                          <Badge className={`bg-${stage.color}-100 text-${stage.color}-800`}>
                            Active
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Automation Benefits */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Zap className="h-6 w-6 text-green-500" />
              <div>
                <h4 className="font-semibold text-green-800 dark:text-green-200">Complete Process Automation</h4>
                <p className="text-sm text-green-600 dark:text-green-300">
                  End-to-end workflow automation eliminating manual bottlenecks
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">95%</div>
                <div className="text-xs text-green-700 dark:text-green-300">Time Reduction</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">100%</div>
                <div className="text-xs text-green-700 dark:text-green-300">Error Elimination</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">0</div>
                <div className="text-xs text-green-700 dark:text-green-300">Manual Transcription</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">24/7</div>
                <div className="text-xs text-green-700 dark:text-green-300">Automated Processing</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}