import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Warehouse, 
  MapPin, 
  ArrowUpDown, 
  Package, 
  Users, 
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Settings,
  Clock
} from 'lucide-react';

export default function WarehouseGuide() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Warehouse className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Multi-Warehouse System</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Manage inventory across multiple warehouse locations with sophisticated tracking, 
          transfers, and optimization capabilities.
        </p>
      </div>

      {/* Warehouse Locations */}
      <Card>
        <CardHeader>
          <CardTitle>Warehouse Locations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "NG Warehouse", code: "NG", type: "Primary", capacity: "10,000 units", utilization: "75%" },
              { name: "PH Warehouse", code: "PH", type: "Regional", capacity: "8,000 units", utilization: "60%" },
              { name: "Reserved Stock", code: "RES", type: "Special", capacity: "2,000 units", utilization: "30%" },
              { name: "Red Zone", code: "RED", type: "Critical", capacity: "1,000 units", utilization: "80%" },
              { name: "Admin Storage", code: "ADM", type: "Office", capacity: "500 units", utilization: "45%" },
              { name: "Work in Progress", code: "WIP", type: "Production", capacity: "3,000 units", utilization: "90%" }
            ].map((warehouse) => (
              <Card key={warehouse.code}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{warehouse.name}</h3>
                    <Badge variant="outline">{warehouse.code}</Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span className="font-medium">{warehouse.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Capacity:</span>
                      <span className="font-medium">{warehouse.capacity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Utilization:</span>
                      <span className="font-medium text-primary">{warehouse.utilization}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Features */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Multi-Warehouse Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: "Location Management",
              description: "Comprehensive warehouse location tracking",
              icon: MapPin,
              features: ["Multiple locations", "Location hierarchy", "Geographic tracking", "Capacity management"]
            },
            {
              title: "Inventory Tracking",
              description: "Real-time inventory across all locations",
              icon: Package,
              features: ["Location-specific stock", "Real-time updates", "Cross-location visibility", "Stock allocation"]
            },
            {
              title: "Transfer Management",
              description: "Efficient inter-warehouse transfers",
              icon: ArrowUpDown,
              features: ["Transfer requests", "Approval workflows", "Transit tracking", "Automatic updates"]
            },
            {
              title: "Performance Analytics",
              description: "Warehouse performance monitoring",
              icon: BarChart3,
              features: ["Utilization rates", "Efficiency metrics", "Cost analysis", "Performance trends"]
            },
            {
              title: "Staff Management",
              description: "Warehouse team coordination",
              icon: Users,
              features: ["Team assignments", "Access control", "Performance tracking", "Shift management"]
            },
            {
              title: "Configuration",
              description: "Flexible warehouse configuration",
              icon: Settings,
              features: ["Custom settings", "Rules engine", "Automation", "Integration options"]
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

      {/* Transfer Operations */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Transfer Operations</h2>
        <div className="space-y-4">
          {[
            {
              type: "Standard Transfer",
              description: "Regular inventory movement between warehouses",
              timeline: "1-3 business days",
              approval: "Manager approval required",
              tracking: "Full transit tracking",
              icon: ArrowUpDown
            },
            {
              type: "Emergency Transfer",
              description: "Urgent stock movement for critical needs",
              timeline: "Same day",
              approval: "Automatic approval",
              tracking: "Real-time tracking",
              icon: AlertTriangle
            },
            {
              type: "Bulk Transfer",
              description: "Large quantity movements for rebalancing",
              timeline: "3-5 business days",
              approval: "Senior manager approval",
              tracking: "Milestone tracking",
              icon: Package
            },
            {
              type: "Return Transfer",
              description: "Return defective or excess inventory",
              timeline: "2-4 business days",
              approval: "Quality inspection required",
              tracking: "Quality tracking",
              icon: Clock
            }
          ].map((transfer) => {
            const Icon = transfer.icon;
            return (
              <Card key={transfer.type}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{transfer.type}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{transfer.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Timeline:</span>
                          <div className="text-muted-foreground">{transfer.timeline}</div>
                        </div>
                        <div>
                          <span className="font-medium">Approval:</span>
                          <div className="text-muted-foreground">{transfer.approval}</div>
                        </div>
                        <div>
                          <span className="font-medium">Tracking:</span>
                          <div className="text-muted-foreground">{transfer.tracking}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Best Practices */}
      <Card className="border-green-200 bg-green-50 dark:bg-green-950/10">
        <CardHeader>
          <CardTitle className="text-green-800 dark:text-green-200">Warehouse Management Best Practices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-green-800 dark:text-green-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Inventory Distribution:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Balance stock across locations</li>
                <li>• Consider geographic demand patterns</li>
                <li>• Maintain safety stock levels</li>
                <li>• Optimize for delivery efficiency</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Transfer Efficiency:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Plan transfers in advance</li>
                <li>• Consolidate shipments when possible</li>
                <li>• Use standard transfer procedures</li>
                <li>• Track transfer performance</li>
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
              <h4 className="font-medium text-red-800 dark:text-red-200">Transfer Delays</h4>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                Solution: Set up transfer notifications and track shipping status regularly.
              </p>
            </div>
            <div className="p-4 border-l-4 border-yellow-400 bg-yellow-50 dark:bg-yellow-950/10">
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Stock Imbalances</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Solution: Use analytics to identify imbalances and schedule rebalancing transfers.
              </p>
            </div>
            <div className="p-4 border-l-4 border-blue-400 bg-blue-50 dark:bg-blue-950/10">
              <h4 className="font-medium text-blue-800 dark:text-blue-200">Capacity Issues</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Solution: Monitor utilization rates and plan capacity expansion or redistribution.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}