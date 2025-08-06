import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Package, Eye, Edit3, Search, Download, Calendar, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import { Navbar } from "@/components/navbar";

export default function JobOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [customerFilter, setCustomerFilter] = useState<string>("all");
  const [selectedJobOrder, setSelectedJobOrder] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Fetch job orders with filters
  const { data: jobOrders, isLoading } = useQuery({
    queryKey: ["/api/job-orders", { search: searchTerm, customer: customerFilter }],
    queryFn: ({ queryKey }) => {
      const [_, filters] = queryKey as [string, any];
      let url = "/api/job-orders";
      const params = new URLSearchParams();
      
      if (filters.customer && filters.customer !== "all") {
        params.append("customer", filters.customer);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      return apiRequest(url);
    },
  });

  // Fetch job order details including items
  const { data: selectedJobOrderDetails } = useQuery({
    queryKey: ["/api/job-orders", selectedJobOrder],
    queryFn: () => selectedJobOrder ? apiRequest(`/api/job-orders/${selectedJobOrder}`) : null,
    enabled: !!selectedJobOrder,
  });

  // Fetch customers for filter dropdown
  const { data: customers } = useQuery({
    queryKey: ["/api/customers"],
  });

  // Update shipment mutation
  const updateShipmentMutation = useMutation({
    mutationFn: ({ itemId, shipmentNumber, quantity }: { itemId: string; shipmentNumber: number; quantity: string }) => 
      apiRequest(`/api/job-orders/${selectedJobOrder}/items/${itemId}/shipment`, {
        method: "PUT",
        body: JSON.stringify({ shipmentNumber, quantity }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/job-orders", selectedJobOrder] });
    },
  });

  // Filter job orders
  const filteredJobOrders = jobOrders?.filter((order: any) => {
    const matchesSearch = searchTerm === "" || 
      order.jobOrderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerCode.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  }) || [];

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">Loading job orders...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Job Orders</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Track production orders and shipment progress
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Job Orders</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{jobOrders?.length || 0}</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {jobOrders?.filter((jo: any) => new Date(jo.dueDate) > new Date()).length || 0}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {jobOrders?.filter((jo: any) => new Date(jo.dueDate) < new Date()).length || 0}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {jobOrders?.filter((jo: any) => {
                    const created = new Date(jo.dateCreated);
                    const now = new Date();
                    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
                  }).length || 0}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search job orders..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Select value={customerFilter} onValueChange={setCustomerFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Customers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Customers</SelectItem>
                    {customers?.map((customer: any) => (
                      <SelectItem key={customer.id} value={customer.code || customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button variant="outline" className="w-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  Date Range
                </Button>

                <Button variant="outline" className="w-full">
                  <Filter className="w-4 h-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Job Orders Table */}
          <Card>
            <CardHeader>
              <CardTitle>Job Orders ({filteredJobOrders.length})</CardTitle>
              <CardDescription>
                Production orders with shipment tracking (8 shipment columns)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Order #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJobOrders.map((order: any) => {
                    const isOverdue = new Date(order.dueDate) < new Date();
                    
                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          {order.jobOrderNumber}
                          <div className="text-xs text-gray-500">{order.revisionNumber}</div>
                        </TableCell>
                        <TableCell>{order.customerCode}</TableCell>
                        <TableCell>
                          <span className={isOverdue ? "text-red-600" : ""}>
                            {new Date(order.dueDate).toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={isOverdue ? "destructive" : "default"}
                            className="capitalize"
                          >
                            {isOverdue ? "Overdue" : "In Progress"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: "65%" }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">65% Complete</span>
                        </TableCell>
                        <TableCell>
                          {new Date(order.dateCreated).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setSelectedJobOrder(order.id)}
                                >
                                  <Eye className="w-3 h-3" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-6xl">
                                <DialogHeader>
                                  <DialogTitle>Job Order Details - {order.jobOrderNumber}</DialogTitle>
                                  <DialogDescription>
                                    Shipment tracking and production progress
                                  </DialogDescription>
                                </DialogHeader>
                                
                                {selectedJobOrderDetails && (
                                  <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <h4 className="font-medium">Customer Information</h4>
                                        <p>Customer Code: {selectedJobOrderDetails.customerCode}</p>
                                        <p>Due Date: {new Date(selectedJobOrderDetails.dueDate).toLocaleDateString()}</p>
                                      </div>
                                      <div>
                                        <h4 className="font-medium">Instructions</h4>
                                        <p>{selectedJobOrderDetails.customerInstructions || "No special instructions"}</p>
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <h4 className="font-medium mb-3">Job Order Items & Shipments</h4>
                                      <Table>
                                        <TableHeader>
                                          <TableRow>
                                            <TableHead>Product</TableHead>
                                            <TableHead>Qty</TableHead>
                                            <TableHead>Ship 1</TableHead>
                                            <TableHead>Ship 2</TableHead>
                                            <TableHead>Ship 3</TableHead>
                                            <TableHead>Ship 4</TableHead>
                                            <TableHead>Ship 5</TableHead>
                                            <TableHead>Ship 6</TableHead>
                                            <TableHead>Ship 7</TableHead>
                                            <TableHead>Ship 8</TableHead>
                                            <TableHead>Shipped</TableHead>
                                            <TableHead>Balance</TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {selectedJobOrderDetails.items?.map((item: any, index: number) => (
                                            <TableRow key={item.id}>
                                              <TableCell>
                                                <div>
                                                  <p className="font-medium">{item.productName}</p>
                                                  {item.specification && (
                                                    <p className="text-xs text-gray-500">{item.specification}</p>
                                                  )}
                                                </div>
                                              </TableCell>
                                              <TableCell>{item.quantity}</TableCell>
                                              {Array.from({ length: 8 }, (_, i) => (
                                                <TableCell key={i}>
                                                  <Input
                                                    type="number"
                                                    placeholder="0"
                                                    className="w-16 h-8 text-xs"
                                                    defaultValue={item[`shipment${i + 1}`] || ""}
                                                    onBlur={(e) => {
                                                      if (e.target.value !== (item[`shipment${i + 1}`] || "")) {
                                                        updateShipmentMutation.mutate({
                                                          itemId: item.id,
                                                          shipmentNumber: i + 1,
                                                          quantity: e.target.value
                                                        });
                                                      }
                                                    }}
                                                  />
                                                </TableCell>
                                              ))}
                                              <TableCell className="font-medium">
                                                {item.shipped || 0}
                                              </TableCell>
                                              <TableCell>
                                                {(parseFloat(item.quantity) - parseFloat(item.shipped || 0)).toFixed(2)}
                                              </TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}