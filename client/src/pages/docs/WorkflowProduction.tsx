import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase, 
  Settings, 
  Package, 
  Truck, 
  CheckCircle, 
  ArrowRight,
  Clock,
  Users,
  Target,
  AlertTriangle
} from 'lucide-react';

export default function WorkflowProduction() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Briefcase className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Production Workflow</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Complete manufacturing workflow from sales order to delivery. 
          Master the production process with proper planning, execution, and quality control.
        </p>
      </div>

      {/* Production Phases */}
      <Card>
        <CardHeader>
          <CardTitle>Production Lifecycle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {[
              {
                phase: "Production Planning",
                description: "Resource allocation and timeline planning",
                icon: Target,
                color: "bg-blue-100 text-blue-800",
                duration: "1-2 days",
                activities: ["Resource planning", "Material sourcing", "Team assignment", "Schedule creation"]
              },
              {
                phase: "Manufacturing",
                description: "Active production and quality monitoring",
                icon: Settings,
                color: "bg-purple-100 text-purple-800",
                duration: "5-10 days",
                activities: ["Production execution", "Quality checks", "Progress tracking", "Issue resolution"]
              },
              {
                phase: "Quality Assurance",
                description: "Final inspection and approval",
                icon: CheckCircle,
                color: "bg-orange-100 text-orange-800",
                duration: "1-2 days",
                activities: ["Final inspection", "Compliance verification", "Documentation", "Approval process"]
              },
              {
                phase: "Delivery Preparation",
                description: "Packaging and shipment coordination",
                icon: Package,
                color: "bg-green-100 text-green-800",
                duration: "1-3 days",
                activities: ["Final packaging", "Documentation prep", "Shipping coordination", "Customer notification"]
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
                    <p className="text-muted-foreground mb-3">{phase.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {phase.activities.map((activity, actIndex) => (
                        <div key={activity} className="p-2 bg-muted rounded text-sm text-center">
                          {activity}
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

      {/* Detailed Process Steps */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Detailed Production Steps</h2>
        <div className="space-y-6">
          {[
            {
              step: "Job Order Creation",
              description: "Convert sales order into production job order",
              details: [
                "Review sales order specifications",
                "Create job order with unique number",
                "Define production requirements",
                "Set delivery timeline",
                "Assign production team"
              ],
              owner: "Production Manager",
              duration: "2-4 hours",
              dependencies: "Approved sales order"
            },
            {
              step: "Resource Planning",
              description: "Allocate materials, equipment, and personnel",
              details: [
                "Check material availability",
                "Reserve required equipment",
                "Assign skilled personnel",
                "Schedule production time slots",
                "Prepare work instructions"
              ],
              owner: "Production Manager",
              duration: "4-8 hours",
              dependencies: "Job order created"
            },
            {
              step: "Production Execution",
              description: "Execute manufacturing according to specifications",
              details: [
                "Follow standard operating procedures",
                "Monitor production progress",
                "Conduct quality checks",
                "Document any issues",
                "Update completion status"
              ],
              owner: "Production Staff",
              duration: "5-10 days",
              dependencies: "Resources allocated"
            },
            {
              step: "Final Inspection",
              description: "Comprehensive quality verification",
              details: [
                "Inspect finished products",
                "Verify specifications compliance",
                "Test functionality if applicable",
                "Document quality results",
                "Approve for delivery"
              ],
              owner: "Quality Control",
              duration: "4-8 hours",
              dependencies: "Production completed"
            }
          ].map((process, index) => (
            <Card key={process.step}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <span>{process.step}</span>
                </CardTitle>
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
                      <h4 className="font-medium mb-2">Duration:</h4>
                      <p className="text-sm text-muted-foreground">{process.duration}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Dependencies:</h4>
                      <p className="text-sm text-muted-foreground">{process.dependencies}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quality Control Points */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Quality Control Checkpoints</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                checkpoint: "Material Inspection",
                when: "Before production starts",
                criteria: ["Material quality", "Specification compliance", "Quantity verification"],
                action: "Approve or reject materials"
              },
              {
                checkpoint: "In-Process Quality",
                when: "During production",
                criteria: ["Process compliance", "Interim quality checks", "Specification adherence"],
                action: "Continue or adjust process"
              },
              {
                checkpoint: "Pre-Delivery Inspection",
                when: "After production completion",
                criteria: ["Final product quality", "Specification compliance", "Packaging standards"],
                action: "Approve for shipping"
              },
              {
                checkpoint: "Customer Acceptance",
                when: "Upon delivery",
                criteria: ["Customer satisfaction", "Product performance", "Service quality"],
                action: "Close order or address issues"
              }
            ].map((qc) => (
              <Card key={qc.checkpoint}>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{qc.checkpoint}</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium">When: </span>
                      <span className="text-muted-foreground">{qc.when}</span>
                    </div>
                    <div>
                      <span className="font-medium">Criteria:</span>
                      <ul className="mt-1 space-y-1">
                        {qc.criteria.map((criterion, idx) => (
                          <li key={idx} className="flex items-center space-x-2">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            <span>{criterion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="font-medium">Action: </span>
                      <span className="text-muted-foreground">{qc.action}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/10">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-200">Production Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-blue-800 dark:text-blue-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Efficiency Metrics:</h4>
              <ul className="space-y-2 text-sm">
                <li>• On-time delivery rate: 95%+</li>
                <li>• Production cycle time: Within schedule</li>
                <li>• Resource utilization: 80%+</li>
                <li>• First-pass quality rate: 98%+</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Quality Metrics:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Defect rate: &lt;2%</li>
                <li>• Customer satisfaction: 90%+</li>
                <li>• Rework percentage: &lt;5%</li>
                <li>• Compliance rate: 100%</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Common Production Issues */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Common Production Challenges</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-red-400 bg-red-50 dark:bg-red-950/10">
              <h4 className="font-medium text-red-800 dark:text-red-200">Material Shortage</h4>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                Solution: Maintain safety stock levels and establish backup suppliers. Implement just-in-time ordering with buffer.
              </p>
            </div>
            <div className="p-4 border-l-4 border-yellow-400 bg-yellow-50 dark:bg-yellow-950/10">
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Equipment Downtime</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Solution: Implement preventive maintenance schedules and keep spare parts inventory. Cross-train staff on multiple machines.
              </p>
            </div>
            <div className="p-4 border-l-4 border-blue-400 bg-blue-50 dark:bg-blue-950/10">
              <h4 className="font-medium text-blue-800 dark:text-blue-200">Quality Issues</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Solution: Strengthen quality control processes and provide additional staff training. Review and update standard operating procedures.
              </p>
            </div>
            <div className="p-4 border-l-4 border-green-400 bg-green-50 dark:bg-green-950/10">
              <h4 className="font-medium text-green-800 dark:text-green-200">Schedule Delays</h4>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                Solution: Build buffer time into schedules and maintain clear communication with customers about realistic timelines.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}