import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, QrCode, Smartphone, CreditCard, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/navbar";

const paymentMethodSchema = z.object({
  type: z.enum(["gcash", "cod"]),
  displayName: z.string().min(1, "Display name is required"),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  config: z.object({
    gcashNumber: z.string().optional(),
    gcashName: z.string().optional(),
    qrCodeUrl: z.string().optional(),
    instructions: z.array(z.string()).optional(),
  }).optional(),
});

type PaymentMethodForm = z.infer<typeof paymentMethodSchema>;

export default function AdminPaymentMethods() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: paymentMethods = [], isLoading } = useQuery({
    queryKey: ["/api/admin/payment-methods"],
  });

  const form = useForm<PaymentMethodForm>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: "gcash",
      displayName: "",
      description: "",
      isActive: true,
      config: {
        gcashNumber: "",
        gcashName: "",
        qrCodeUrl: "",
        instructions: [],
      },
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: PaymentMethodForm) => {
      const response = await apiRequest("POST", "/api/admin/payment-methods", data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/payment-methods"] });
      setIsDialogOpen(false);
      form.reset();
      setEditingMethod(null);
      toast({
        title: "Success",
        description: "Payment method saved successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save payment method",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: PaymentMethodForm & { id: string }) => {
      const response = await apiRequest("PUT", `/api/admin/payment-methods/${data.id}`, data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/payment-methods"] });
      setIsDialogOpen(false);
      form.reset();
      setEditingMethod(null);
      toast({
        title: "Success",
        description: "Payment method updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update payment method",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/admin/payment-methods/${id}`, {});
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/payment-methods"] });
      toast({
        title: "Success",
        description: "Payment method deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete payment method",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: PaymentMethodForm) => {
    if (editingMethod) {
      updateMutation.mutate({ ...data, id: editingMethod.id });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (method: any) => {
    setEditingMethod(method);
    form.reset({
      type: method.type,
      displayName: method.displayName,
      description: method.description || "",
      isActive: method.isActive,
      config: method.config || {},
    });
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingMethod(null);
    form.reset();
    setIsDialogOpen(true);
  };

  const getMethodIcon = (type: string) => {
    switch (type) {
      case "gcash":
        return <Smartphone className="h-5 w-5 text-blue-500" />;
      case "cod":
        return <CreditCard className="h-5 w-5 text-orange-500" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Payment Methods</h1>
            <p className="text-muted-foreground">Configure payment options for customers</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddNew}>
                <Plus className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingMethod ? "Edit Payment Method" : "Add Payment Method"}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="glass">
                              <SelectValue placeholder="Select payment type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="gcash">GCash</SelectItem>
                            <SelectItem value="cod">Cash on Delivery</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="displayName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Name</FormLabel>
                        <FormControl>
                          <Input {...field} className="glass" placeholder="e.g., GCash P2P Transfer" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} className="glass" placeholder="Payment method description" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch("type") === "gcash" && (
                    <>
                      <FormField
                        control={form.control}
                        name="config.gcashNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>GCash Number</FormLabel>
                            <FormControl>
                              <Input {...field} className="glass" placeholder="e.g., 09178-442521" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="config.gcashName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Account Name</FormLabel>
                            <FormControl>
                              <Input {...field} className="glass" placeholder="e.g., Maria Santos" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="config.qrCodeUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>QR Code Image URL</FormLabel>
                            <FormControl>
                              <Input {...field} className="glass" placeholder="Upload QR code image and paste URL" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-white/20 p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Active</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Enable this payment method for customers
                          </div>
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

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      disabled={createMutation.isPending || updateMutation.isPending}
                      className="flex-1"
                    >
                      {editingMethod ? "Update Method" : "Create Method"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paymentMethods.map((method: any) => (
            <Card key={method.id} className="glass-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getMethodIcon(method.type)}
                    <div>
                      <CardTitle className="text-lg text-foreground">{method.displayName}</CardTitle>
                      <p className="text-sm text-muted-foreground capitalize">{method.type}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs ${
                    method.isActive 
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
                  }`}>
                    {method.isActive ? "Active" : "Inactive"}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {method.description && (
                  <p className="text-sm text-muted-foreground">{method.description}</p>
                )}
                
                {method.type === "gcash" && method.config && (
                  <div className="space-y-2">
                    {method.config.gcashNumber && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Number:</span>
                        <span className="text-sm font-medium">{method.config.gcashNumber}</span>
                      </div>
                    )}
                    {method.config.gcashName && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Name:</span>
                        <span className="text-sm font-medium">{method.config.gcashName}</span>
                      </div>
                    )}
                    {method.config.qrCodeUrl && (
                      <div className="flex items-center gap-2">
                        <QrCode className="h-4 w-4 text-blue-500" />
                        <span className="text-sm text-muted-foreground">QR Code Available</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(method)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteMutation.mutate(method.id)}
                    className="text-red-600 hover:text-red-700"
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {paymentMethods.length === 0 && (
          <Card className="glass-card text-center py-12">
            <CardContent>
              <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Payment Methods</h3>
              <p className="text-muted-foreground mb-4">
                Add payment methods to allow customers to pay for their orders
              </p>
              <Button onClick={handleAddNew}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Payment Method
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}