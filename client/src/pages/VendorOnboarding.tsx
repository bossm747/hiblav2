import React, { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { StatusBadge } from '@/components/ui/status-badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  User,
  Upload,
  Shield,
  Check,
  AlertCircle,
  FileText,
  Camera,
  Download,
  Eye,
  Trash2,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';

// Validation schemas
const accountSetupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  vendorType: z.enum(['supplier', 'rider', 'both']),
  companyName: z.string().optional(),
  address: z.string().min(5, 'Address is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const documentUploadSchema = z.object({
  idDocument: z.instanceof(File).optional(),
  businessLicense: z.instanceof(File).optional(),
  taxDocument: z.instanceof(File).optional(),
  additionalDocument: z.instanceof(File).optional(),
});

type AccountSetupData = z.infer<typeof accountSetupSchema>;
type DocumentUploadData = z.infer<typeof documentUploadSchema>;

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  uploadProgress?: number;
}

export function VendorOnboarding() {
  const [currentStep, setCurrentStep] = useState('account');
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, UploadedFile>>({});
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | 'rejected'>('pending');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Account setup form
  const accountForm = useForm<AccountSetupData>({
    resolver: zodResolver(accountSetupSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      vendorType: 'supplier',
      companyName: '',
      address: '',
    },
  });

  // Account setup mutation
  const accountMutation = useMutation({
    mutationFn: async (data: AccountSetupData) => {
      return apiRequest('/api/vendors/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: 'Account Created',
        description: 'Your account has been created successfully.',
      });
      setCurrentStep('documents');
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create account',
        variant: 'destructive',
      });
    },
  });

  // File upload handler
  const handleFileUpload = async (file: File, documentType: string) => {
    const uploadId = `${documentType}-${Date.now()}`;
    
    // Create upload entry
    setUploadedFiles(prev => ({
      ...prev,
      [documentType]: {
        id: uploadId,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadProgress: 0,
      },
    }));

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadedFiles(prev => {
        const current = prev[documentType];
        if (!current || current.uploadProgress === undefined) return prev;
        
        const newProgress = Math.min(current.uploadProgress + 10, 100);
        
        if (newProgress === 100) {
          clearInterval(progressInterval);
        }
        
        return {
          ...prev,
          [documentType]: {
            ...current,
            uploadProgress: newProgress,
          },
        };
      });
    }, 200);

    // Actual upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);

    try {
      const response = await apiRequest('/api/vendors/upload-document', {
        method: 'POST',
        body: formData,
      });

      setUploadedFiles(prev => ({
        ...prev,
        [documentType]: {
          ...prev[documentType],
          url: response.url,
          uploadProgress: 100,
        },
      }));

      toast({
        title: 'Document Uploaded',
        description: `${file.name} has been uploaded successfully.`,
      });
    } catch (error) {
      clearInterval(progressInterval);
      setUploadedFiles(prev => {
        const { [documentType]: removed, ...rest } = prev;
        return rest;
      });
      
      toast({
        title: 'Upload Failed',
        description: `Failed to upload ${file.name}`,
        variant: 'destructive',
      });
    }
  };

  // Submit documents mutation
  const documentsMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('/api/vendors/submit-documents', {
        method: 'POST',
        body: JSON.stringify({
          documents: Object.entries(uploadedFiles).map(([type, file]) => ({
            type,
            fileId: file.id,
            fileName: file.name,
            url: file.url,
          })),
        }),
      });
    },
    onSuccess: () => {
      toast({
        title: 'Documents Submitted',
        description: 'Your documents have been submitted for verification.',
      });
      setCurrentStep('verification');
      // Simulate verification process
      setTimeout(() => {
        setVerificationStatus('verified');
      }, 5000);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit documents',
        variant: 'destructive',
      });
    },
  });

  const getStepProgress = () => {
    switch (currentStep) {
      case 'account':
        return 33;
      case 'documents':
        return 66;
      case 'verification':
        return 100;
      default:
        return 0;
    }
  };

  const getVerificationIcon = () => {
    switch (verificationStatus) {
      case 'verified':
        return <CheckCircle className="h-16 w-16 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-16 w-16 text-red-600" />;
      default:
        return <Clock className="h-16 w-16 text-yellow-600 animate-pulse" />;
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Vendor & Rider Onboarding</h1>
        <p className="text-muted-foreground mt-2">
          Complete your registration to start working with Hibla Manufacturing
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-medium">Registration Progress</span>
          <span className="text-muted-foreground">{getStepProgress()}% Complete</span>
        </div>
        <Progress value={getStepProgress()} className="h-2" />
      </div>

      {/* Stepper Tabs */}
      <Tabs value={currentStep} onValueChange={setCurrentStep}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="account" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Account Setup
          </TabsTrigger>
          <TabsTrigger 
            value="documents" 
            disabled={!accountForm.formState.isSubmitSuccessful}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Document Upload
          </TabsTrigger>
          <TabsTrigger 
            value="verification" 
            disabled={currentStep !== 'verification'}
            className="flex items-center gap-2"
          >
            <Shield className="h-4 w-4" />
            Verification
          </TabsTrigger>
        </TabsList>

        {/* Account Setup Tab */}
        <TabsContent value="account" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Provide your basic information to create your vendor account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...accountForm}>
                <form onSubmit={accountForm.handleSubmit((data) => accountMutation.mutate(data))} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={accountForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={accountForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={accountForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+1234567890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={accountForm.control}
                      name="vendorType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vendor Type</FormLabel>
                          <FormControl>
                            <select 
                              className="w-full h-10 px-3 border rounded-md"
                              {...field}
                            >
                              <option value="supplier">Supplier</option>
                              <option value="rider">Rider</option>
                              <option value="both">Both</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={accountForm.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Acme Corp" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={accountForm.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main St, City, Country" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={accountForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormDescription>
                            At least 8 characters
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={accountForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={accountMutation.isPending}
                      className="min-w-[150px]"
                    >
                      {accountMutation.isPending ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          Continue
                          <Check className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Document Upload Tab */}
        <TabsContent value="documents" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Document Upload</CardTitle>
              <CardDescription>
                Upload required documents for verification. Supported formats: PDF, JPG, PNG (Max 10MB)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Document upload areas */}
              {[
                { key: 'idDocument', label: 'Government ID', icon: FileText, required: true },
                { key: 'businessLicense', label: 'Business License', icon: Shield, required: false },
                { key: 'taxDocument', label: 'Tax Registration', icon: FileText, required: false },
                { key: 'additionalDocument', label: 'Additional Document', icon: Camera, required: false },
              ].map((doc) => {
                const uploadedFile = uploadedFiles[doc.key];
                const Icon = doc.icon;
                
                return (
                  <div key={doc.key} className="border-2 border-dashed rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">{doc.label}</span>
                        {doc.required && <span className="text-red-500">*</span>}
                      </div>
                      {uploadedFile && (
                        <StatusBadge 
                          status={uploadedFile.uploadProgress === 100 ? 'success' : 'processing'} 
                          showIcon={true}
                        />
                      )}
                    </div>
                    
                    {uploadedFile ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-muted rounded">
                          <span className="text-sm truncate">{uploadedFile.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setUploadedFiles(prev => {
                                  const { [doc.key]: removed, ...rest } = prev;
                                  return rest;
                                });
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        {uploadedFile.uploadProgress !== undefined && uploadedFile.uploadProgress < 100 && (
                          <Progress value={uploadedFile.uploadProgress} className="h-2" />
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          id={`file-${doc.key}`}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.size > 10 * 1024 * 1024) {
                                toast({
                                  title: 'File too large',
                                  description: 'File size must be less than 10MB',
                                  variant: 'destructive',
                                });
                                return;
                              }
                              handleFileUpload(file, doc.key);
                            }
                          }}
                        />
                        <label
                          htmlFor={`file-${doc.key}`}
                          className="cursor-pointer text-sm text-primary hover:underline"
                        >
                          Click to upload or drag and drop
                        </label>
                        <p className="text-xs text-muted-foreground mt-1">
                          PDF, JPG or PNG (max 10MB)
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
              
              {/* Submit button */}
              <div className="flex justify-between items-center pt-4">
                <p className="text-sm text-muted-foreground">
                  * Required documents must be uploaded
                </p>
                <Button
                  onClick={() => documentsMutation.mutate()}
                  disabled={!uploadedFiles.idDocument || documentsMutation.isPending}
                  className="min-w-[150px]"
                >
                  {documentsMutation.isPending ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Documents
                      <Check className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Verification Status Tab */}
        <TabsContent value="verification" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Verification Status</CardTitle>
              <CardDescription>
                Your documents are being reviewed by our team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                {getVerificationIcon()}
                
                <h3 className="text-xl font-semibold mt-4">
                  {verificationStatus === 'verified' && 'Verification Complete!'}
                  {verificationStatus === 'rejected' && 'Verification Failed'}
                  {verificationStatus === 'pending' && 'Verification In Progress'}
                </h3>
                
                <p className="text-muted-foreground mt-2">
                  {verificationStatus === 'verified' && 'Your account has been verified successfully. You can now start accepting orders.'}
                  {verificationStatus === 'rejected' && 'Your documents could not be verified. Please check your email for more information.'}
                  {verificationStatus === 'pending' && 'Our team is reviewing your documents. This usually takes 1-2 business days.'}
                </p>
                
                {verificationStatus === 'pending' && (
                  <div className="mt-8">
                    <Skeleton className="h-4 w-[250px] mx-auto mb-2" />
                    <Skeleton className="h-4 w-[200px] mx-auto" />
                  </div>
                )}
                
                {verificationStatus === 'verified' && (
                  <div className="mt-8 space-y-3">
                    <Button className="w-full max-w-xs">
                      Go to Dashboard
                    </Button>
                    <Button variant="outline" className="w-full max-w-xs">
                      <Download className="h-4 w-4 mr-2" />
                      Download Certificate
                    </Button>
                  </div>
                )}
                
                {verificationStatus === 'rejected' && (
                  <div className="mt-8">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setCurrentStep('documents');
                        setUploadedFiles({});
                        setVerificationStatus('pending');
                      }}
                      className="w-full max-w-xs"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Re-upload Documents
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Status Timeline */}
              <div className="mt-8 border-t pt-8">
                <h4 className="font-medium mb-4">Verification Timeline</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Account Created</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date().toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Documents Submitted</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date().toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {verificationStatus === 'verified' ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : verificationStatus === 'rejected' ? (
                        <XCircle className="h-5 w-5 text-red-600" />
                      ) : (
                        <Clock className="h-5 w-5 text-yellow-600 animate-pulse" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">Verification Status</p>
                      <p className="text-sm text-muted-foreground">
                        {verificationStatus === 'pending' ? 'In Review' : 
                         verificationStatus === 'verified' ? 'Approved' : 'Rejected'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}