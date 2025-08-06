import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, FileText, Eye, Edit3, CheckCircle, Search, Download, Calendar, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiRequest } from "@/lib/queryClient";
import { Navbar } from "@/components/navbar";

export default function SalesOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [customerFilter, setCustomerFilter] = useState<string>("all");
  const queryClient = useQueryClient();

  // Fetch sales orders with filters
  const { data: salesOrders, isLoading } = useQuery({
    queryKey: ["/api/sales-orders", { search: searchTerm, status: statusFilter, customer: customerFilter }],
    queryFn: ({ queryKey }) => {
      const [_, filters] = queryKey as [string, any];
      let url = "/api/sales-orders";
      const params = new URLSearchParams();
      
      if (filters.status && filters.status !== "all") {
        params.append("status", filters.status);
      }
      if (filters.customer && filters.customer !== "all") {
        params.append("customer", filters.customer);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      return apiRequest(url);
    },
  });

  // Fetch customers for filter dropdown
  const { data: customers } = useQuery({
    queryKey: ["/api/customers"],
  });

  // Confirm sales order mutation
  const confirmSalesOrderMutation = useMutation({
    mutationFn: (salesOrderId: string) => apiRequest(`/api/sales-orders/${salesOrderId}/confirm`, {
      method: "POST",
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sales-orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/job-orders"] });
    },
  });

  // Filter sales orders
  const filteredSalesOrders = salesOrders?.filter((order: any) => {
    const matchesSearch = searchTerm === "" || 
      order.salesOrderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerCode.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  }) || [];

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">Loading sales orders...</div>
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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sales Orders</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage customer sales orders with automatic job order generation
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
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{salesOrders?.length || 0}</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Draft Orders</CardTitle>
                <Edit3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {salesOrders?.filter((so: any) => !so.isConfirmed).length || 0}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Confirmed Orders</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {salesOrders?.filter((so: any) => so.isConfirmed).length || 0}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${salesOrders?.reduce((sum: number, so: any) => sum + parseFloat(so.total || "0"), 0).toLocaleString() || "0"}
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
                    placeholder="Search sales orders..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>

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
              </div>
            </CardContent>
          </Card>

          {/* Sales Orders Table */}
          <Card>
            <CardHeader>
              <CardTitle>Sales Orders ({filteredSalesOrders.length})</CardTitle>
              <CardDescription>
                Track and manage customer sales orders with YYYY.MM.### numbering system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSalesOrders.map((order: any) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        {order.salesOrderNumber}
                        <div className="text-xs text-gray-500">{order.revisionNumber}</div>
                      </TableCell>
                      <TableCell>{order.customerCode}</TableCell>
                      <TableCell>{order.country}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            order.isConfirmed ? "default" : 
                            order.status === "shipped" ? "default" :
                            order.status === "completed" ? "default" : 
                            "outline"
                          }
                          className="capitalize"
                        >
                          {order.isConfirmed ? "Confirmed" : order.status || "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(order.dueDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-medium">
                        ${parseFloat(order.total || "0").toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-3 h-3" />
                          </Button>
                          {!order.isConfirmed && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => confirmSalesOrderMutation.mutate(order.id)}
                              disabled={confirmSalesOrderMutation.isPending}
                            >
                              <CheckCircle className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}