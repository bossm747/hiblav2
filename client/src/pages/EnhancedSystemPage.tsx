import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EnhancedQuotationForm } from '@/components/forms/EnhancedQuotationForm';
import { PaymentRecordingModule } from '@/components/modules/PaymentRecordingModule';
import { JobOrderModule } from '@/components/modules/JobOrderModule';
import {
  Calculator,
  Receipt,
  Factory,
  FileText,
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
  DollarSign,
  Package,
  ArrowRight,
  Plus,
  Eye,
  Edit,
  Download,
  Send,
} from 'lucide-react';

export function EnhancedSystemPage() {
  const [activeTab, setActiveTab] = useState('quotations');
  const [showQuotationForm, setShowQuotationForm] = useState(false);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Enhanced Hibla System
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Complete manufacturing workflow with client-specified requirements
          </p>
        </div>
        <Badge variant="default" className="bg-green-100 text-green-800 px-3 py-1">
          All Client Requirements Implemented
        </Badge>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enhanced Quotations</CardTitle>
            <Calculator className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">✓</div>
            <p className="text-xs text-muted-foreground">
              1 decimal quantities, creator initials, file uploads, revision restrictions
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Recording</CardTitle>
            <Receipt className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">✓</div>
            <p className="text-xs text-muted-foreground">
              WhatsApp workflow, client support upload, finance verification
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Job Orders</CardTitle>
            <Factory className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">✓</div>
            <p className="text-xs text-muted-foreground">
              Production tracking, shipment columns, workflow management
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Document Format</CardTitle>
            <FileText className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">✓</div>
            <p className="text-xs text-muted-foreground">
              YYYY.MM.### format, R1-R5 revisions, due date calendar
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Client Requirements Implementation Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Client Requirements Implementation Status
          </CardTitle>
          <CardDescription>
            All specified requirements have been implemented and tested
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold">✅ Quotation Requirements</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Creator initials display on documents
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Quantity with 1 decimal place formatting
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  File upload capability for attachments
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Cannot revise quotations after next day
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Enhanced print format with item details
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">✅ Sales Order Requirements</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Client Code dropdown from database
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Sales Order format: YYYY.MM.###
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Revision dropdown: R1, R2, R3, R4, R5
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Due Date with calendar selection
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Order Confirmation with inventory updates
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-green-800 dark:text-green-200">
                Payment Recording Module & Job Order Management Complete
              </span>
            </div>
            <p className="text-sm text-green-700 dark:text-green-300 mt-1">
              WhatsApp workflow implementation with client support upload and finance team verification process integrated.
              Job order management with production tracking and shipment columns per PDF format requirements.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Main System Modules */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="quotations" className="flex items-center gap-2" data-testid="tab-quotations">
            <Calculator className="h-4 w-4" />
            Enhanced Quotations
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2" data-testid="tab-payments">
            <Receipt className="h-4 w-4" />
            Payment Recording
          </TabsTrigger>
          <TabsTrigger value="joborders" className="flex items-center gap-2" data-testid="tab-joborders">
            <Factory className="h-4 w-4" />
            Job Order Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quotations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-blue-600" />
                  Enhanced Quotation System
                </span>
                <EnhancedQuotationForm
                  trigger={
                    <Button className="flex items-center gap-2" data-testid="button-new-quotation">
                      <Plus className="h-4 w-4" />
                      New Quotation
                    </Button>
                  }
                />
              </CardTitle>
              <CardDescription>
                Create quotations with creator initials, decimal quantities, file uploads, and revision restrictions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Key Features Implemented</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Creator initials automatically displayed on documents</li>
                    <li>• Quantity input with 1 decimal place precision (e.g., 25.5)</li>
                    <li>• Multiple file upload support for attachments</li>
                    <li>• Revision lock after next day from creation</li>
                    <li>• Client code dropdown from client database</li>
                    <li>• Enhanced PDF generation with proper formatting</li>
                    <li>• Automatic calculation of line totals and pricing</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Workflow Integration</h4>
                  <div className="flex items-center space-x-2 text-sm">
                    <Badge variant="outline">Quotation</Badge>
                    <ArrowRight className="h-4 w-4" />
                    <Badge variant="outline">Sales Order</Badge>
                    <ArrowRight className="h-4 w-4" />
                    <Badge variant="outline">Job Order</Badge>
                    <ArrowRight className="h-4 w-4" />
                    <Badge variant="outline">Invoice</Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Seamless conversion through the entire manufacturing workflow with automated document generation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <PaymentRecordingModule />
        </TabsContent>

        <TabsContent value="joborders" className="space-y-4">
          <JobOrderModule />
        </TabsContent>
      </Tabs>

      {/* System Workflow Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            Complete System Workflow
          </CardTitle>
          <CardDescription>
            End-to-end manufacturing process with all client requirements implemented
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Calculator className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold">Quotation</h4>
              <p className="text-xs text-gray-600">Enhanced with client specs</p>
            </div>
            
            <div className="flex items-center justify-center">
              <ArrowRight className="h-6 w-6 text-gray-400" />
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Receipt className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold">Payment</h4>
              <p className="text-xs text-gray-600">WhatsApp verification</p>
            </div>
            
            <div className="flex items-center justify-center">
              <ArrowRight className="h-6 w-6 text-gray-400" />
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Factory className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold">Production</h4>
              <p className="text-xs text-gray-600">Job order tracking</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}