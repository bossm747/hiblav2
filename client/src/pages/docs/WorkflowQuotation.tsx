import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  User, 
  ShoppingCart, 
  Send, 
  CheckCircle, 
  ArrowRight,
  Clock,
  AlertCircle,
  DollarSign,
  Package
} from 'lucide-react';

export default function WorkflowQuotation() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <FileText className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Quotation to Sales Workflow</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Complete workflow from initial customer inquiry to confirmed sales order. 
          Learn the step-by-step process for converting prospects into customers.
        </p>
      </div>

      {/* Workflow Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Complete Workflow Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {[
              {
                phase: "Initial Inquiry",
                steps: ["Customer Contact", "Requirement Gathering"],
                icon: User,
                color: "bg-blue-100 text-blue-800",
                duration: "1-2 hours"
              },
              {
                phase: "Quotation Creation",
                steps: ["Product Selection", "Pricing Configuration", "Document Generation"],
                icon: FileText,
                color: "bg-purple-100 text-purple-800",
                duration: "2-4 hours"
              },
              {
                phase: "Customer Review",
                steps: ["Quotation Delivery", "Customer Evaluation", "Negotiation"],
                icon: Send,
                color: "bg-orange-100 text-orange-800",
                duration: "1-5 days"
              },
              {
                phase: "Sales Conversion",
                steps: ["Order Confirmation", "Sales Order Creation", "Production Planning"],
                icon: ShoppingCart,
                color: "bg-green-100 text-green-800",
                duration: "1-2 days"
              }
            ].map((phase, index) => (
              <div key={phase.phase} className="relative">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className={`w-16 h-16 ${phase.color} rounded-lg flex items-center justify-center`}>
                      <phase.icon className="h-8 w-8" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-xl font-semibold">{phase.phase}</h3>
                      <Badge variant="outline">{phase.duration}</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {phase.steps.map((step, stepIndex) => (
                        <div key={step} className="p-3 bg-muted rounded-lg">
                          <div className="flex items-center space-x-2">
                            <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                              {stepIndex + 1}
                            </span>
                            <span className="text-sm font-medium">{step}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {index < 3 && (
                  <div className="flex justify-center my-6">
                    <ArrowRight className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Step Breakdown */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Detailed Process Steps</h2>
        <div className="space-y-6">
          {[
            {
              step: "Customer Inquiry Processing",
              description: "Handle initial customer contact and gather requirements",
              details: [
                "Record customer contact information",
                "Understand product requirements",
                "Determine quantity and specifications",
                "Assess delivery timeline needs",
                "Identify decision makers"
              ],
              duration: "30-60 minutes",
              owner: "Sales Staff",
              tools: "Customer Management, CRM"
            },
            {
              step: "Quotation Development",
              description: "Create comprehensive quotation based on requirements",
              details: [
                "Select appropriate products from catalog",
                "Apply customer tier pricing",
                "Calculate quantities and totals",
                "Add terms and conditions",
                "Generate professional PDF document"
              ],
              duration: "1-2 hours",
              owner: "Sales Staff / Sales Manager",
              tools: "Quotation System, Price Management"
            },
            {
              step: "Customer Presentation",
              description: "Present quotation to customer and handle questions",
              details: [
                "Schedule presentation meeting",
                "Explain product specifications",
                "Justify pricing and value proposition",
                "Address customer concerns",
                "Negotiate terms if needed"
              ],
              duration: "1-2 hours",
              owner: "Sales Staff / Sales Manager",
              tools: "Communication Tools, Product Catalog"
            },
            {
              step: "Order Confirmation",
              description: "Finalize terms and convert to sales order",
              details: [
                "Receive customer approval",
                "Confirm final specifications",
                "Verify delivery requirements",
                "Create sales order in system",
                "Initiate production planning"
              ],
              duration: "30 minutes",
              owner: "Sales Manager",
              tools: "Sales Order System, Production Planning"
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
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{process.duration}</span>
                  </div>
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
                      <h4 className="font-medium mb-2">Required Tools:</h4>
                      <p className="text-sm text-muted-foreground">{process.tools}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Success Metrics */}
      <Card className="border-green-200 bg-green-50 dark:bg-green-950/10">
        <CardHeader>
          <CardTitle className="text-green-800 dark:text-green-200">Success Metrics & KPIs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-green-800 dark:text-green-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Conversion Metrics:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Inquiry to Quotation Rate: 85%+</li>
                <li>• Quotation to Sales Order: 20%+</li>
                <li>• Average Deal Size: $800+</li>
                <li>• Customer Satisfaction: 90%+</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Efficiency Metrics:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Quotation Response Time: &lt;4 hours</li>
                <li>• Sales Cycle Length: &lt;7 days</li>
                <li>• Quote Accuracy Rate: 95%+</li>
                <li>• Customer Retention: 80%+</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Common Challenges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5" />
            <span>Common Challenges & Solutions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-yellow-400 bg-yellow-50 dark:bg-yellow-950/10">
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Delayed Customer Response</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Solution: Set clear follow-up schedules and provide gentle reminders. Offer additional support or clarification.
              </p>
            </div>
            <div className="p-4 border-l-4 border-red-400 bg-red-50 dark:bg-red-950/10">
              <h4 className="font-medium text-red-800 dark:text-red-200">Price Objections</h4>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                Solution: Clearly communicate value proposition. Consider volume discounts or alternative product options.
              </p>
            </div>
            <div className="p-4 border-l-4 border-blue-400 bg-blue-50 dark:bg-blue-950/10">
              <h4 className="font-medium text-blue-800 dark:text-blue-200">Complex Requirements</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Solution: Break down complex requirements into phases. Involve technical experts in discussions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}