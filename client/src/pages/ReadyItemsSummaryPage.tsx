import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Download, Filter, Package, TrendingUp, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ReadyItemsSummaryFilters {
  dateFrom: string;
  dateTo: string;
  customerCode: string;
  orderItem: string;
}

export default function ReadyItemsSummaryPage() {
  const { toast } = useToast();
  const [filters, setFilters] = useState<ReadyItemsSummaryFilters>({
    dateFrom: '',
    dateTo: '',
    customerCode: '',
    orderItem: ''
  });

  const [appliedFilters, setAppliedFilters] = useState<ReadyItemsSummaryFilters>({
    dateFrom: '',
    dateTo: '',
    customerCode: '',
    orderItem: ''
  });

  // Build query parameters
  const queryParams = new URLSearchParams();
  if (appliedFilters.dateFrom) queryParams.set('dateFrom', appliedFilters.dateFrom);
  if (appliedFilters.dateTo) queryParams.set('dateTo', appliedFilters.dateTo);
  if (appliedFilters.customerCode) queryParams.set('customerCode', appliedFilters.customerCode);
  if (appliedFilters.orderItem) queryParams.set('orderItem', appliedFilters.orderItem);

  const { data: summaryData, isLoading, error } = useQuery({
    queryKey: ['/api/reports/ready-items-summary', queryParams.toString()],
    queryFn: () => fetch(`/api/reports/ready-items-summary?${queryParams}`).then(res => res.json())
  });

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filters });
  };

  const handleClearFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      customerCode: '',
      orderItem: ''
    });
    setAppliedFilters({
      dateFrom: '',
      dateTo: '',
      customerCode: '',
      orderItem: ''
    });
  };

  const handleExportExcel = async () => {
    try {
      const response = await apiRequest('/api/reports/ready-items-summary/export/excel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appliedFilters),
      });
      
      // Handle file download
      const blob = new Blob([response], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ready-items-summary-${Date.now()}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Export Successful",
        description: "Ready items summary exported to Excel successfully",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export ready items summary",
        variant: "destructive",
      });
    }
  };

  const getReadyStatusBadge = (percentage: number) => {
    if (percentage >= 80) {
      return <Badge className="bg-green-500 text-white">Ready: {percentage}%</Badge>;
    } else if (percentage >= 50) {
      return <Badge className="bg-yellow-500 text-white">Partial: {percentage}%</Badge>;
    } else if (percentage > 0) {
      return <Badge className="bg-orange-500 text-white">Started: {percentage}%</Badge>;
    } else {
      return <Badge variant="secondary">Pending: {percentage}%</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Ready Items Summary</h1>
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6">
            <p className="text-red-600">Failed to load ready items summary</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Ready Items Summary</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Track production progress from Job Orders with ready quantities
          </p>
        </div>
        <Button onClick={handleExportExcel} className="bg-green-600 hover:bg-green-700">
          <Download className="w-4 h-4 mr-2" />
          Export Excel
        </Button>
      </div>

      {/* Filters Section */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="dateFrom">Date From</Label>
              <Input
                id="dateFrom"
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="dateTo">Date To</Label>
              <Input
                id="dateTo"
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="customerCode">Customer Code</Label>
              <Input
                id="customerCode"
                placeholder="e.g., ABA, ABC"
                value={filters.customerCode}
                onChange={(e) => setFilters({ ...filters, customerCode: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="orderItem">Order Item</Label>
              <Input
                id="orderItem"
                placeholder="Product name"
                value={filters.orderItem}
                onChange={(e) => setFilters({ ...filters, orderItem: e.target.value })}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleApplyFilters}>Apply Filters</Button>
            <Button variant="outline" onClick={handleClearFilters}>Clear</Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Overview */}
      {summaryData?.statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="elevated-container">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Items</p>
                  <p className="text-2xl font-bold">{summaryData.statistics.totalItems}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="elevated-container">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Ordered</p>
                  <p className="text-2xl font-bold">{summaryData.statistics.totalOrderedGlobal}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="elevated-container">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Ready</p>
                  <p className="text-2xl font-bold text-green-600">{summaryData.statistics.totalReadyGlobal}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="elevated-container">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Pending</p>
                  <p className="text-2xl font-bold text-orange-600">{summaryData.statistics.totalPendingGlobal}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="elevated-container">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full ${
                  summaryData.statistics.overallReadyPercentage >= 80 ? 'bg-green-500' :
                  summaryData.statistics.overallReadyPercentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Ready %</p>
                  <p className="text-2xl font-bold">{summaryData.statistics.overallReadyPercentage}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detailed Summary */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle>Ready Items Detailed Report</CardTitle>
        </CardHeader>
        <CardContent>
          {summaryData?.summary?.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No ready items found with the current filters</p>
            </div>
          ) : (
            <div className="space-y-4">
              {summaryData?.summary?.map((item: any, index: number) => (
                <Card key={index} className="floating-card">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="outline" className="font-mono">
                            {item.customerCode}
                          </Badge>
                          {getReadyStatusBadge(item.readyPercentage)}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          {item.productName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          Specification: {item.specification}
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Total Ordered</p>
                            <p className="text-2xl font-bold text-blue-600">{item.totalOrdered}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Ready</p>
                            <p className="text-2xl font-bold text-green-600">{item.totalReady}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Pending</p>
                            <p className="text-2xl font-bold text-orange-600">{item.totalPending}</p>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${item.readyPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    {/* Job Orders Details */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                        Associated Job Orders ({item.jobOrders.length})
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {item.jobOrders.map((jobOrder: any, joIndex: number) => (
                          <div key={joIndex} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                            <p className="font-mono text-sm font-medium text-blue-600">
                              {jobOrder.jobOrderNumber}
                            </p>
                            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-1">
                              <span>Qty: {jobOrder.quantity}</span>
                              <span>Ready: {jobOrder.readyQuantity}</span>
                            </div>
                            {jobOrder.dueDate && (
                              <p className="text-xs text-gray-500 mt-1">
                                Due: {new Date(jobOrder.dueDate).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}