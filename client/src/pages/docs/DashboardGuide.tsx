import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  Package, 
  Users, 
  FileText, 
  ShoppingCart,
  Briefcase,
  DollarSign,
  Calendar,
  Activity,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const dashboardSections = [
  {
    title: "Revenue Analytics",
    description: "Track total revenue, growth trends, and monthly performance",
    features: ["Real-time revenue tracking", "Month-over-month growth", "Revenue forecasting", "Payment status"],
    metrics: ["Total Revenue: $1,087", "Growth: +15%", "This Month: $947", "Pending: $140"]
  },
  {
    title: "Order Management",
    description: "Monitor quotations, sales orders, and job orders in one place",
    features: ["Active order count", "Order status tracking", "Conversion rates", "Pipeline management"],
    metrics: ["5 Quotations", "1 Sales Order", "1 Job Order", "20% Conversion"]
  },
  {
    title: "Inventory Overview",
    description: "Real-time inventory levels, low stock alerts, and warehouse status",
    features: ["Multi-warehouse view", "Low stock alerts", "Product availability", "Transfer tracking"],
    metrics: ["20 Products", "5 Low Stock", "6 Warehouses", "Active Transfers"]
  },
  {
    title: "Customer Insights",
    description: "Customer relationship management and engagement metrics",
    features: ["Customer count", "Recent activity", "Relationship status", "Communication logs"],
    metrics: ["3 Active Customers", "2 New This Month", "100% Satisfaction", "5 Recent Orders"]
  }
];

const keyMetrics = [
  {
    title: "Total Revenue",
    value: "$1,087.00",
    change: "+15%",
    trend: "up",
    description: "Total revenue from all sales orders",
    icon: DollarSign,
    color: "text-green-600"
  },
  {
    title: "Active Orders",
    value: "7",
    change: "+2",
    trend: "up", 
    description: "Quotations, sales orders, and job orders",
    icon: ShoppingCart,
    color: "text-blue-600"
  },
  {
    title: "Conversion Rate",
    value: "20%",
    change: "+3%",
    trend: "up",
    description: "Quotation to sales order conversion",
    icon: TrendingUp,
    color: "text-purple-600"
  },
  {
    title: "Inventory Health",
    value: "75%",
    change: "-5%",
    trend: "down",
    description: "Products with adequate stock levels",
    icon: Package,
    color: "text-orange-600"
  }
];

const widgets = [
  {
    name: "Recent Activity",
    description: "Latest system activities and updates",
    features: ["Real-time notifications", "Activity timeline", "User actions", "System events"],
    customizable: true
  },
  {
    name: "Quick Actions",
    description: "One-click access to common tasks",
    features: ["Create quotation", "Add inventory", "New customer", "Generate report"],
    customizable: true
  },
  {
    name: "Performance Charts",
    description: "Visual representation of key metrics",
    features: ["Revenue trends", "Order volume", "Inventory levels", "Custom date ranges"],
    customizable: false
  },
  {
    name: "Low Stock Alerts",
    description: "Products requiring immediate attention",
    features: ["Critical stock levels", "Reorder suggestions", "Supplier contacts", "Purchase recommendations"],
    customizable: true
  }
];

export default function DashboardGuide() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Dashboard & Analytics</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Master the Hibla dashboard to monitor your manufacturing operations in real-time. 
          Get insights into revenue, orders, inventory, and customer relationships all in one place.
        </p>
      </div>

      {/* Key Metrics Overview */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Key Performance Indicators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {keyMetrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card key={metric.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                      <p className="text-2xl font-bold">{metric.value}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <span className={`text-sm font-medium ${
                          metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {metric.change}
                        </span>
                        <span className="text-xs text-muted-foreground">vs last month</span>
                      </div>
                    </div>
                    <Icon className={`h-8 w-8 ${metric.color}`} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">{metric.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Dashboard Sections */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Dashboard Sections</h2>
        <div className="space-y-6">
          {dashboardSections.map((section, index) => (
            <Card key={section.title}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <span>{section.title}</span>
                </CardTitle>
                <p className="text-muted-foreground">{section.description}</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Key Features:</h4>
                    <ul className="space-y-2">
                      {section.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Current Metrics:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {section.metrics.map((metric, idx) => (
                        <div key={idx} className="p-2 bg-muted rounded text-sm text-center">
                          {metric}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Widgets & Customization */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Dashboard Widgets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {widgets.map((widget) => (
            <Card key={widget.name}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{widget.name}</CardTitle>
                  {widget.customizable && (
                    <Badge variant="secondary">Customizable</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{widget.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {widget.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Navigation Tips */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/10">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-blue-800 dark:text-blue-200">Navigation Tips</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-blue-800 dark:text-blue-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Quick Access:</h4>
              <ul className="space-y-1 text-sm">
                <li>• Click any metric to view detailed reports</li>
                <li>• Use sidebar navigation for main modules</li>
                <li>• Search functionality in top navigation</li>
                <li>• Quick actions in dashboard widgets</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Keyboard Shortcuts:</h4>
              <ul className="space-y-1 text-sm">
                <li>• <kbd className="bg-white/50 px-1 rounded">Ctrl+D</kbd> - Dashboard</li>
                <li>• <kbd className="bg-white/50 px-1 rounded">Ctrl+Q</kbd> - New Quotation</li>
                <li>• <kbd className="bg-white/50 px-1 rounded">Ctrl+I</kbd> - Inventory</li>
                <li>• <kbd className="bg-white/50 px-1 rounded">Ctrl+R</kbd> - Reports</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Troubleshooting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5" />
            <span>Common Dashboard Issues</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-yellow-400 bg-yellow-50 dark:bg-yellow-950/10">
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Data Not Loading</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Check your internet connection and refresh the page. If issues persist, contact support.
              </p>
            </div>
            <div className="p-4 border-l-4 border-red-400 bg-red-50 dark:bg-red-950/10">
              <h4 className="font-medium text-red-800 dark:text-red-200">Metrics Showing Zero</h4>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                Ensure you have created quotations, sales orders, or inventory items. Empty systems show zero metrics.
              </p>
            </div>
            <div className="p-4 border-l-4 border-blue-400 bg-blue-50 dark:bg-blue-950/10">
              <h4 className="font-medium text-blue-800 dark:text-blue-200">Slow Performance</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Clear browser cache and ensure you're using a supported browser. Consider reducing date range for large datasets.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}