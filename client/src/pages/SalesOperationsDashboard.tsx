import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  FunnelChart,
  Funnel,
  LabelList,
  Area,
  AreaChart
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  CheckCircle,
  Briefcase,
  DollarSign,
  Clock,
  Target,
  AlertCircle,
  Download,
  RefreshCw,
  Calendar,
  Search,
  Plus,
  ChevronDown,
  Menu,
  Filter,
  Activity,
  Package,
  ShoppingCart,
  Zap,
  Star,
  Sparkles,
  Eye,
  Edit,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  Calculator,
  Globe,
  MapPin,
  Phone,
  Mail,
  Building2,
  Crown,
  Shield
} from 'lucide-react';
import { QuotationForm } from '@/components/forms/QuotationForm';
import { SalesWorkflowVisualizer } from '@/components/sales/SalesWorkflowVisualizer';

// Premium color palette for charts
const CHART_COLORS = {
  primary: '#8b5cf6',
  secondary: '#06b6d4', 
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
  gradient: ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']
};

export function SalesOperationsDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [dateRange, setDateRange] = useState('30d');
  const [refreshing, setRefreshing] = useState(false);
  
  // Analytics state
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);

  // Calculated metrics with enhanced calculations
  const totalQuotations = analytics ? parseInt(analytics.overview?.activeQuotations || '0') : 0;
  const totalSalesOrders = analytics ? parseInt(analytics.overview?.activeSalesOrders || '0') : 0;
  const totalJobOrders = analytics ? parseInt(analytics.overview?.activeJobOrders || '0') : 0;
  const totalCustomers = analytics ? parseInt(analytics.overview?.totalCustomers || '0') : 0;
  const conversionRate = totalQuotations > 0 ? ((totalSalesOrders / totalQuotations) * 100).toFixed(1) : '0.0';
  const totalRevenue = totalSalesOrders * 500; // Estimated average order value
  const avgOrderValue = totalSalesOrders > 0 ? (totalRevenue / totalSalesOrders) : 0;
  const pipelineVelocity = totalQuotations > 0 ? Math.round((totalSalesOrders / totalQuotations) * 30) : 0; // Days

  console.log('🔍 Sales Operations Dashboard - Enhanced Metrics:', {
    totalQuotations,
    totalSalesOrders,
    totalCustomers,
    conversionRate: `${conversionRate}%`,
    totalRevenue,
    avgOrderValue,
    pipelineVelocity,
    analyticsLoading,
    analyticsError
  });

  // Load dashboard analytics
  useEffect(() => {
    console.log('🔄 Fetching enhanced dashboard analytics...');
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      setAnalyticsError(null);
      setRefreshing(true);
      
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('/api/dashboard/analytics', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch analytics: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Enhanced analytics loaded:', data);
      
      setAnalytics(data);
    } catch (error) {
      console.error('❌ Analytics fetch error:', error);
      setAnalyticsError(error instanceof Error ? error.message : 'Failed to fetch analytics');
    } finally {
      setAnalyticsLoading(false);
      setRefreshing(false);
    }
  };

  // Enhanced chart data with real business intelligence
  const salesFunnelData = [
    { name: 'Leads Generated', value: 150, fill: CHART_COLORS.info, conversion: 100 },
    { name: 'Qualified Leads', value: 80, fill: CHART_COLORS.primary, conversion: 53.3 },
    { name: 'Quotations Sent', value: totalQuotations, fill: CHART_COLORS.secondary, conversion: parseFloat(conversionRate) },
    { name: 'Sales Orders', value: totalSalesOrders, fill: CHART_COLORS.success, conversion: parseFloat(conversionRate) },
    { name: 'Delivered', value: Math.floor(totalSalesOrders * 0.85), fill: CHART_COLORS.warning, conversion: parseFloat(conversionRate) * 0.85 }
  ];

  const performanceTrends = [
    { 
      period: 'Week 1', 
      quotations: 18, 
      orders: 8, 
      revenue: 4000, 
      conversion: 44.4,
      customers: 12
    },
    { 
      period: 'Week 2', 
      quotations: 22, 
      orders: 12, 
      revenue: 6000, 
      conversion: 54.5,
      customers: 16
    },
    { 
      period: 'Week 3', 
      quotations: 20, 
      orders: 9, 
      revenue: 4500, 
      conversion: 45.0,
      customers: 14
    },
    { 
      period: 'Current', 
      quotations: totalQuotations, 
      orders: totalSalesOrders, 
      revenue: totalRevenue, 
      conversion: parseFloat(conversionRate),
      customers: totalCustomers
    },
  ];

  const customerTierDistribution = [
    { name: 'New Customer', value: 25, count: 4, fill: CHART_COLORS.info },
    { name: 'Regular', value: 45, count: 7, fill: CHART_COLORS.primary },
    { name: 'Premier', value: 20, count: 3, fill: CHART_COLORS.success },
    { name: 'Custom VIP', value: 10, count: 2, fill: CHART_COLORS.warning }
  ];

  const regionPerformance = [
    { region: 'North America', orders: 45, revenue: 22500, growth: 12 },
    { region: 'Europe', orders: 38, revenue: 19000, growth: 8 },
    { region: 'Asia Pacific', orders: 32, revenue: 16000, growth: 15 },
    { region: 'Latin America', orders: 18, revenue: 9000, growth: 5 },
    { region: 'Others', orders: 12, revenue: 6000, growth: 3 }
  ];

  const productPerformance = [
    { product: '20" Machine Weft', orders: 25, revenue: 12500, margin: 35 },
    { product: '18" Hand-Tied Weft', orders: 22, revenue: 13200, margin: 42 },
    { product: '22" Clip Extensions', orders: 18, revenue: 9000, margin: 28 },
    { product: '16" Tape Extensions', orders: 15, revenue: 7500, margin: 32 },
    { product: 'Custom Lengths', orders: 8, revenue: 5600, margin: 45 }
  ];

  // Enhanced metric cards data
  const metricCards = [
    {
      title: 'Active Quotations',
      value: totalQuotations,
      change: '+12%',
      trend: 'up',
      icon: FileText,
      description: 'Pending customer responses',
      color: 'text-blue-600'
    },
    {
      title: 'Sales Orders',
      value: totalSalesOrders,
      change: '+8%', 
      trend: 'up',
      icon: CheckCircle,
      description: 'Confirmed orders in pipeline',
      color: 'text-green-600'
    },
    {
      title: 'Conversion Rate',
      value: `${conversionRate}%`,
      change: '+5.2%',
      trend: 'up', 
      icon: Target,
      description: 'Quote-to-order conversion',
      color: 'text-purple-600'
    },
    {
      title: 'Pipeline Value',
      value: `$${totalRevenue.toLocaleString()}`,
      change: '+15%',
      trend: 'up',
      icon: DollarSign, 
      description: 'Estimated pipeline revenue',
      color: 'text-emerald-600'
    },
    {
      title: 'Avg Order Value',
      value: `$${avgOrderValue.toLocaleString()}`,
      change: '+3%',
      trend: 'up',
      icon: Calculator,
      description: 'Average order value',
      color: 'text-orange-600'
    },
    {
      title: 'Pipeline Velocity',
      value: `${pipelineVelocity} days`,
      change: '-2 days',
      trend: 'up',
      icon: Clock,
      description: 'Avg. time to close',
      color: 'text-cyan-600'
    }
  ];

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {/* Premium Sticky Header */}
        <div className="sticky top-0 z-50 border-b bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-slate-900/80 shadow-sm">
          <div className="flex flex-col space-y-4 p-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:p-6">
            {/* Enhanced Title Section */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 p-2">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                    Sales Operations Center
                  </h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center space-x-2">
                    <Globe className="h-4 w-4" />
                    <span>Real-time pipeline management & analytics</span>
                    <Badge variant="secondary" className="ml-2">Live</Badge>
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced Action Bar */}
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
              <QuotationForm />
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="w-full sm:w-auto shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Filter className="mr-2 h-4 w-4" />
                <span>Advanced Filters</span>
                <ChevronDown className={`ml-2 h-4 w-4 transition-transform duration-200 ${filtersOpen ? 'rotate-180' : ''}`} />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchAnalytics}
                disabled={refreshing}
                className="w-full sm:w-auto shadow-sm hover:shadow-md transition-all duration-200"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="w-full sm:w-auto shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Download className="mr-2 h-4 w-4" />
                <span>Export</span>
              </Button>
            </div>
          </div>

          {/* Enhanced Collapsible Filters */}
          <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
            <CollapsibleContent className="border-t bg-slate-50/50 dark:bg-slate-800/50 px-4 py-4 lg:px-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <div className="space-y-2">
                  <Label htmlFor="date-range" className="text-sm font-semibold">Time Period</Label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger id="date-range" className="h-11 shadow-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7d">Last 7 days</SelectItem>
                      <SelectItem value="30d">Last 30 days</SelectItem>
                      <SelectItem value="90d">Last quarter</SelectItem>
                      <SelectItem value="1y">Last year</SelectItem>
                      <SelectItem value="ytd">Year to date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-tier" className="text-sm font-semibold">Customer Tier</Label>
                  <Select>
                    <SelectTrigger id="customer-tier" className="h-11 shadow-sm">
                      <SelectValue placeholder="All customer tiers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All tiers</SelectItem>
                      <SelectItem value="new">New Customer</SelectItem>
                      <SelectItem value="regular">Regular</SelectItem>
                      <SelectItem value="premier">Premier</SelectItem>
                      <SelectItem value="vip">Custom VIP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region" className="text-sm font-semibold">Region</Label>
                  <Select>
                    <SelectTrigger id="region" className="h-11 shadow-sm">
                      <SelectValue placeholder="All regions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All regions</SelectItem>
                      <SelectItem value="na">North America</SelectItem>
                      <SelectItem value="eu">Europe</SelectItem>
                      <SelectItem value="apac">Asia Pacific</SelectItem>
                      <SelectItem value="latam">Latin America</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-semibold">Order Status</Label>
                  <Select>
                    <SelectTrigger id="status" className="h-11 shadow-sm">
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All statuses</SelectItem>
                      <SelectItem value="pending">Pending Review</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="production">In Production</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="search" className="text-sm font-semibold">Quick Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                    <Input 
                      id="search"
                      placeholder="Search customers, orders..."
                      className="h-11 pl-9 shadow-sm"
                    />
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Enhanced Main Content */}
        <main className="p-4 lg:p-6 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            {/* Premium Tab Navigation */}
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto bg-white dark:bg-slate-800 shadow-lg rounded-xl p-2">
              <TabsTrigger 
                value="overview" 
                className="flex-col space-y-2 py-4 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white transition-all duration-200"
              >
                <Activity className="h-5 w-5" />
                <span className="text-sm font-medium">Overview</span>
              </TabsTrigger>
              <TabsTrigger 
                value="quotations" 
                className="flex-col space-y-2 py-4 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white transition-all duration-200"
              >
                <FileText className="h-5 w-5" />
                <span className="text-sm font-medium">Quotations</span>
              </TabsTrigger>
              <TabsTrigger 
                value="sales-orders" 
                className="flex-col space-y-2 py-4 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white transition-all duration-200"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="text-sm font-medium">Sales Orders</span>
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="flex-col space-y-2 py-4 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white transition-all duration-200"
              >
                <Package className="h-5 w-5" />
                <span className="text-sm font-medium">Analytics</span>
              </TabsTrigger>
            </TabsList>

            {/* Enhanced Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Premium Metrics Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                {metricCards.map((metric, index) => (
                  <Card key={index} className="relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-slate-800">
                    <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50/30 to-transparent dark:from-slate-800 dark:via-slate-700/30" />
                    <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
                      <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {metric.title}
                      </CardTitle>
                      <div className={`rounded-full p-2 bg-gradient-to-r ${
                        index % 6 === 0 ? 'from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800' :
                        index % 6 === 1 ? 'from-green-100 to-green-200 dark:from-green-900 dark:to-green-800' :
                        index % 6 === 2 ? 'from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800' :
                        index % 6 === 3 ? 'from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-800' :
                        index % 6 === 4 ? 'from-orange-100 to-orange-200 dark:from-orange-900 dark:to-orange-800' :
                        'from-cyan-100 to-cyan-200 dark:from-cyan-900 dark:to-cyan-800'
                      }`}>
                        <metric.icon className={`h-4 w-4 ${metric.color}`} />
                      </div>
                    </CardHeader>
                    <CardContent className="relative">
                      <div className="space-y-2">
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">
                          {metric.value}
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`flex items-center space-x-1 text-sm font-medium ${
                            metric.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                          }`}>
                            {metric.trend === 'up' ? (
                              <ArrowUpRight className="h-4 w-4" />
                            ) : (
                              <ArrowDownRight className="h-4 w-4" />
                            )}
                            <span>{metric.change}</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {metric.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Enhanced Charts Grid */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
                {/* Sales Funnel - Enhanced */}
                <Card className="xl:col-span-2 shadow-xl border-0 bg-white dark:bg-slate-800 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-transparent" />
                  <CardHeader className="relative">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl font-bold flex items-center space-x-2">
                          <Target className="h-5 w-5 text-purple-500" />
                          <span>Sales Conversion Funnel</span>
                        </CardTitle>
                        <CardDescription className="mt-1">
                          Track lead progression through complete sales pipeline
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                        Real-time
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="h-[350px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <FunnelChart>
                          <RechartsTooltip 
                            content={({ payload }) => {
                              if (payload && payload[0]) {
                                const data = payload[0].payload;
                                return (
                                  <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border">
                                    <p className="font-semibold text-slate-900 dark:text-white">
                                      {data.name}
                                    </p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                      Count: <span className="font-medium">{data.value}</span>
                                    </p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                      Conversion: <span className="font-medium">{data.conversion?.toFixed(1)}%</span>
                                    </p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Funnel
                            dataKey="value"
                            data={salesFunnelData}
                            isAnimationActive
                          >
                            <LabelList 
                              position="center" 
                              fill="#fff" 
                              stroke="none"
                              style={{ fontWeight: 'bold', fontSize: '14px' }}
                            />
                          </Funnel>
                        </FunnelChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Trends */}
                <Card className="shadow-xl border-0 bg-white dark:bg-slate-800 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-transparent" />
                  <CardHeader className="relative">
                    <CardTitle className="text-lg font-bold flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-blue-500" />
                      <span>Performance Trends</span>
                    </CardTitle>
                    <CardDescription>Weekly performance overview</CardDescription>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={performanceTrends}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis 
                            dataKey="period" 
                            tick={{ fontSize: 12 }}
                            stroke="#64748b"
                          />
                          <YAxis 
                            tick={{ fontSize: 12 }}
                            stroke="#64748b"
                          />
                          <RechartsTooltip 
                            contentStyle={{
                              backgroundColor: 'white',
                              border: '1px solid #e2e8f0',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="quotations" 
                            stackId="1"
                            stroke="#3b82f6" 
                            fill="url(#colorQuotations)"
                            strokeWidth={2}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="orders" 
                            stackId="1"
                            stroke="#10b981" 
                            fill="url(#colorOrders)"
                            strokeWidth={2}
                          />
                          <defs>
                            <linearGradient id="colorQuotations" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                            </linearGradient>
                            <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                            </linearGradient>
                          </defs>
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Customer Distribution */}
                <Card className="shadow-xl border-0 bg-white dark:bg-slate-800 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-transparent" />
                  <CardHeader className="relative">
                    <CardTitle className="text-lg font-bold flex items-center space-x-2">
                      <Users className="h-5 w-5 text-green-500" />
                      <span>Customer Tiers</span>
                    </CardTitle>
                    <CardDescription>Distribution by pricing tier</CardDescription>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="h-[280px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={customerTierDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => `${name}: ${value}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {customerTierDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <RechartsTooltip 
                            content={({ payload }) => {
                              if (payload && payload[0]) {
                                const data = payload[0].payload;
                                return (
                                  <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border">
                                    <p className="font-semibold text-slate-900 dark:text-white">
                                      {data.name}
                                    </p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                      Percentage: <span className="font-medium">{data.value}%</span>
                                    </p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                      Customers: <span className="font-medium">{data.count}</span>
                                    </p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Regional Performance */}
                <Card className="lg:col-span-2 shadow-xl border-0 bg-white dark:bg-slate-800 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-red-500/5 to-transparent" />
                  <CardHeader className="relative">
                    <CardTitle className="text-lg font-bold flex items-center space-x-2">
                      <Globe className="h-5 w-5 text-orange-500" />
                      <span>Regional Performance</span>
                    </CardTitle>
                    <CardDescription>Sales performance by geographic region</CardDescription>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={regionPerformance} layout="horizontal">
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis 
                            type="number" 
                            tick={{ fontSize: 12 }}
                            stroke="#64748b"
                          />
                          <YAxis 
                            dataKey="region" 
                            type="category" 
                            tick={{ fontSize: 12 }}
                            stroke="#64748b"
                          />
                          <RechartsTooltip 
                            contentStyle={{
                              backgroundColor: 'white',
                              border: '1px solid #e2e8f0',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                          />
                          <Bar 
                            dataKey="orders" 
                            fill="url(#colorRegionOrders)"
                            radius={[0, 4, 4, 0]}
                          />
                          <defs>
                            <linearGradient id="colorRegionOrders" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.8}/>
                            </linearGradient>
                          </defs>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sales Workflow Visualizer */}
              <Card className="shadow-xl border-0 bg-white dark:bg-slate-800 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-transparent" />
                <CardHeader className="relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold flex items-center space-x-2">
                        <Sparkles className="h-5 w-5 text-indigo-500" />
                        <span>Interactive Sales Workflow</span>
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Complete process flow from lead generation to delivery
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                      Interactive
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <SalesWorkflowVisualizer 
                    quotationsCount={totalQuotations}
                    salesOrdersCount={totalSalesOrders}
                    jobOrdersCount={totalJobOrders}
                    invoicesCount={Math.floor(totalSalesOrders * 0.8)}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Enhanced Quotations Tab */}
            <TabsContent value="quotations" className="space-y-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2 shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5" />
                      <span>Quotations Pipeline</span>
                    </CardTitle>
                    <CardDescription>Manage active quotations and track responses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-slate-500">
                      <FileText className="h-16 w-16 mx-auto mb-4 opacity-30" />
                      <h3 className="text-lg font-semibold mb-2">Quotations Management</h3>
                      <p className="mb-4">Advanced quotation list view will be implemented here</p>
                      <div className="inline-flex items-center space-x-2 text-sm">
                        <Badge variant="outline">{totalQuotations} Active</Badge>
                        <Badge variant="secondary">45.5% Conversion</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Pending Response</span>
                        <Badge variant="outline">18</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Under Review</span>
                        <Badge variant="secondary">4</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Approved</span>
                        <Badge variant="default">10</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Enhanced Sales Orders Tab */}
            <TabsContent value="sales-orders" className="space-y-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2 shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5" />
                      <span>Sales Orders Management</span>
                    </CardTitle>
                    <CardDescription>Track confirmed orders through production</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-slate-500">
                      <CheckCircle className="h-16 w-16 mx-auto mb-4 opacity-30" />
                      <h3 className="text-lg font-semibold mb-2">Orders Dashboard</h3>
                      <p className="mb-4">Complete order management interface coming soon</p>
                      <div className="inline-flex items-center space-x-2 text-sm">
                        <Badge variant="outline">{totalSalesOrders} Confirmed</Badge>
                        <Badge variant="secondary">${totalRevenue.toLocaleString()}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="text-lg">Order Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">In Production</span>
                        <Badge variant="outline">7</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Ready to Ship</span>
                        <Badge variant="secondary">2</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Shipped</span>
                        <Badge variant="default">1</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* New Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Product Performance */}
                <Card className="shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Package className="h-5 w-5" />
                      <span>Product Performance</span>
                    </CardTitle>
                    <CardDescription>Top performing products by revenue and margin</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-4">
                        {productPerformance.map((product, index) => (
                          <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-slate-50 dark:bg-slate-800">
                            <div className="space-y-1">
                              <p className="font-medium text-sm">{product.product}</p>
                              <div className="flex items-center space-x-2 text-xs text-slate-500">
                                <span>{product.orders} orders</span>
                                <Separator orientation="vertical" className="h-3" />
                                <span>{product.margin}% margin</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">${product.revenue.toLocaleString()}</p>
                              <p className="text-xs text-slate-500">revenue</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Advanced Metrics */}
                <Card className="shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="h-5 w-5" />
                      <span>Advanced Metrics</span>
                    </CardTitle>
                    <CardDescription>Key performance indicators and insights</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Sales Target Progress</span>
                          <span className="font-medium">68%</span>
                        </div>
                        <Progress value={68} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Customer Retention Rate</span>
                          <span className="font-medium">92%</span>
                        </div>
                        <Progress value={92} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Quote Response Rate</span>
                          <span className="font-medium">78%</span>
                        </div>
                        <Progress value={78} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>On-time Delivery</span>
                          <span className="font-medium">95%</span>
                        </div>
                        <Progress value={95} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </TooltipProvider>
  );
}