import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Warehouse, 
  TrendingUp, 
  AlertTriangle, 
  ArrowUpDown, 
  Search,
  Plus,
  Minus,
  BarChart3,
  Zap,
  CheckCircle,
  Clock
} from 'lucide-react';

export default function InventoryGuide() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Package className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Inventory Management</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Comprehensive inventory management across multiple warehouses. Track stock levels, 
          manage transfers, and optimize inventory with AI-powered insights.
        </p>
      </div>

      {/* Multi-Warehouse Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Warehouse className="h-5 w-5" />
            <span>Multi-Warehouse System</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: "NG Warehouse", code: "NG", status: "Active", items: 45 },
              { name: "PH Warehouse", code: "PH", status: "Active", items: 38 },
              { name: "Reserved Stock", code: "RES", status: "Active", items: 12 },
              { name: "Red Zone", code: "RED", status: "Critical", items: 8 },
              { name: "Admin Storage", code: "ADM", status: "Active", items: 15 },
              { name: "Work in Progress", code: "WIP", status: "Active", items: 22 }
            ].map((warehouse) => (
              <Card key={warehouse.code} className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">{warehouse.items}</div>
                  <div className="text-sm font-medium">{warehouse.name}</div>
                  <Badge variant={warehouse.status === 'Critical' ? 'destructive' : 'secondary'} className="text-xs">
                    {warehouse.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Core Features */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Core Inventory Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: "Stock Level Tracking",
              description: "Real-time inventory levels across all locations",
              icon: BarChart3,
              features: ["Current stock quantities", "Available vs allocated", "Multi-location view", "Historical tracking"]
            },
            {
              title: "Low Stock Alerts",
              description: "Automatic notifications for products needing restock",
              icon: AlertTriangle,
              features: ["Customizable thresholds", "Email notifications", "Priority levels", "Reorder suggestions"]
            },
            {
              title: "Inventory Transfers",
              description: "Move stock between warehouse locations",
              icon: ArrowUpDown,
              features: ["Inter-warehouse transfers", "Transfer tracking", "Automatic updates", "Transfer history"]
            },
            {
              title: "Stock Adjustments",
              description: "Manually adjust inventory for corrections",
              icon: Plus,
              features: ["Quantity adjustments", "Reason tracking", "Audit trail", "Batch operations"]
            },
            {
              title: "Advanced Search",
              description: "Find products quickly with powerful search",
              icon: Search,
              features: ["Multi-field search", "Filter by location", "Barcode scanning", "Category browsing"]
            },
            {
              title: "AI Insights",
              description: "Predictive analytics for inventory optimization",
              icon: Zap,
              features: ["Demand forecasting", "Reorder recommendations", "Trend analysis", "Cost optimization"]
            }
          ].map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title}>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.features.map((item, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Inventory Operations */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Common Operations</h2>
        <div className="space-y-4">
          {[
            {
              operation: "Add New Product",
              description: "Create new inventory items in the system",
              steps: ["Navigate to Inventory → Add Product", "Enter product details", "Set initial quantities", "Assign to warehouses"],
              icon: Plus,
              difficulty: "Easy"
            },
            {
              operation: "Stock Adjustment",
              description: "Correct inventory quantities for physical counts",
              steps: ["Find the product", "Click 'Adjust Stock'", "Enter new quantity", "Provide adjustment reason"],
              icon: Package,
              difficulty: "Easy"
            },
            {
              operation: "Inter-warehouse Transfer",
              description: "Move inventory between warehouse locations",
              steps: ["Select source warehouse", "Choose destination", "Specify quantities", "Confirm transfer"],
              icon: ArrowUpDown,
              difficulty: "Medium"
            },
            {
              operation: "Bulk Operations",
              description: "Perform operations on multiple products",
              steps: ["Select multiple products", "Choose bulk action", "Configure settings", "Execute operation"],
              icon: BarChart3,
              difficulty: "Advanced"
            }
          ].map((op) => {
            const Icon = op.icon;
            return (
              <Card key={op.operation}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-lg">{op.operation}</h3>
                        <Badge variant={op.difficulty === 'Easy' ? 'secondary' : op.difficulty === 'Medium' ? 'default' : 'destructive'}>
                          {op.difficulty}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{op.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {op.steps.map((step, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm">
                            <span className="w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* AI Insights Feature */}
      <Card className="border-purple-200 bg-purple-50 dark:bg-purple-950/10">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-purple-800 dark:text-purple-200">AI Inventory Insights</CardTitle>
            <Badge className="bg-purple-600 text-white">AI Powered</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-purple-800 dark:text-purple-200">
          <p>Leverage artificial intelligence to optimize your inventory management:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Predictive Analytics:</h4>
              <ul className="space-y-1 text-sm">
                <li>• Demand forecasting based on historical data</li>
                <li>• Seasonal trend analysis</li>
                <li>• Automatic reorder point calculation</li>
                <li>• Stock optimization recommendations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Smart Alerts:</h4>
              <ul className="space-y-1 text-sm">
                <li>• Intelligent low stock warnings</li>
                <li>• Overstock identification</li>
                <li>• Slow-moving inventory detection</li>
                <li>• Cost optimization suggestions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3 flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Daily Operations:</span>
              </h4>
              <ul className="space-y-2 text-sm">
                <li>• Perform regular stock counts</li>
                <li>• Update inventory after each transaction</li>
                <li>• Monitor low stock alerts daily</li>
                <li>• Review transfer requests promptly</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3 flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span>Optimization:</span>
              </h4>
              <ul className="space-y-2 text-sm">
                <li>• Use AI insights for forecasting</li>
                <li>• Optimize reorder points based on lead times</li>
                <li>• Balance inventory across warehouses</li>
                <li>• Regularly review slow-moving items</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Troubleshooting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Common Issues & Solutions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-red-400 bg-red-50 dark:bg-red-950/10">
              <h4 className="font-medium text-red-800 dark:text-red-200">Stock Discrepancies</h4>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                Solution: Perform regular physical counts and use stock adjustment feature to correct system quantities.
              </p>
            </div>
            <div className="p-4 border-l-4 border-yellow-400 bg-yellow-50 dark:bg-yellow-950/10">
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Transfer Delays</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Solution: Set up transfer notifications and follow up on pending transfers regularly.
              </p>
            </div>
            <div className="p-4 border-l-4 border-blue-400 bg-blue-50 dark:bg-blue-950/10">
              <h4 className="font-medium text-blue-800 dark:text-blue-200">Missing Products</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Solution: Use advanced search with multiple filters or check if products are in different warehouses.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}