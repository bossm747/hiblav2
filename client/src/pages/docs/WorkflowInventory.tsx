import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  ArrowUpDown, 
  BarChart3, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Search,
  Plus,
  Clock,
  Zap
} from 'lucide-react';

export default function WorkflowInventory() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Package className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Inventory Tracking Workflow</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Comprehensive inventory management workflow across multiple warehouses. 
          Learn how to track, transfer, and optimize inventory efficiently.
        </p>
      </div>

      {/* Inventory Cycle */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Management Cycle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                phase: "Receiving",
                icon: Plus,
                color: "bg-blue-100 text-blue-800",
                activities: ["Goods receipt", "Quality inspection", "System update", "Storage allocation"]
              },
              {
                phase: "Tracking",
                icon: Search,
                color: "bg-purple-100 text-purple-800",
                activities: ["Stock monitoring", "Location tracking", "Level alerts", "Usage analysis"]
              },
              {
                phase: "Optimization",
                icon: TrendingUp,
                color: "bg-orange-100 text-orange-800",
                activities: ["Demand analysis", "Reorder planning", "Transfer decisions", "Cost optimization"]
              },
              {
                phase: "Distribution",
                icon: ArrowUpDown,
                color: "bg-green-100 text-green-800",
                activities: ["Order fulfillment", "Inter-warehouse transfers", "Allocation", "Shipment"]
              }
            ].map((phase) => {
              const Icon = phase.icon;
              return (
                <Card key={phase.phase}>
                  <CardContent className="p-4 text-center">
                    <div className={`w-16 h-16 ${phase.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="font-semibold mb-2">{phase.phase}</h3>
                    <ul className="text-xs space-y-1">
                      {phase.activities.map((activity, idx) => (
                        <li key={idx}>• {activity}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Daily Operations */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Daily Inventory Operations</h2>
        <div className="space-y-6">
          {[
            {
              operation: "Stock Level Monitoring",
              description: "Regular monitoring of inventory levels across all warehouses",
              frequency: "Continuous",
              steps: [
                "Review real-time dashboard",
                "Check low stock alerts",
                "Verify critical item levels",
                "Update reorder points if needed"
              ],
              owner: "Inventory Staff",
              tools: "Inventory Dashboard, AI Insights"
            },
            {
              operation: "Goods Receiving",
              description: "Process incoming inventory from suppliers",
              frequency: "As needed",
              steps: [
                "Verify delivery against purchase order",
                "Conduct quality inspection",
                "Update system quantities",
                "Allocate to appropriate warehouse"
              ],
              owner: "Warehouse Staff",
              tools: "Receiving Module, Quality Checklist"
            },
            {
              operation: "Transfer Processing",
              description: "Handle inter-warehouse inventory transfers",
              frequency: "Daily",
              steps: [
                "Review transfer requests",
                "Verify stock availability",
                "Process transfer transactions",
                "Update location records"
              ],
              owner: "Inventory Manager",
              tools: "Transfer System, Tracking Module"
            },
            {
              operation: "Cycle Counting",
              description: "Regular physical inventory verification",
              frequency: "Weekly",
              steps: [
                "Select items for counting",
                "Conduct physical count",
                "Compare with system records",
                "Adjust discrepancies"
              ],
              owner: "Warehouse Staff",
              tools: "Counting Module, Adjustment Tools"
            }
          ].map((op) => (
            <Card key={op.operation}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{op.operation}</CardTitle>
                  <Badge variant="outline">{op.frequency}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{op.description}</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Process Steps:</h4>
                    <ul className="space-y-2">
                      {op.steps.map((step, idx) => (
                        <li key={idx} className="flex items-start space-x-2 text-sm">
                          <span className="w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                            {idx + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Owner:</h4>
                      <p className="text-sm text-muted-foreground">{op.owner}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Tools Required:</h4>
                      <p className="text-sm text-muted-foreground">{op.tools}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* AI-Powered Optimization */}
      <Card className="border-purple-200 bg-purple-50 dark:bg-purple-950/10">
        <CardHeader>
          <CardTitle className="text-purple-800 dark:text-purple-200 flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>AI-Powered Inventory Optimization</span>
            <Badge className="bg-purple-600 text-white">AI</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-purple-800 dark:text-purple-200">
          <p>Leverage AI insights to optimize your inventory management workflow:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Predictive Analytics:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Demand forecasting for proactive ordering</li>
                <li>• Seasonal trend analysis and preparation</li>
                <li>• Stock-out risk predictions</li>
                <li>• Optimal reorder point calculations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Smart Recommendations:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Automated reorder suggestions</li>
                <li>• Overstock identification and solutions</li>
                <li>• Transfer optimization between warehouses</li>
                <li>• Cost reduction opportunities</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transfer Workflow */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Inter-Warehouse Transfer Process</h2>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              {[
                {
                  step: "Transfer Request",
                  description: "Initiate transfer based on need or optimization",
                  actions: ["Identify transfer need", "Select source/destination", "Specify quantities", "Submit request"],
                  duration: "15 minutes"
                },
                {
                  step: "Approval Process",
                  description: "Manager review and approval",
                  actions: ["Review transfer justification", "Verify stock availability", "Approve or request changes", "Notify relevant parties"],
                  duration: "1-2 hours"
                },
                {
                  step: "Transfer Execution",
                  description: "Physical movement of inventory",
                  actions: ["Prepare items for transfer", "Update source location", "Ship to destination", "Confirm receipt"],
                  duration: "1-3 days"
                },
                {
                  step: "System Update",
                  description: "Update all system records",
                  actions: ["Update destination quantities", "Record transfer completion", "Generate transfer report", "Close transfer order"],
                  duration: "30 minutes"
                }
              ].map((step, index) => (
                <div key={step.step} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{step.step}</h3>
                      <Badge variant="secondary">{step.duration}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{step.description}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {step.actions.map((action, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          <span>{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Best Practices */}
      <Card className="border-green-200 bg-green-50 dark:bg-green-950/10">
        <CardHeader>
          <CardTitle className="text-green-800 dark:text-green-200">Inventory Best Practices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-green-800 dark:text-green-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Accuracy Maintenance:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Regular cycle counting schedules</li>
                <li>• Immediate transaction recording</li>
                <li>• Proper staff training programs</li>
                <li>• Clear standard operating procedures</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Optimization Strategies:</h4>
              <ul className="space-y-2 text-sm">
                <li>• ABC analysis for prioritization</li>
                <li>• Just-in-time ordering where applicable</li>
                <li>• Regular supplier performance reviews</li>
                <li>• Technology integration for efficiency</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Common Issues */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Common Inventory Challenges</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-red-400 bg-red-50 dark:bg-red-950/10">
              <h4 className="font-medium text-red-800 dark:text-red-200">Stock Discrepancies</h4>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                Solution: Implement regular cycle counting, improve transaction accuracy, and investigate root causes of discrepancies.
              </p>
            </div>
            <div className="p-4 border-l-4 border-yellow-400 bg-yellow-50 dark:bg-yellow-950/10">
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Overstocking Issues</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Solution: Use AI insights for better demand forecasting and implement dynamic reorder points based on usage patterns.
              </p>
            </div>
            <div className="p-4 border-l-4 border-blue-400 bg-blue-50 dark:bg-blue-950/10">
              <h4 className="font-medium text-blue-800 dark:text-blue-200">Transfer Delays</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Solution: Streamline approval processes, improve communication between warehouses, and use tracking systems.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}