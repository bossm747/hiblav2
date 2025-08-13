import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, ArrowRight, FileText, Download, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function AutomationDemo() {
  const [isLoading, setIsLoading] = useState(false);
  const [automationStep, setAutomationStep] = useState(0);
  const { toast } = useToast();

  const handleGenerateSalesOrder = async () => {
    setIsLoading(true);
    setAutomationStep(1);
    
    // Simulate API call
    setTimeout(() => {
      setAutomationStep(2);
      toast({
        title: "Sales Order Generated!",
        description: "Sales Order SO-2025.01.001 created successfully from quotation.",
      });
      setIsLoading(false);
    }, 2000);
  };

  const handleConfirmSalesOrder = async () => {
    setIsLoading(true);
    setAutomationStep(3);
    
    // Simulate API call
    setTimeout(() => {
      setAutomationStep(4);
      toast({
        title: "Workflow Automated!",
        description: "Sales Order confirmed. Job Order and Invoice auto-generated.",
      });
      setIsLoading(false);
    }, 3000);
  };

  const downloadPDF = (documentType: string) => {
    toast({
      title: `${documentType} PDF Downloaded`,
      description: "Professional PDF document ready for printing.",
    });
  };

  const automationSteps = [
    {
      step: 1,
      title: "Generate Sales Order from Quotation",
      description: "One-click conversion with automatic numbering (YYYY.MM.###)",
      status: automationStep >= 1 ? "completed" : "pending",
      icon: <FileText className="w-4 h-4" />
    },
    {
      step: 2,
      title: "Sales Order Created",
      description: "Ready for review and confirmation",
      status: automationStep >= 2 ? "completed" : "pending",
      icon: <CheckCircle2 className="w-4 h-4" />
    },
    {
      step: 3,
      title: "Confirm Sales Order",
      description: "Auto-generates Job Order and Invoice with same series number",
      status: automationStep >= 3 ? "completed" : "pending",
      icon: <Zap className="w-4 h-4" />
    },
    {
      step: 4,
      title: "Complete Workflow Generated",
      description: "Job Order, Invoice, and inventory updates completed",
      status: automationStep >= 4 ? "completed" : "pending",
      icon: <CheckCircle2 className="w-4 h-4" />
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-500" />
            Document Automation System
          </CardTitle>
          <CardDescription>
            Eliminate manual document creation with one-click automation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Automation Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">95%</div>
              <div className="text-sm text-muted-foreground">Time Saved</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">100%</div>
              <div className="text-sm text-muted-foreground">Error Elimination</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">15+</div>
              <div className="text-sm text-muted-foreground">Steps Automated</div>
            </div>
          </div>

          <Separator />

          {/* Automation Workflow Demo */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <ArrowRight className="w-4 h-4" />
              Automated Workflow Process
            </h3>
            
            <div className="space-y-3">
              {automationSteps.map((step, index) => (
                <div key={step.step} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className={`p-2 rounded-full ${
                    step.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{step.title}</div>
                    <div className="text-sm text-muted-foreground">{step.description}</div>
                  </div>
                  <Badge variant={step.status === 'completed' ? 'default' : 'secondary'}>
                    {step.status === 'completed' ? 'Complete' : 'Pending'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Demo Actions */}
          <div className="space-y-4">
            <h3 className="font-semibold">Try Document Automation</h3>
            
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={handleGenerateSalesOrder}
                disabled={isLoading || automationStep >= 1}
                className="flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Generate Sales Order
              </Button>
              
              <Button 
                onClick={handleConfirmSalesOrder}
                disabled={isLoading || automationStep < 2 || automationStep >= 3}
                variant="secondary"
                className="flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Confirm & Auto-Generate
              </Button>
            </div>

            {automationStep >= 4 && (
              <div className="space-y-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="font-semibold text-green-800">✅ Automation Complete!</div>
                <div className="text-sm text-green-700">
                  All documents have been automatically generated with professional PDF templates.
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => downloadPDF("Sales Order")}
                    className="flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    Sales Order PDF
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => downloadPDF("Job Order")}
                    className="flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    Job Order PDF
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => downloadPDF("Invoice")}
                    className="flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    Invoice PDF
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Features List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div className="space-y-2">
              <h4 className="font-medium">Automated Features</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>✓ Series numbering (YYYY.MM.###)</li>
                <li>✓ Data validation and error handling</li>
                <li>✓ Inventory updates</li>
                <li>✓ Status synchronization</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Professional PDFs</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>✓ Hibla branding and letterhead</li>
                <li>✓ A4 print-ready format</li>
                <li>✓ Signature sections</li>
                <li>✓ Terms and conditions</li>
              </ul>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}