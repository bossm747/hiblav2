import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Package, 
  Settings, 
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';

export default function PricingGuide() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <DollarSign className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Price Management</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Comprehensive pricing system with tier-based pricing, VLOOKUP functionality, 
          and advanced price management capabilities.
        </p>
      </div>

      {/* Pricing System Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Tiered Pricing System</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { tier: "New Customer", markup: "+15%", color: "bg-blue-100 text-blue-800" },
              { tier: "Regular Customer", markup: "Base Price", color: "bg-green-100 text-green-800" },
              { tier: "Premier Customer", markup: "-15%", color: "bg-purple-100 text-purple-800" },
              { tier: "Custom Pricing", markup: "Negotiated", color: "bg-orange-100 text-orange-800" }
            ].map((tier) => (
              <Card key={tier.tier}>
                <CardContent className="p-4 text-center">
                  <Badge className={tier.color + " mb-2"}>{tier.tier}</Badge>
                  <div className="text-2xl font-bold text-primary">{tier.markup}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: "Price List Management",
              description: "Create and manage multiple price lists",
              icon: Package,
              features: ["Multiple price lists", "Bulk operations", "Version control", "Effective dates"]
            },
            {
              title: "Customer Tier Pricing",
              description: "Automatic pricing based on customer tier",
              icon: Users,
              features: ["Tier-based discounts", "Volume pricing", "Customer-specific rates", "Automatic application"]
            },
            {
              title: "VLOOKUP Integration",
              description: "Real-time price lookup from master catalog",
              icon: BarChart3,
              features: ["Real-time updates", "Multiple catalogs", "Error handling", "Audit trail"]
            },
            {
              title: "Price Administration",
              description: "Complete administrative control",
              icon: Settings,
              features: ["Admin dashboard", "CRUD operations", "Statistics", "Performance tracking"]
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

      {/* Price Management Operations */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Price Management Operations</h2>
        <div className="space-y-4">
          {[
            {
              operation: "Create Price List",
              description: "Add a new price list for specific customer segments",
              icon: Plus,
              steps: ["Navigate to Price Management", "Click 'Add Price List'", "Enter list details", "Add products and prices"],
              complexity: "Easy"
            },
            {
              operation: "Bulk Price Update",
              description: "Update multiple product prices simultaneously",
              icon: Edit,
              steps: ["Select price list", "Choose bulk operation", "Set percentage or amount", "Review and apply changes"],
              complexity: "Medium"
            },
            {
              operation: "Custom Product Pricing",
              description: "Set individual product prices for specific scenarios",
              icon: Settings,
              steps: ["Find product in list", "Set custom price", "Define applicability", "Save and activate"],
              complexity: "Medium"
            },
            {
              operation: "Delete Price List",
              description: "Remove obsolete or unused price lists",
              icon: Trash2,
              steps: ["Select price list", "Verify no active usage", "Confirm deletion", "Update references"],
              complexity: "Advanced"
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
                        <Badge variant={op.complexity === 'Easy' ? 'secondary' : op.complexity === 'Medium' ? 'default' : 'destructive'}>
                          {op.complexity}
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

      {/* Best Practices */}
      <Card className="border-green-200 bg-green-50 dark:bg-green-950/10">
        <CardHeader>
          <CardTitle className="text-green-800 dark:text-green-200">Pricing Best Practices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-green-800 dark:text-green-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Strategy:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Regular market price analysis</li>
                <li>• Competitive pricing research</li>
                <li>• Cost-plus pricing models</li>
                <li>• Volume discount strategies</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Operations:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Test price changes carefully</li>
                <li>• Maintain price history</li>
                <li>• Regular price list reviews</li>
                <li>• Customer communication</li>
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
            <div className="p-4 border-l-4 border-yellow-400 bg-yellow-50 dark:bg-yellow-950/10">
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Price Inconsistencies</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Solution: Use VLOOKUP validation and regular price audits to ensure consistency.
              </p>
            </div>
            <div className="p-4 border-l-4 border-red-400 bg-red-50 dark:bg-red-950/10">
              <h4 className="font-medium text-red-800 dark:text-red-200">Customer Pricing Errors</h4>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                Solution: Verify customer tier settings and check price list assignments.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}