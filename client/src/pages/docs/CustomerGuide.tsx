import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  CreditCard, 
  Star,
  TrendingUp,
  Calendar,
  FileText,
  MessageCircle,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function CustomerGuide() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Users className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Customer Management</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Complete customer relationship management system. Manage customer information, 
          track interactions, and build strong business relationships.
        </p>
      </div>

      {/* Customer Tiers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5" />
            <span>Customer Tier System</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                tier: "New Customer",
                description: "First-time buyers",
                pricing: "+15% markup",
                color: "bg-blue-100 text-blue-800",
                benefits: ["Welcome bonus", "Onboarding support", "Standard terms"]
              },
              {
                tier: "Regular Customer",
                description: "Repeat customers",
                pricing: "Standard pricing",
                color: "bg-green-100 text-green-800",
                benefits: ["Standard pricing", "Regular support", "Volume discounts"]
              },
              {
                tier: "Premier Customer",
                description: "High-value customers",
                pricing: "15% discount",
                color: "bg-purple-100 text-purple-800",
                benefits: ["Priority support", "Extended credit", "Custom pricing"]
              },
              {
                tier: "Custom Pricing",
                description: "Enterprise customers",
                pricing: "Negotiated rates",
                color: "bg-orange-100 text-orange-800",
                benefits: ["Custom contracts", "Dedicated support", "Special terms"]
              }
            ].map((tier) => (
              <Card key={tier.tier}>
                <CardContent className="p-4 text-center">
                  <Badge className={tier.color + " mb-2"}>{tier.tier}</Badge>
                  <h3 className="font-semibold mb-1">{tier.tier}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{tier.description}</p>
                  <p className="text-sm font-medium text-primary">{tier.pricing}</p>
                  <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                    {tier.benefits.map((benefit, index) => (
                      <li key={index}>• {benefit}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Customer Information Management */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Customer Information Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: "Contact Information",
              description: "Comprehensive contact details and communication preferences",
              icon: Phone,
              fields: ["Full name and company", "Email addresses", "Phone numbers", "Physical addresses", "Preferred contact method"]
            },
            {
              title: "Business Profile",
              description: "Business relationship and commercial details",
              icon: User,
              fields: ["Company information", "Industry type", "Business size", "Tax identification", "Registration details"]
            },
            {
              title: "Financial Information",
              description: "Credit limits, payment terms, and financial history",
              icon: CreditCard,
              fields: ["Credit limit", "Payment terms", "Currency preference", "Banking details", "Payment history"]
            },
            {
              title: "Relationship Status",
              description: "Customer tier, status, and relationship health",
              icon: Star,
              fields: ["Customer tier", "Account status", "Relationship manager", "Satisfaction score", "Loyalty points"]
            }
          ].map((section) => {
            const Icon = section.icon;
            return (
              <Card key={section.title}>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">{section.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.fields.map((field, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span>{field}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Customer Activities */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Customer Activity Tracking</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              activity: "Order History",
              description: "Complete record of all customer orders and transactions",
              icon: FileText,
              metrics: ["Total orders: 15", "Total value: $12,450", "Average order: $830", "Last order: 2 days ago"]
            },
            {
              activity: "Communication Log",
              description: "Track all interactions and communications",
              icon: MessageCircle,
              metrics: ["Emails sent: 23", "Calls made: 8", "Meetings: 3", "Last contact: Today"]
            },
            {
              activity: "Performance Metrics",
              description: "Customer relationship health and performance indicators",
              icon: TrendingUp,
              metrics: ["Satisfaction: 95%", "On-time payment: 100%", "Referrals: 2", "Retention: 24 months"]
            }
          ].map((activity) => {
            const Icon = activity.icon;
            return (
              <Card key={activity.activity}>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{activity.activity}</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {activity.metrics.map((metric, index) => (
                      <div key={index} className="p-2 bg-muted rounded text-sm text-center">
                        {metric}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Customer Operations */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Common Customer Operations</h2>
        <div className="space-y-4">
          {[
            {
              operation: "Create New Customer",
              description: "Add a new customer to the system",
              steps: ["Navigate to Customer Management", "Click 'Add Customer'", "Fill required information", "Set customer tier and terms"],
              complexity: "Easy",
              time: "5 minutes"
            },
            {
              operation: "Update Customer Information",
              description: "Modify existing customer details",
              steps: ["Find customer record", "Click 'Edit Customer'", "Update relevant fields", "Save changes"],
              complexity: "Easy",
              time: "3 minutes"
            },
            {
              operation: "Upgrade Customer Tier",
              description: "Change customer tier based on business growth",
              steps: ["Review customer performance", "Assess tier requirements", "Update tier setting", "Notify customer of changes"],
              complexity: "Medium",
              time: "10 minutes"
            },
            {
              operation: "Customer Credit Review",
              description: "Evaluate and adjust customer credit limits",
              steps: ["Review payment history", "Assess current credit usage", "Analyze business growth", "Adjust credit limit"],
              complexity: "Advanced",
              time: "30 minutes"
            }
          ].map((op) => (
            <Card key={op.operation}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
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
                  <div className="text-right ml-4">
                    <div className="text-sm font-medium">{op.time}</div>
                    <div className="text-xs text-muted-foreground">Estimated time</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Best Practices */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/10">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-200">Customer Management Best Practices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-blue-800 dark:text-blue-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Data Quality:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Keep contact information up to date</li>
                <li>• Verify email addresses and phone numbers</li>
                <li>• Document all customer interactions</li>
                <li>• Regular data cleanup and validation</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Relationship Building:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Regular communication and follow-ups</li>
                <li>• Personalized service based on tier</li>
                <li>• Proactive problem resolution</li>
                <li>• Feedback collection and action</li>
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
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Duplicate Customer Records</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Solution: Use customer search before creating new records and merge duplicates when found.
              </p>
            </div>
            <div className="p-4 border-l-4 border-red-400 bg-red-50 dark:bg-red-950/10">
              <h4 className="font-medium text-red-800 dark:text-red-200">Credit Limit Exceeded</h4>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                Solution: Review customer payment history and either increase limit or require prepayment.
              </p>
            </div>
            <div className="p-4 border-l-4 border-green-400 bg-green-50 dark:bg-green-950/10">
              <h4 className="font-medium text-green-800 dark:text-green-200">Customer Communication Issues</h4>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                Solution: Verify contact information and use multiple communication channels for important messages.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}