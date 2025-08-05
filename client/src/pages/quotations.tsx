import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, FileText, Eye, Edit3, Copy, Send } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { Quotation } from "@shared/schema";
import { Navbar } from "@/components/navbar";

export default function QuotationsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const queryClient = useQueryClient();

  const { data: quotations, isLoading } = useQuery({
    queryKey: ["/api/quotations"],
  });

  const createQuotationMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/quotations", { method: "POST", body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quotations"] });
      setShowCreateModal(false);
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft": return "secondary";
      case "sent": return "default";
      case "accepted": return "success";
      case "expired": return "destructive";
      default: return "secondary";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Quotations</h1>
            <p className="text-muted-foreground">
              Manage customer quotations and price estimates
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Quotation
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Quotations</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{quotations?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Draft Quotations</CardTitle>
              <Edit3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {quotations?.filter((q: Quotation) => q.status === "draft").length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sent Quotations</CardTitle>
              <Send className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {quotations?.filter((q: Quotation) => q.status === "sent").length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accepted</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {quotations?.filter((q: Quotation) => q.status === "accepted").length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quotations List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Quotations</CardTitle>
            <CardDescription>
              All quotations from newest to oldest
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : quotations?.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No quotations yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first quotation to get started
                </p>
                <Button onClick={() => setShowCreateModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Quotation
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {quotations?.map((quotation: Quotation) => (
                  <div
                    key={quotation.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div>
                        <h4 className="font-medium">{quotation.quotationNumber}</h4>
                        <p className="text-sm text-muted-foreground">
                          {quotation.customerCode} • {quotation.country}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-medium">
                          ${parseFloat(quotation.total || "0").toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(quotation.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={getStatusColor(quotation.status || "draft")}>
                        {quotation.status}
                      </Badge>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}