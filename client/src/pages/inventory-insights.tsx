import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Package, 
  Calendar, 
  DollarSign,
  BarChart3,
  RefreshCw,
  Download,
  Target,
  Zap,
  Shield
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Navbar } from "@/components/navbar";
import { useToast } from "@/hooks/use-toast";

interface InventoryPrediction {
  productName: string;
  currentStock: number;
  predictedDemand: {
    next30Days: number;
    next60Days: number;
    next90Days: number;
  };
  recommendations: {
    action: 'reorder' | 'reduce' | 'maintain' | 'increase_production';
    urgency: 'low' | 'medium' | 'high' | 'critical';
    suggestedOrderQuantity?: number;
    reasoning: string;
    estimatedStockoutDate?: string;
  };
  insights: {
    trendAnalysis: string;
    seasonalFactors: string;
    riskAssessment: string;
    costOptimization: string;
  };
  confidence: number;
}

interface MarketDemandAnalysis {
  overallTrend: 'increasing' | 'decreasing' | 'stable' | 'volatile';
  growthRate: number;
  seasonalPatterns: Array<{
    period: string;
    demandIncrease: number;
    description: string;
  }>;
  keyFactors: string[];
  recommendations: string[];
}

export default function InventoryInsightsPage() {
  const [selectedProduct, setSelectedProduct] = useState<string>("all");
  const [timeframe, setTimeframe] = useState<string>("90");
  const { toast } = useToast();

  // Fetch products for selection
  const { data: products } = useQuery({
    queryKey: ["/api/products"],
  });

  // Fetch inventory predictions
  const { data: predictions, isLoading: predictionsLoading, refetch: refetchPredictions } = useQuery({
    queryKey: ["/api/ai/inventory-predictions", { product: selectedProduct, timeframe }],
    queryFn: ({ queryKey }) => {
      const [_, params] = queryKey as [string, any];
      let url = "/api/ai/inventory-predictions";
      const searchParams = new URLSearchParams();
      
      if (params.product && params.product !== "all") searchParams.append("product", params.product);
      if (params.timeframe) searchParams.append("timeframe", params.timeframe);
      
      if (searchParams.toString()) {
        url += `?${searchParams.toString()}`;
      }
      
      return apiRequest(url);
    },
  });

  // Fetch market demand analysis
  const { data: marketAnalysis, isLoading: marketLoading } = useQuery({
    queryKey: ["/api/ai/market-demand-analysis", { timeframe }],
    queryFn: ({ queryKey }) => {
      const [_, params] = queryKey as [string, any];
      return apiRequest(`/api/ai/market-demand-analysis?timeframe=${params.timeframe}`);
    },
  });

  // Generate restock plan mutation
  const generateRestockPlan = useMutation({
    mutationFn: (data: { budget: number }) => 
      apiRequest("/api/ai/generate-restock-plan", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      }),
    onSuccess: () => {
      toast({
        title: "Restock Plan Generated",
        description: "AI-powered restock recommendations are ready.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/ai/inventory-predictions"] });
    },
    onError: () => {
      toast({
        title: "Generation Failed",
        description: "Failed to generate restock plan. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'high': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'decreasing': return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'volatile': return <BarChart3 className="h-4 w-4 text-orange-600" />;
      default: return <Target className="h-4 w-4 text-blue-600" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const exportPredictions = () => {
    if (!predictions?.predictions) return;

    const csvContent = [
      ['Product', 'Current Stock', '30-Day Demand', '60-Day Demand', '90-Day Demand', 'Action', 'Urgency', 'Confidence', 'Reasoning'].join(','),
      ...predictions.predictions.map((pred: InventoryPrediction) => [
        `"${pred.productName}"`,
        pred.currentStock,
        pred.predictedDemand.next30Days,
        pred.predictedDemand.next60Days,
        pred.predictedDemand.next90Days,
        pred.recommendations.action,
        pred.recommendations.urgency,
        `${(pred.confidence * 100).toFixed(1)}%`,
        `"${pred.recommendations.reasoning}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `inventory-predictions-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (predictionsLoading || marketLoading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center space-x-2">
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span>Analyzing inventory data with AI...</span>
              </div>
            </div>
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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                <Zap className="h-8 w-8 text-purple-600" />
                <span>Predictive Inventory Insights</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                AI-powered inventory forecasting and optimization for Filipino hair products
              </p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={exportPredictions}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button onClick={() => refetchPredictions()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Analysis
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Product Focus</label>
                  <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Products</SelectItem>
                      {products?.map((product: any) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Analysis Timeframe</label>
                  <Select value={timeframe} onValueChange={setTimeframe}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 Days</SelectItem>
                      <SelectItem value="60">60 Days</SelectItem>
                      <SelectItem value="90">90 Days</SelectItem>
                      <SelectItem value="180">180 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => generateRestockPlan.mutate({ budget: 50000 })}
                    disabled={generateRestockPlan.isPending}
                  >
                    {generateRestockPlan.isPending ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Target className="w-4 h-4 mr-2" />
                    )}
                    Generate Restock Plan
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Market Overview Cards */}
          {marketAnalysis && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="border-0 shadow-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Market Trend</CardTitle>
                  {getTrendIcon(marketAnalysis.overallTrend)}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold capitalize">{marketAnalysis.overallTrend}</div>
                  <p className="text-xs text-muted-foreground">
                    {marketAnalysis.growthRate > 0 ? '+' : ''}{marketAnalysis.growthRate.toFixed(1)}% growth rate
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Key Factors</CardTitle>
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{marketAnalysis.keyFactors?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Market influences identified
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Seasonal Patterns</CardTitle>
                  <Calendar className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{marketAnalysis.seasonalPatterns?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Seasonal trends detected
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Predictions Ready</CardTitle>
                  <Shield className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{predictions?.predictions?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Products analyzed
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Content Tabs */}
          <Tabs defaultValue="predictions" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="predictions">Inventory Predictions</TabsTrigger>
              <TabsTrigger value="market">Market Analysis</TabsTrigger>
              <TabsTrigger value="restock">Restock Planning</TabsTrigger>
            </TabsList>

            <TabsContent value="predictions">
              <Card>
                <CardHeader>
                  <CardTitle>AI Inventory Predictions</CardTitle>
                  <CardDescription>
                    Demand forecasting and stock recommendations based on historical data and market trends
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Current Stock</TableHead>
                        <TableHead>30-Day Demand</TableHead>
                        <TableHead>90-Day Demand</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Urgency</TableHead>
                        <TableHead>Confidence</TableHead>
                        <TableHead>Insights</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {predictions?.predictions?.map((prediction: InventoryPrediction, index: number) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{prediction.productName}</TableCell>
                          <TableCell>{prediction.currentStock}</TableCell>
                          <TableCell>{prediction.predictedDemand.next30Days}</TableCell>
                          <TableCell>{prediction.predictedDemand.next90Days}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {prediction.recommendations.action.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getUrgencyColor(prediction.recommendations.urgency)}>
                              {prediction.recommendations.urgency}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Progress value={prediction.confidence * 100} className="w-16" />
                              <span className="text-sm">{(prediction.confidence * 100).toFixed(0)}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <p className="text-sm text-gray-600 truncate" title={prediction.recommendations.reasoning}>
                              {prediction.recommendations.reasoning}
                            </p>
                          </TableCell>
                        </TableRow>
                      ))}
                      {(!predictions?.predictions || predictions.predictions.length === 0) && (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                            No inventory predictions available. Generate analysis to see AI insights.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="market">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Market Demand Analysis</CardTitle>
                    <CardDescription>
                      Overall market trends and growth patterns for Filipino hair products
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {marketAnalysis && (
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Overall Trend</h4>
                          <div className="flex items-center space-x-2">
                            {getTrendIcon(marketAnalysis.overallTrend)}
                            <span className="capitalize">{marketAnalysis.overallTrend}</span>
                            <Badge variant="outline">
                              {marketAnalysis.growthRate > 0 ? '+' : ''}{marketAnalysis.growthRate.toFixed(1)}% growth
                            </Badge>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Key Market Factors</h4>
                          <ul className="space-y-1">
                            {marketAnalysis.keyFactors?.map((factor, index) => (
                              <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                                • {factor}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Seasonal Patterns</CardTitle>
                    <CardDescription>
                      Demand fluctuations throughout the year
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {marketAnalysis?.seasonalPatterns?.map((pattern, index) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">{pattern.period}</span>
                            <Badge variant={pattern.demandIncrease > 0 ? "default" : "secondary"}>
                              {pattern.demandIncrease > 0 ? '+' : ''}{pattern.demandIncrease}%
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {pattern.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="restock">
              <Card>
                <CardHeader>
                  <CardTitle>AI-Powered Restock Planning</CardTitle>
                  <CardDescription>
                    Optimized inventory replenishment recommendations based on budget and demand forecasts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {generateRestockPlan.data ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                          <CardContent className="pt-4">
                            <div className="flex items-center space-x-2">
                              <DollarSign className="h-4 w-4 text-green-600" />
                              <span className="font-medium">Total Cost</span>
                            </div>
                            <p className="text-2xl font-bold">
                              {formatCurrency(generateRestockPlan.data.totalCost)}
                            </p>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="pt-4">
                            <div className="flex items-center space-x-2">
                              <Package className="h-4 w-4 text-blue-600" />
                              <span className="font-medium">Products</span>
                            </div>
                            <p className="text-2xl font-bold">
                              {generateRestockPlan.data.restockPlan?.length || 0}
                            </p>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="pt-4">
                            <div className="flex items-center space-x-2">
                              <AlertTriangle className="h-4 w-4 text-orange-600" />
                              <span className="font-medium">High Priority</span>
                            </div>
                            <p className="text-2xl font-bold">
                              {generateRestockPlan.data.restockPlan?.filter((item: any) => item.priority >= 8).length || 0}
                            </p>
                          </CardContent>
                        </Card>
                      </div>

                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Suggested Quantity</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Estimated Cost</TableHead>
                            <TableHead>Reasoning</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {generateRestockPlan.data.restockPlan?.map((item: any, index: number) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{item.productName}</TableCell>
                              <TableCell>{item.suggestedQuantity}</TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Progress value={item.priority * 10} className="w-16" />
                                  <span className="text-sm">{item.priority}/10</span>
                                </div>
                              </TableCell>
                              <TableCell>{formatCurrency(item.estimatedCost)}</TableCell>
                              <TableCell className="max-w-xs">
                                <p className="text-sm text-gray-600 truncate" title={item.reasoning}>
                                  {item.reasoning}
                                </p>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500 mb-4">No restock plan generated yet</p>
                      <Button onClick={() => generateRestockPlan.mutate({ budget: 50000 })}>
                        Generate Restock Plan
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}