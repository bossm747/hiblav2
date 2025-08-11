import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserPlus, 
  Star, 
  Phone, 
  Mail, 
  CheckCircle, 
  TrendingUp,
  Calendar,
  MessageCircle,
  CreditCard,
  Heart
} from 'lucide-react';

export default function WorkflowCustomer() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Users className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Customer Onboarding Workflow</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Comprehensive customer onboarding and relationship management workflow. 
          Build strong customer relationships from initial contact to long-term partnership.
        </p>
      </div>

      {/* Customer Journey Stages */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Relationship Journey</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[
              {
                stage: "Lead Generation",
                description: "Initial contact and interest identification",
                icon: UserPlus,
                color: "bg-blue-100 text-blue-800",
                duration: "Initial contact",
                activities: ["Marketing outreach", "Referral programs", "Website inquiries", "Trade shows"]
              },
              {
                stage: "Customer Onboarding",
                description: "New customer setup and orientation",
                icon: Users,
                color: "bg-purple-100 text-purple-800",
                duration: "1-2 weeks",
                activities: ["Account creation", "Credit evaluation", "Terms negotiation", "System setup"]
              },
              {
                stage: "Relationship Building",
                description: "Ongoing relationship development",
                icon: Heart,
                color: "bg-pink-100 text-pink-800",
                duration: "Ongoing",
                activities: ["Regular communication", "Service delivery", "Feedback collection", "Value addition"]
              },
              {
                stage: "Loyalty & Growth",
                description: "Long-term partnership and expansion",
                icon: Star,
                color: "bg-gold-100 text-gold-800",
                duration: "Long-term",
                activities: ["Tier upgrades", "Volume growth", "Referrals", "Partnership expansion"]
              }
            ].map((stage, index) => (
              <div key={stage.stage} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className={`w-16 h-16 ${stage.color} rounded-lg flex items-center justify-center`}>
                    <stage.icon className="h-8 w-8" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-xl font-semibold">{stage.stage}</h3>
                    <Badge variant="outline">{stage.duration}</Badge>
                  </div>
                  <p className="text-muted-foreground mb-3">{stage.description}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {stage.activities.map((activity, actIndex) => (
                      <div key={activity} className="p-2 bg-muted rounded text-sm text-center">
                        {activity}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Onboarding Process */}
      <div>
        <h2 className="text-2xl font-bold mb-6">New Customer Onboarding Process</h2>
        <div className="space-y-6">
          {[
            {
              step: "Initial Contact & Qualification",
              description: "First interaction and customer qualification",
              details: [
                "Capture customer contact information",
                "Understand business requirements",
                "Assess company size and needs",
                "Determine decision-making process",
                "Evaluate potential business value"
              ],
              owner: "Sales Team",
              duration: "1-2 days",
              output: "Qualified prospect record"
            },
            {
              step: "Customer Profile Creation",
              description: "Comprehensive customer setup in system",
              details: [
                "Create customer account in system",
                "Input detailed contact information",
                "Set up company profile and details",
                "Configure communication preferences",
                "Establish initial customer tier"
              ],
              owner: "Sales Staff",
              duration: "2-4 hours",
              output: "Complete customer profile"
            },
            {
              step: "Credit Assessment & Terms",
              description: "Evaluate creditworthiness and set terms",
              details: [
                "Conduct credit check and analysis",
                "Review financial references",
                "Set appropriate credit limits",
                "Negotiate payment terms",
                "Document agreed terms"
              ],
              owner: "Finance Team",
              duration: "3-5 days",
              output: "Approved credit terms"
            },
            {
              step: "Welcome & Orientation",
              description: "Introduce customer to systems and processes",
              details: [
                "Send welcome package",
                "Introduce account management team",
                "Provide product catalogs and information",
                "Explain ordering and support processes",
                "Schedule regular check-ins"
              ],
              owner: "Customer Service",
              duration: "1 week",
              output: "Onboarded customer ready for business"
            }
          ].map((process, index) => (
            <Card key={process.step}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <span>{process.step}</span>
                  </CardTitle>
                  <Badge variant="outline">{process.duration}</Badge>
                </div>
                <p className="text-muted-foreground">{process.description}</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Key Activities:</h4>
                    <ul className="space-y-2">
                      {process.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start space-x-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Process Owner:</h4>
                      <p className="text-sm text-muted-foreground">{process.owner}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Expected Output:</h4>
                      <p className="text-sm text-muted-foreground">{process.output}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Customer Tier Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5" />
            <span>Customer Tier Progression</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                tier: "New Customer",
                criteria: "First-time buyers",
                benefits: ["Welcome support", "Standard pricing", "Basic terms"],
                progression: "Complete first order"
              },
              {
                tier: "Regular Customer",
                criteria: "Multiple orders, good payment history",
                benefits: ["Standard pricing", "Extended terms", "Priority support"],
                progression: "Consistent ordering, volume growth"
              },
              {
                tier: "Premier Customer",
                criteria: "High volume, strategic importance",
                benefits: ["15% discount", "Extended credit", "Dedicated support"],
                progression: "Long-term partnership value"
              },
              {
                tier: "Custom Pricing",
                criteria: "Enterprise-level partnership",
                benefits: ["Negotiated rates", "Custom terms", "Strategic partnership"],
                progression: "Strategic business value"
              }
            ].map((tier) => (
              <Card key={tier.tier}>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{tier.tier}</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium">Criteria:</span>
                      <p className="text-muted-foreground">{tier.criteria}</p>
                    </div>
                    <div>
                      <span className="font-medium">Benefits:</span>
                      <ul className="text-muted-foreground space-y-1">
                        {tier.benefits.map((benefit, idx) => (
                          <li key={idx}>• {benefit}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="font-medium">Progression:</span>
                      <p className="text-muted-foreground">{tier.progression}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Communication Strategy */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Customer Communication Strategy</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              type: "Proactive Communication",
              description: "Regular outreach and relationship building",
              icon: Phone,
              frequency: "Monthly",
              activities: ["Account reviews", "Product updates", "Market insights", "Relationship check-ins"]
            },
            {
              type: "Reactive Support",
              description: "Responsive customer service and support",
              icon: MessageCircle,
              frequency: "As needed",
              activities: ["Issue resolution", "Order support", "Technical assistance", "Complaint handling"]
            },
            {
              type: "Milestone Recognition",
              description: "Celebrating customer achievements and milestones",
              icon: Star,
              frequency: "Event-based",
              activities: ["Anniversary recognition", "Volume milestones", "Thank you messages", "Special offers"]
            },
            {
              type: "Business Development",
              description: "Growth opportunities and expansion discussions",
              icon: TrendingUp,
              frequency: "Quarterly",
              activities: ["Growth planning", "New products", "Market expansion", "Partnership opportunities"]
            }
          ].map((comm) => {
            const Icon = comm.icon;
            return (
              <Card key={comm.type}>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{comm.type}</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">{comm.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Frequency:</span>
                      <Badge variant="outline">{comm.frequency}</Badge>
                    </div>
                    <div>
                      <span className="font-medium">Activities:</span>
                      <ul className="mt-2 space-y-1">
                        {comm.activities.map((activity, idx) => (
                          <li key={idx} className="flex items-center space-x-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            <span>{activity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Success Metrics */}
      <Card className="border-green-200 bg-green-50 dark:bg-green-950/10">
        <CardHeader>
          <CardTitle className="text-green-800 dark:text-green-200">Customer Success Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-green-800 dark:text-green-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Relationship Health:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Customer satisfaction score: 90%+</li>
                <li>• Response time to inquiries: <2 hours</li>
                <li>• Issue resolution rate: 95%+</li>
                <li>• Communication frequency: Monthly minimum</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Business Growth:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Customer retention rate: 85%+</li>
                <li>• Average order value growth: 10%+ annually</li>
                <li>• Order frequency increase: 15%+ annually</li>
                <li>• Referral generation: 2+ per year</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}