import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Settings, Bell, TestTube, Check, X, Loader2, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface EmailSettingsForm {
  enabled: boolean;
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  smtpUsername: string;
  smtpPassword: string;
  fromEmail: string;
  fromName: string;
  replyToEmail: string;
  sendPaymentNotifications: boolean;
  sendInvoiceNotifications: boolean;
  sendQuotationNotifications: boolean;
  sendOrderNotifications: boolean;
  sendShipmentNotifications: boolean;
  ccEmails: string;
  bccEmails: string;
}

export default function EmailSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [testEmail, setTestEmail] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'testing'>('disconnected');

  const form = useForm<EmailSettingsForm>({
    defaultValues: {
      enabled: false,
      smtpHost: 'smtp.hostinger.com',
      smtpPort: 465,
      smtpSecure: true,
      smtpUsername: '',
      smtpPassword: '',
      fromEmail: '',
      fromName: 'Hibla Filipino Hair',
      replyToEmail: '',
      sendPaymentNotifications: true,
      sendInvoiceNotifications: true,
      sendQuotationNotifications: true,
      sendOrderNotifications: true,
      sendShipmentNotifications: true,
      ccEmails: '',
      bccEmails: '',
    },
  });

  // Fetch current email settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ['/api/email-settings'],
  });

  // Handle settings update when data is fetched
  useEffect(() => {
    if (settings) {
      form.reset(settings);
      setConnectionStatus(settings.enabled ? 'connected' : 'disconnected');
    }
  }, [settings, form]);

  // Save email settings mutation
  const saveMutation = useMutation({
    mutationFn: async (data: EmailSettingsForm) => {
      return await apiRequest('/api/email-settings', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Email settings saved successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/email-settings'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save email settings',
        variant: 'destructive',
      });
    },
  });

  // Test email connection
  const testConnectionMutation = useMutation({
    mutationFn: async () => {
      setConnectionStatus('testing');
      return await apiRequest('/api/email-settings/test-connection', {
        method: 'POST',
        body: JSON.stringify(form.getValues()),
      });
    },
    onSuccess: (data) => {
      setConnectionStatus(data.success ? 'connected' : 'disconnected');
      toast({
        title: data.success ? 'Connection Successful' : 'Connection Failed',
        description: data.message,
        variant: data.success ? 'default' : 'destructive',
      });
    },
    onError: (error: Error) => {
      setConnectionStatus('disconnected');
      toast({
        title: 'Test Failed',
        description: error.message || 'Failed to test connection',
        variant: 'destructive',
      });
    },
  });

  // Send test email
  const sendTestEmailMutation = useMutation({
    mutationFn: async () => {
      if (!testEmail) {
        throw new Error('Please enter an email address');
      }
      return await apiRequest('/api/email-settings/test-email', {
        method: 'POST',
        body: JSON.stringify({
          recipient: testEmail,
          settings: form.getValues(),
        }),
      });
    },
    onSuccess: (data) => {
      toast({
        title: 'Test Email Sent',
        description: `Test email sent successfully to ${testEmail}`,
      });
      setTestEmail('');
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to Send',
        description: error.message || 'Failed to send test email',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: EmailSettingsForm) => {
    saveMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Email Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Configure email notifications and SMTP settings
          </p>
        </div>
        <Badge 
          variant={connectionStatus === 'connected' ? 'default' : connectionStatus === 'testing' ? 'secondary' : 'destructive'}
          className="flex items-center gap-2 px-3 py-1"
        >
          {connectionStatus === 'connected' && <Check className="h-4 w-4" />}
          {connectionStatus === 'testing' && <Loader2 className="h-4 w-4 animate-spin" />}
          {connectionStatus === 'disconnected' && <X className="h-4 w-4" />}
          {connectionStatus === 'connected' ? 'Connected' : connectionStatus === 'testing' ? 'Testing...' : 'Disconnected'}
        </Badge>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="smtp" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="smtp" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                SMTP Configuration
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="test" className="flex items-center gap-2">
                <TestTube className="h-4 w-4" />
                Test Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="smtp" className="space-y-6">
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle>SMTP Server Configuration</CardTitle>
                  <CardDescription>
                    Configure your Hostinger email server settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="enabled"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Enable Email Notifications</FormLabel>
                          <FormDescription>
                            Turn on email notifications for your system
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      For Hostinger email, use <strong>smtp.hostinger.com</strong> with port <strong>465</strong> (SSL/TLS).
                      Your username is your full email address.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="smtpHost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMTP Host</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="smtp.hostinger.com" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="smtpPort"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMTP Port</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="number" 
                              placeholder="465"
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="smtpUsername"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMTP Username</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="your-email@yourdomain.com" />
                          </FormControl>
                          <FormDescription>
                            Your full Hostinger email address
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="smtpPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMTP Password</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" placeholder="••••••••" />
                          </FormControl>
                          <FormDescription>
                            Your Hostinger email password
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fromEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>From Email</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="noreply@yourdomain.com" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fromName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>From Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Hibla Filipino Hair" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="replyToEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reply-To Email</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="support@yourdomain.com" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="smtpSecure"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Use SSL/TLS</FormLabel>
                          <FormDescription>
                            Enable secure connection (required for port 465)
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Choose which types of notifications to send
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="sendPaymentNotifications"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Payment Notifications</FormLabel>
                          <FormDescription>
                            Send emails when payments are received or refunded
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sendInvoiceNotifications"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Invoice Notifications</FormLabel>
                          <FormDescription>
                            Send emails when invoices are created or updated
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sendQuotationNotifications"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Quotation Notifications</FormLabel>
                          <FormDescription>
                            Send emails when quotations are created or approved
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sendOrderNotifications"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Order Notifications</FormLabel>
                          <FormDescription>
                            Send emails for order confirmations and updates
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sendShipmentNotifications"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Shipment Notifications</FormLabel>
                          <FormDescription>
                            Send emails when orders are shipped or delivered
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Additional Recipients</h3>
                    
                    <FormField
                      control={form.control}
                      name="ccEmails"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CC Emails</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="email1@example.com, email2@example.com"
                              rows={2}
                            />
                          </FormControl>
                          <FormDescription>
                            Comma-separated list of emails to CC on all notifications
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bccEmails"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>BCC Emails</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="admin@example.com, manager@example.com"
                              rows={2}
                            />
                          </FormControl>
                          <FormDescription>
                            Comma-separated list of emails to BCC on all notifications
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="test" className="space-y-6">
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle>Test Email Configuration</CardTitle>
                  <CardDescription>
                    Test your email settings before saving
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Test Connection</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Verify that your SMTP settings are correct and the server is reachable
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => testConnectionMutation.mutate()}
                        disabled={testConnectionMutation.isPending}
                      >
                        {testConnectionMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Testing Connection...
                          </>
                        ) : (
                          <>
                            <Settings className="mr-2 h-4 w-4" />
                            Test Connection
                          </>
                        )}
                      </Button>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Send Test Email</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Send a test email to verify everything is working correctly
                      </p>
                      <div className="flex gap-2">
                        <Input
                          placeholder="recipient@example.com"
                          value={testEmail}
                          onChange={(e) => setTestEmail(e.target.value)}
                          className="max-w-sm"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => sendTestEmailMutation.mutate()}
                          disabled={sendTestEmailMutation.isPending || !testEmail}
                        >
                          {sendTestEmailMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Mail className="mr-2 h-4 w-4" />
                              Send Test Email
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saveMutation.isPending}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {saveMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Settings'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}