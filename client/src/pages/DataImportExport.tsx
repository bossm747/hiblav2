import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  FileJson,
  Table,
  Users,
  Package,
  Monitor,
  FolderTree,
  Warehouse,
  Receipt
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface ImportResult {
  success: boolean;
  message: string;
  imported?: number;
  failed?: number;
  errors?: string[];
}

const dataTypes = [
  { 
    id: 'customers', 
    name: 'Customers', 
    icon: Users,
    description: 'Customer accounts and contact information',
    fields: ['customerCode', 'name', 'email', 'phone', 'country', 'shippingAddress', 'city', 'province', 'postalCode', 'priceCategory']
  },
  { 
    id: 'products', 
    name: 'Products', 
    icon: Package,
    description: 'Hair products with pricing and inventory',
    fields: ['name', 'sku', 'categoryId', 'hairType', 'texture', 'length', 'color', 'weight', 'unit', 'basePrice', 'ngWarehouse', 'phWarehouse', 'reservedWarehouse']
  },
  { 
    id: 'assets', 
    name: 'Assets', 
    icon: Monitor,
    description: 'Company equipment and assets',
    fields: ['name', 'assetTag', 'assetType', 'categoryId', 'serialNumber', 'manufacturer', 'model', 'purchasePrice', 'currentValue', 'condition', 'ngWarehouse', 'phWarehouse', 'assignedTo']
  },
  { 
    id: 'categories', 
    name: 'Categories', 
    icon: FolderTree,
    description: 'Categories for products and assets',
    fields: ['name', 'slug', 'type', 'description', 'displayOrder', 'isActive']
  },
  { 
    id: 'warehouses', 
    name: 'Warehouses', 
    icon: Warehouse,
    description: 'Warehouse locations',
    fields: ['code', 'name', 'description', 'isActive']
  },
  { 
    id: 'quotations', 
    name: 'Quotations', 
    icon: Receipt,
    description: 'Sales quotations and proposals',
    fields: ['quotationNumber', 'customerId', 'customerCode', 'country', 'subtotal', 'shippingFee', 'bankCharge', 'discount', 'total', 'status']
  }
];

export function DataImportExport() {
  const [selectedType, setSelectedType] = useState('customers');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload a CSV or Excel file',
          variant: 'destructive'
        });
        return;
      }
      setSelectedFile(file);
      setImportResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: 'No file selected',
        description: 'Please select a file to upload',
        variant: 'destructive'
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('type', selectedType);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch('/api/import', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const result = await response.json();
      setImportResult(result);

      if (result.success) {
        toast({
          title: 'Import successful',
          description: `Imported ${result.imported} records successfully`
        });
      } else {
        toast({
          title: 'Import failed',
          description: result.message,
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'An error occurred while uploading the file',
        variant: 'destructive'
      });
      setImportResult({
        success: false,
        message: 'Upload failed',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
      setSelectedFile(null);
    }
  };

  const handleDownloadTemplate = async (type: string, format: 'csv' | 'xlsx') => {
    try {
      const response = await fetch(`/api/export/template/${type}?format=${format}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_template.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Template downloaded',
        description: `${type} template has been downloaded`
      });
    } catch (error) {
      toast({
        title: 'Download failed',
        description: 'Failed to download template',
        variant: 'destructive'
      });
    }
  };

  const handleExportData = async (type: string, format: 'csv' | 'xlsx' | 'json') => {
    try {
      const response = await fetch(`/api/export/${type}?format=${format}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const timestamp = new Date().toISOString().slice(0, 10);
      a.download = `${type}_export_${timestamp}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Export successful',
        description: `${type} data has been exported`
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'Failed to export data',
        variant: 'destructive'
      });
    }
  };

  const selectedDataType = dataTypes.find(dt => dt.id === selectedType);
  const Icon = selectedDataType?.icon || FileSpreadsheet;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Data Import & Export</h1>
        <p className="text-muted-foreground">
          Bulk import data from CSV/Excel files or export existing data
        </p>
      </div>

      <Tabs defaultValue="import" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="import">Import Data</TabsTrigger>
          <TabsTrigger value="export">Export Data</TabsTrigger>
        </TabsList>

        {/* Import Tab */}
        <TabsContent value="import" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Select Data Type to Import</CardTitle>
              <CardDescription>
                Choose the type of data you want to import and upload your file
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Data Type Selection */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {dataTypes.map((type) => {
                  const TypeIcon = type.icon;
                  return (
                    <Card 
                      key={type.id}
                      className={`cursor-pointer transition-all ${
                        selectedType === type.id 
                          ? 'border-primary ring-2 ring-primary' 
                          : 'hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedType(type.id)}
                    >
                      <CardHeader className="p-4">
                        <div className="flex items-center gap-2">
                          <TypeIcon className="h-5 w-5 text-primary" />
                          <CardTitle className="text-sm">{type.name}</CardTitle>
                        </div>
                        <CardDescription className="text-xs mt-1">
                          {type.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>

              {/* Template Download */}
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Download Template First</AlertTitle>
                <AlertDescription className="space-y-2">
                  <p>Download and use the template to ensure your data matches the required format.</p>
                  <div className="flex gap-2 mt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownloadTemplate(selectedType, 'csv')}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      CSV Template
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownloadTemplate(selectedType, 'xlsx')}
                    >
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Excel Template
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>

              {/* Required Fields */}
              {selectedDataType && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      Required Fields for {selectedDataType.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedDataType.fields.map(field => (
                        <Badge key={field} variant="secondary">
                          {field}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* File Upload */}
              <div className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <input
                    type="file"
                    accept=".csv,.xls,.xlsx"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                    disabled={uploading}
                  />
                  <label 
                    htmlFor="file-upload" 
                    className="cursor-pointer"
                  >
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg font-medium">
                      {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      CSV, XLS or XLSX files up to 10MB
                    </p>
                  </label>
                </div>

                {uploadProgress > 0 && uploadProgress < 100 && (
                  <Progress value={uploadProgress} />
                )}

                {selectedFile && (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4" />
                      <span className="text-sm">{selectedFile.name}</span>
                      <Badge variant="secondary">
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </Badge>
                    </div>
                    <Button
                      onClick={handleUpload}
                      disabled={uploading}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {uploading ? 'Uploading...' : 'Start Import'}
                    </Button>
                  </div>
                )}
              </div>

              {/* Import Result */}
              {importResult && (
                <Alert variant={importResult.success ? 'default' : 'destructive'}>
                  {importResult.success ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  <AlertTitle>
                    {importResult.success ? 'Import Successful' : 'Import Failed'}
                  </AlertTitle>
                  <AlertDescription>
                    <p>{importResult.message}</p>
                    {importResult.imported !== undefined && (
                      <p className="mt-2">
                        Successfully imported: {importResult.imported} records
                      </p>
                    )}
                    {importResult.failed !== undefined && importResult.failed > 0 && (
                      <p>Failed: {importResult.failed} records</p>
                    )}
                    {importResult.errors && importResult.errors.length > 0 && (
                      <ul className="mt-2 list-disc list-inside">
                        {importResult.errors.slice(0, 5).map((error, idx) => (
                          <li key={idx} className="text-sm">{error}</li>
                        ))}
                      </ul>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Export Tab */}
        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Export Data</CardTitle>
              <CardDescription>
                Download your data in various formats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dataTypes.map((type) => {
                  const TypeIcon = type.icon;
                  return (
                    <Card key={type.id}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <TypeIcon className="h-5 w-5" />
                          {type.name}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {type.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleExportData(type.id, 'csv')}
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            CSV
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleExportData(type.id, 'xlsx')}
                          >
                            <FileSpreadsheet className="h-4 w-4 mr-1" />
                            Excel
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleExportData(type.id, 'json')}
                          >
                            <FileJson className="h-4 w-4 mr-1" />
                            JSON
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Export Guidelines */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Export Guidelines</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>CSV format is compatible with most spreadsheet applications</li>
                <li>Excel format preserves formatting and multiple sheets</li>
                <li>JSON format is ideal for developers and API integration</li>
                <li>All exports include current data from the database</li>
                <li>Large datasets may take a few moments to process</li>
              </ul>
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
}