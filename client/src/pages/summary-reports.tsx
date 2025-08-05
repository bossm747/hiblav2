import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Download, Filter, FileText, Package, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// DatePicker component removed - using Input instead
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navbar } from "@/components/navbar";

export default function SummaryReportsPage() {
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date()
  });
  const [customerCode, setCustomerCode] = useState("");
  const [orderItem, setOrderItem] = useState("");
  const [reportType, setReportType] = useState("ready-items");

  // Summary data queries
  const { data: summaryData, isLoading } = useQuery({
    queryKey: ["/api/reports/summary", { 
      from: dateRange.from?.toISOString(),
      to: dateRange.to?.toISOString(),
      customerCode,
      orderItem,
      type: reportType
    }],
  });

  const { data: quotationSummary } = useQuery({
    queryKey: ["/api/reports/quotations", { 
      from: dateRange.from?.toISOString(),
      to: dateRange.to?.toISOString(),
      customerCode,
      orderItem
    }],
  });

  const { data: salesOrderSummary } = useQuery({
    queryKey: ["/api/reports/sales-orders", { 
      from: dateRange.from?.toISOString(),
      to: dateRange.to?.toISOString(),
      customerCode,
      orderItem
    }],
  });

  const { data: inventoryValuation } = useQuery({
    queryKey: ["/api/reports/inventory-valuation"],
  });

  const { data: paymentReports } = useQuery({
    queryKey: ["/api/reports/payments", {
      from: dateRange.from?.toISOString(),
      to: dateRange.to?.toISOString(),
      customerCode
    }],
  });

  const handleExport = (format: 'excel' | 'pdf') => {
    const params = new URLSearchParams({
      format,
      from: dateRange.from?.toISOString() || '',
      to: dateRange.to?.toISOString() || '',
      customerCode,
      orderItem,
      type: reportType
    });
    
    window.open(`/api/reports/export?${params}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Summary Reports</h1>
            <p className="text-muted-foreground">
              Comprehensive business reports with filtering and export capabilities
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => handleExport('excel')}>
              <Download className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
            <Button variant="outline" onClick={() => handleExport('pdf')}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Report Filters
            </CardTitle>
            <CardDescription>
              Filter reports by date range, customer, and order items
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Date Range</Label>
                <div className="flex space-x-2">
                  <Input
                    type="date"
                    value={dateRange.from?.toISOString().split('T')[0] || ''}
                    onChange={(e) => setDateRange(prev => ({ ...prev, from: new Date(e.target.value) }))}
                    placeholder="From date"
                  />
                  <Input
                    type="date"
                    value={dateRange.to?.toISOString().split('T')[0] || ''}
                    onChange={(e) => setDateRange(prev => ({ ...prev, to: new Date(e.target.value) }))}
                    placeholder="To date"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerCode">Customer Code</Label>
                <Input
                  id="customerCode"
                  placeholder="e.g., ABA, ABC"
                  value={customerCode}
                  onChange={(e) => setCustomerCode(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="orderItem">Order Item</Label>
                <Input
                  id="orderItem"
                  placeholder="e.g., Machine Weft 8&quot;"
                  value={orderItem}
                  onChange={(e) => setOrderItem(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ready-items">Ready Items Summary</SelectItem>
                    <SelectItem value="production-status">Production Status</SelectItem>
                    <SelectItem value="shipment-tracking">Shipment Tracking</SelectItem>
                    <SelectItem value="inventory-status">Inventory Status</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Tabs */}
        <Tabs defaultValue="job-orders" className="space-y-4">
          <TabsList>
            <TabsTrigger value="job-orders">Job Order Summary</TabsTrigger>
            <TabsTrigger value="quotations">Quotations</TabsTrigger>
            <TabsTrigger value="sales-orders">Sales Orders</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="job-orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Ready Items Summary from Job Orders</CardTitle>
                <CardDescription>
                  Items ready for collection and shipment, filtered by your selected criteria
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : summaryData?.readyItems?.length ? (
                  <div className="space-y-4">
                    {/* Summary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="p-4 border rounded-lg">
                        <h4 className="text-sm font-medium text-muted-foreground">Total Ready Items</h4>
                        <p className="text-2xl font-bold">{summaryData.totalReady}</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="text-sm font-medium text-muted-foreground">Total Value</h4>
                        <p className="text-2xl font-bold">${summaryData.totalValue?.toFixed(2)}</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="text-sm font-medium text-muted-foreground">Customers</h4>
                        <p className="text-2xl font-bold">{summaryData.uniqueCustomers}</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="text-sm font-medium text-muted-foreground">Job Orders</h4>
                        <p className="text-2xl font-bold">{summaryData.totalJobOrders}</p>
                      </div>
                    </div>

                    {/* Detailed List */}
                    <div className="space-y-3">
                      {summaryData.readyItems.map((item: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium">{item.productName}</h4>
                            <p className="text-sm text-muted-foreground">
                              Job Order: {item.jobOrderNumber} • Customer: {item.customerCode}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Due Date: {new Date(item.dueDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">Ready: {item.readyQuantity}</p>
                            <p className="text-sm text-muted-foreground">
                              Total Ordered: {item.totalQuantity}
                            </p>
                            <Badge 
                              variant={item.readyQuantity >= item.totalQuantity ? "success" : "default"}
                            >
                              {((item.readyQuantity / item.totalQuantity) * 100).toFixed(0)}% Complete
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No ready items found</h3>
                    <p className="text-muted-foreground">
                      No items match your current filter criteria
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quotations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Quotations Summary</CardTitle>
                <CardDescription>
                  Summary of quotations filtered by date, customer, and order items
                </CardDescription>
              </CardHeader>
              <CardContent>
                {quotationSummary?.length ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="p-4 border rounded-lg">
                        <h4 className="text-sm font-medium text-muted-foreground">Total Quotations</h4>
                        <p className="text-2xl font-bold">{quotationSummary.length}</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="text-sm font-medium text-muted-foreground">Total Value</h4>
                        <p className="text-2xl font-bold">
                          ${quotationSummary.reduce((sum: number, q: any) => sum + parseFloat(q.total), 0).toFixed(2)}
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="text-sm font-medium text-muted-foreground">Acceptance Rate</h4>
                        <p className="text-2xl font-bold">
                          {((quotationSummary.filter((q: any) => q.status === 'accepted').length / quotationSummary.length) * 100).toFixed(0)}%
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {quotationSummary.map((quotation: any) => (
                        <div key={quotation.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{quotation.quotationNumber}</h4>
                            <p className="text-sm text-muted-foreground">
                              {quotation.customerCode} • {quotation.country}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${parseFloat(quotation.total).toFixed(2)}</p>
                            <Badge variant={quotation.status === 'accepted' ? 'success' : 'default'}>
                              {quotation.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No quotations found</h3>
                    <p className="text-muted-foreground">
                      No quotations match your current filter criteria
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sales-orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sales Orders Summary</CardTitle>
                <CardDescription>
                  Summary of sales orders with shipment and balance information
                </CardDescription>
              </CardHeader>
              <CardContent>
                {salesOrderSummary?.length ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="p-4 border rounded-lg">
                        <h4 className="text-sm font-medium text-muted-foreground">Total Orders</h4>
                        <p className="text-2xl font-bold">{salesOrderSummary.length}</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="text-sm font-medium text-muted-foreground">Total Value</h4>
                        <p className="text-2xl font-bold">
                          ${salesOrderSummary.reduce((sum: number, so: any) => sum + parseFloat(so.total), 0).toFixed(2)}
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="text-sm font-medium text-muted-foreground">Shipped Value</h4>
                        <p className="text-2xl font-bold">
                          ${salesOrderSummary.reduce((sum: number, so: any) => sum + parseFloat(so.shippedValue || '0'), 0).toFixed(2)}
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="text-sm font-medium text-muted-foreground">Balance Value</h4>
                        <p className="text-2xl font-bold">
                          ${salesOrderSummary.reduce((sum: number, so: any) => sum + parseFloat(so.balanceValue || '0'), 0).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {salesOrderSummary.map((salesOrder: any) => (
                        <div key={salesOrder.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-medium">{salesOrder.salesOrderNumber}</h4>
                              <p className="text-sm text-muted-foreground">
                                {salesOrder.customerCode} • Due: {new Date(salesOrder.dueDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">${parseFloat(salesOrder.total).toFixed(2)}</p>
                              <Badge variant={salesOrder.isConfirmed ? 'success' : 'default'}>
                                {salesOrder.isConfirmed ? 'Confirmed' : 'Draft'}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Shipped:</span>
                              <span className="ml-2 font-medium">${parseFloat(salesOrder.shippedValue || '0').toFixed(2)}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Balance:</span>
                              <span className="ml-2 font-medium">${parseFloat(salesOrder.balanceValue || '0').toFixed(2)}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Completion:</span>
                              <span className="ml-2 font-medium">
                                {salesOrder.shippedValue && salesOrder.total ? 
                                  ((parseFloat(salesOrder.shippedValue) / parseFloat(salesOrder.total)) * 100).toFixed(0) : 0}%
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No sales orders found</h3>
                    <p className="text-muted-foreground">
                      No sales orders match your current filter criteria
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Valuation per Warehouse</CardTitle>
                <CardDescription>
                  Current inventory levels and valuations across all warehouse locations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {inventoryValuation?.warehouses?.map((warehouse: any) => (
                  <div key={warehouse.code} className="mb-6 p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">{warehouse.name}</h3>
                      <Badge variant="outline">{warehouse.code}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Items</p>
                        <p className="text-xl font-bold">{warehouse.totalItems}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Value</p>
                        <p className="text-xl font-bold">${warehouse.totalValue?.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Average Value</p>
                        <p className="text-xl font-bold">${warehouse.averageValue?.toFixed(2)}</p>
                      </div>
                    </div>

                    {warehouse.lowStockItems?.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2 text-red-600">Low Stock Items</h4>
                        <div className="space-y-2">
                          {warehouse.lowStockItems.map((item: any, index: number) => (
                            <div key={index} className="flex justify-between items-center p-2 bg-red-50 dark:bg-red-900/20 rounded">
                              <span className="text-sm">{item.productName}</span>
                              <span className="text-sm font-medium">{item.currentStock} remaining</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )) || (
                  <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No inventory data</h3>
                    <p className="text-muted-foreground">
                      Inventory valuation data will appear here
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment Reports per Sales Order</CardTitle>
                <CardDescription>
                  Customer payment tracking and account summary
                </CardDescription>
              </CardHeader>
              <CardContent>
                {paymentReports?.length ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="p-4 border rounded-lg">
                        <h4 className="text-sm font-medium text-muted-foreground">Total Payments</h4>
                        <p className="text-2xl font-bold">
                          ${paymentReports.reduce((sum: number, p: any) => sum + parseFloat(p.amount), 0).toFixed(2)}
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="text-sm font-medium text-muted-foreground">Outstanding</h4>
                        <p className="text-2xl font-bold">
                          ${paymentReports.reduce((sum: number, p: any) => sum + parseFloat(p.outstanding || '0'), 0).toFixed(2)}
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="text-sm font-medium text-muted-foreground">Payment Rate</h4>
                        <p className="text-2xl font-bold">
                          {paymentReports.filter((p: any) => p.status === 'paid').length > 0 ? 
                            ((paymentReports.filter((p: any) => p.status === 'paid').length / paymentReports.length) * 100).toFixed(0) : 0}%
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {paymentReports.map((payment: any) => (
                        <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{payment.salesOrderNumber}</h4>
                            <p className="text-sm text-muted-foreground">
                              {payment.customerCode} • {payment.paymentMethod}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(payment.paymentDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${parseFloat(payment.amount).toFixed(2)}</p>
                            <Badge variant={payment.status === 'paid' ? 'success' : 'warning'}>
                              {payment.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No payment data</h3>
                    <p className="text-muted-foreground">
                      Payment information will appear here
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}