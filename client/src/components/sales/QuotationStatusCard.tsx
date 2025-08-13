import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  FileText,
  Eye,
  Edit,
  Copy,
  CheckCircle,
  XCircle,
  ShoppingCart,
  Send,
  Download,
  MoreHorizontal,
  ArrowRight,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuotationStatusCardProps {
  quotation: {
    id: string;
    quotationNumber: string;
    customerCode: string;
    customerName?: string;
    total: string | number;
    status: string;
    createdAt: string;
    canConvert?: boolean;
  };
  onViewDetails: (id: string) => void;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onConvertToSalesOrder: (id: string) => void;
  onSendEmail: (id: string) => void;
  onDownloadPDF: (id: string) => void;
}

export function QuotationStatusCard({
  quotation,
  onViewDetails,
  onEdit,
  onDuplicate,
  onApprove,
  onReject,
  onConvertToSalesOrder,
  onSendEmail,
  onDownloadPDF
}: QuotationStatusCardProps) {
  
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200', label: 'Draft' },
      sent: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', label: 'Sent' },
      pending: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', label: 'Pending' },
      approved: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', label: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', label: 'Rejected' },
      expired: { color: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400', label: 'Expired' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'border-green-500 bg-green-50 dark:bg-green-950';
      case 'sent':
      case 'pending':
        return 'border-blue-500 bg-blue-50 dark:bg-blue-950';
      case 'rejected':
        return 'border-red-500 bg-red-50 dark:bg-red-950';
      case 'expired':
        return 'border-gray-400 bg-gray-50 dark:bg-gray-900';
      default:
        return 'border-gray-300 bg-white dark:bg-gray-950';
    }
  };

  const canAutomate = quotation.status === 'approved' || quotation.canConvert;

  return (
    <Card className={cn("transition-all duration-200 hover:shadow-lg", getStatusColor(quotation.status))}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-medium">
                {quotation.quotationNumber}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {quotation.customerCode} • {quotation.customerName || 'Customer'}
              </p>
            </div>
          </div>
          {getStatusBadge(quotation.status)}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Amount & Date */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="text-lg font-semibold text-primary">
              ${typeof quotation.total === 'number' ? quotation.total.toFixed(2) : quotation.total}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Created</p>
            <p className="text-sm font-medium">
              {new Date(quotation.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Automation Indicator */}
        {canAutomate && (
          <div className="flex items-center space-x-2 p-3 rounded-lg bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 border border-green-200 dark:border-green-800">
            <Zap className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-700 dark:text-green-300">
              Ready for automated conversion
            </span>
            <ArrowRight className="h-4 w-4 text-green-600" />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onViewDetails(quotation.id)}
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            
            {canAutomate && (
              <Button 
                size="sm"
                onClick={() => onConvertToSalesOrder(quotation.id)}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                Auto Convert
              </Button>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onEdit(quotation.id)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate(quotation.id)}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {quotation.status === 'pending' && (
                <>
                  <DropdownMenuItem 
                    onClick={() => onApprove(quotation.id)}
                    className="text-green-600"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onReject(quotation.id)}
                    className="text-red-600"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem onClick={() => onSendEmail(quotation.id)}>
                <Send className="h-4 w-4 mr-2" />
                Send Email
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDownloadPDF(quotation.id)}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}