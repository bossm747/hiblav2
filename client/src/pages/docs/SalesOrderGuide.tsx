import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  ArrowRight, 
  CheckCircle, 
  Package, 
  Truck, 
  DollarSign,
  FileText,
  User,
  Calendar,
  AlertCircle,
  Clock,
  Target
} from 'lucide-react';

export default function SalesOrderGuide() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <ShoppingCart className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Sales Order Management</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Learn how to convert quotations to sales orders and manage the complete order fulfillment process 
          from confirmation to delivery.
        </p>
      </div>

      {/* Conversion Process */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ArrowRight className="h-5 w-5" />
            <span>Quotation to Sales Order Conversion</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold">Approved Quotation</h3>
              <p className="text-sm text-muted-foreground">Customer approves quotation terms</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ArrowRight className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold">Conversion</h3>
              <p className="text-sm text-muted-foreground">One-click conversion to sales order</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ShoppingCart className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold">Sales Order</h3>
              <p className="text-sm text-muted-foreground">Ready for production and fulfillment</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order States */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Order Lifecycle</h2>
        <div className="space-y-4">
          {[
            {
              status: "Pending",
              description: "New sales order awaiting confirmation",
              color: "bg-yellow-100 text-yellow-800",
              icon: Clock,
              actions: ["Confirm", "Edit", "Cancel"]
            },
            {
              status: "Confirmed",
              description: "Order confirmed and ready for production",
              color: "bg-blue-100 text-blue-800", 
              icon: CheckCircle,
              actions: ["Create Job Order", "View Details", "Modify"]
            },
            {
              status: "In Production",
              description: "Items being manufactured",
              color: "bg-purple-100 text-purple-800",
              icon: Package,
              actions: ["Track Progress", "View Job Orders", "Update Status"]
            },
            {
              status: "Ready to Ship",
              description: "Production complete, awaiting shipment",
              color: "bg-green-100 text-green-800",
              icon: Target,
              actions: ["Create Shipment", "Generate Invoice", "Contact Customer"]
            },
            {
              status: "Shipped",
              description: "Order shipped to customer",
              color: "bg-teal-100 text-teal-800",
              icon: Truck,
              actions: ["Track Shipment", "Confirm Delivery", "Generate Documents"]
            },
            {
              status: "Delivered",
              description: "Order successfully delivered",
              color: "bg-emerald-100 text-emerald-800",
              icon: CheckCircle,
              actions: ["Close Order", "Request Feedback", "Archive"]
            }
          ].map((state) => {
            const Icon = state.icon;
            return (
              <Card key={state.status}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Icon className="h-8 w-8 text-primary" />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-lg">{state.status}</h3>
                          <Badge className={state.color}>{state.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{state.description}</p>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Available actions: {state.actions.join(", ")}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Order Management Features */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: "Automatic Numbering",
              description: "Sequential order numbering with customizable formats",
              icon: FileText,
              features: ["Format: SO-YYYY-NNN", "Automatic increment", "Duplicate prevention", "Audit trail"]
            },
            {
              title: "Customer Management",
              description: "Complete customer information and communication",
              icon: User,
              features: ["Contact details", "Order history", "Payment terms", "Communication log"]
            },
            {
              title: "Inventory Integration",
              description: "Real-time inventory checking and allocation",
              icon: Package,
              features: ["Stock verification", "Automatic allocation", "Backorder handling", "Multi-warehouse"]
            },
            {
              title: "Financial Integration",
              description: "Pricing, payments, and financial tracking",
              icon: DollarSign,
              features: ["Payment tracking", "Invoice generation", "Credit management", "Currency support"]
            },
            {
              title: "Production Planning",
              description: "Seamless transition to manufacturing",
              icon: Target,
              features: ["Job order creation", "Production scheduling", "Resource allocation", "Progress tracking"]
            },
            {
              title: "Delivery Management",
              description: "Shipping and delivery coordination",
              icon: Truck,
              features: ["Shipment tracking", "Delivery scheduling", "Customer notification", "Proof of delivery"]
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

      {/* Best Practices */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/10">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-200">Best Practices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-blue-800 dark:text-blue-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Order Processing:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Confirm orders within 24 hours</li>
                <li>• Verify inventory before confirmation</li>
                <li>• Set realistic delivery dates</li>
                <li>• Communicate changes promptly</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Customer Communication:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Send order confirmations immediately</li>
                <li>• Provide regular status updates</li>
                <li>• Notify of any delays proactively</li>
                <li>• Follow up after delivery</li>
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
            <span>Common Issues & Solutions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-yellow-400 bg-yellow-50 dark:bg-yellow-950/10">
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Insufficient Inventory</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Solution: Enable backorder handling or split orders across multiple shipments.
              </p>
            </div>
            <div className="p-4 border-l-4 border-red-400 bg-red-50 dark:bg-red-950/10">
              <h4 className="font-medium text-red-800 dark:text-red-200">Payment Issues</h4>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                Solution: Verify customer credit limits and payment terms before order confirmation.
              </p>
            </div>
            <div className="p-4 border-l-4 border-green-400 bg-green-50 dark:bg-green-950/10">
              <h4 className="font-medium text-green-800 dark:text-green-200">Delivery Delays</h4>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                Solution: Monitor production schedules and communicate with customers about realistic delivery dates.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}