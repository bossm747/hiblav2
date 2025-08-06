import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Download, Filter, Package, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";
import { Navbar } from "@/components/navbar";

export default function SummaryReportsPage() {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [customerFilter, setCustomerFilter] = useState<string>("all");
  const [itemFilter, setItemFilter] = useState("");
  const [activeTab, setActiveTab] = useState("ready");

  // Fetch summary data with filters
  const { data: summaryData, isLoading } = useQuery({
    queryKey: ["/api/reports/job-order-summary", { 
      dateFrom, 
      dateTo, 
      customer: customerFilter, 
      item: itemFilter 
    }],
    queryFn: ({ queryKey }) => {
      const [_, filters] = queryKey as [string, any];
      let url = "/api/reports/job-order-summary";
      const params = new URLSearchParams();
      
      if (filters.dateFrom) params.append("dateFrom", filters.dateFrom);
      if (filters.dateTo) params.append("dateTo", filters.dateTo);
      if (filters.customer && filters.customer !== "all") params.append("customer", filters.customer);
      if (filters.item) params.append("item", filters.item);
      
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

  const formatQuantity = (amount: string | number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(Number(amount));
  };

  const exportData = (type: string) => {
    const data = summaryData?.[type] || [];
    const csvContent = [
      // CSV Headers
      ['Job Order #', 'Customer Code', 'Product Name', 'Specification', 'Total Quantity', 'Quantity', 'Due Date', 'Date Created'].join(','),
      // CSV Data
      ...data.map((item: any) => [
        item.jobOrderNumber,
        item.customerCode,
        `"${item.productName}"`,
        `"${item.specification || ''}"`,
        item.totalQuantity,
        item.quantity,
        new Date(item.dueDate).toLocaleDateString(),
        new Date(item.dateCreated).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${type}-items-summary-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">Loading summary reports...</div>
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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Summary Reports</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Production summary reports with filtering by date, customer, and items
              </p>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ready Items</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summaryData?.ready?.length || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {formatQuantity(summaryData?.ready?.reduce((sum: number, item: any) => sum + Number(item.quantity), 0) || 0)} total qty
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">To Produce</CardTitle>
                <Clock className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summaryData?.toProduce?.length || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {formatQuantity(summaryData?.toProduce?.reduce((sum: number, item: any) => sum + Number(item.quantity), 0) || 0)} total qty
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reserved</CardTitle>
                <Package className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summaryData?.reserved?.length || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {formatQuantity(summaryData?.reserved?.reduce((sum: number, item: any) => sum + Number(item.quantity), 0) || 0)} total qty
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Shipped</CardTitle>
                <AlertCircle className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summaryData?.shipped?.length || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {formatQuantity(summaryData?.shipped?.reduce((sum: number, item: any) => sum + Number(item.quantity), 0) || 0)} total qty
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Date From</label>
                  <Input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Date To</label>
                  <Input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Customer</label>
                  <Select value={customerFilter} onValueChange={setCustomerFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Customers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Customers</SelectItem>
                      {customers?.map((customer: any) => (
                        <SelectItem key={customer.id} value={customer.code || customer.id}>
                          {customer.name} ({customer.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Order Item</label>
                  <Input
                    placeholder="Search items..."
                    value={itemFilter}
                    onChange={(e) => setItemFilter(e.target.value)}
                  />
                </div>

                <div className="flex items-end">
                  <Button variant="outline" className="w-full">
                    <Filter className="w-4 h-4 mr-2" />
                    Apply Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary Reports Tabs */}
          <Card>
            <CardHeader>
              <CardTitle>Job Order Summary Reports</CardTitle>
              <CardDescription>
                Detailed breakdown of production status by items from job orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex justify-between items-center mb-4">
                  <TabsList>
                    <TabsTrigger value="ready">Ready Items</TabsTrigger>
                    <TabsTrigger value="toProduce">To Produce</TabsTrigger>
                    <TabsTrigger value="reserved">Reserved</TabsTrigger>
                    <TabsTrigger value="shipped">Shipped</TabsTrigger>
                  </TabsList>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => exportData(activeTab)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                </div>

                {['ready', 'toProduce', 'reserved', 'shipped'].map((tabName) => (
                  <TabsContent key={tabName} value={tabName}>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Job Order #</TableHead>
                          <TableHead>Customer Code</TableHead>
                          <TableHead>Product Name</TableHead>
                          <TableHead>Specification</TableHead>
                          <TableHead>Total Qty</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Date Created</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {summaryData?.[tabName]?.map((item: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{item.jobOrderNumber}</TableCell>
                            <TableCell>{item.customerCode}</TableCell>
                            <TableCell>{item.productName}</TableCell>
                            <TableCell className="text-sm text-gray-600">
                              {item.specification || '-'}
                            </TableCell>
                            <TableCell>{formatQuantity(item.totalQuantity)}</TableCell>
                            <TableCell className="font-medium">
                              {formatQuantity(item.quantity)}
                            </TableCell>
                            <TableCell>
                              {new Date(item.dueDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {new Date(item.dateCreated).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                        {(!summaryData?.[tabName] || summaryData[tabName].length === 0) && (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                              No {tabName === 'toProduce' ? 'items to produce' : tabName} items found with current filters
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}