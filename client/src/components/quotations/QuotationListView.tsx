import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Search, Filter, Plus, Eye, Edit, Trash2, Download, Share, Printer, FileText } from 'lucide-react';
// import { QuotationDetailModal } from './QuotationDetailModal';

interface Quotation {
  id: string;
  number: string;
  customerName: string;
  customerCode: string;
  country: string;
  revisionNumber: string;
  status: string;
  total: number;
  createdAt: string;
  validUntil: string;
  itemCount: number;
  createdByInitials: string;
}

interface QuotationFilters {
  search: string;
  status: string;
  country: string;
  dateFrom: string;
  dateTo: string;
  minAmount: string;
  maxAmount: string;
}

export function QuotationListView() {
  const { toast } = useToast();
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuotation, setSelectedQuotation] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<QuotationFilters>({
    search: '',
    status: '',
    country: '',
    dateFrom: '',
    dateTo: '',
    minAmount: '',
    maxAmount: ''
  });

  const [countries, setCountries] = useState<string[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    loadQuotations();
    loadFilterData();
  }, []);

  const loadQuotations = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/quotations', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setQuotations(data || []);
      } else {
        throw new Error('Failed to load quotations');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load quotations",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadFilterData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const [customersRes] = await Promise.all([
        fetch('/api/customers', { headers })
      ]);

      if (customersRes.ok) {
        const customersData = await customersRes.json();
        setCustomers(customersData || []);
        const uniqueCountries = Array.from(new Set(customersData.map((c: any) => c.country)));
        setCountries(uniqueCountries);
      }
    } catch (error) {
      console.error('Error loading filter data:', error);
    }
  };

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);
      if (filters.country) params.append('country', filters.country);
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);
      if (filters.minAmount) params.append('minAmount', filters.minAmount);
      if (filters.maxAmount) params.append('maxAmount', filters.maxAmount);

      const response = await fetch(`/api/quotations?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setQuotations(data || []);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search quotations",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this quotation?')) return;

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/quotations/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Quotation deleted successfully"
        });
        loadQuotations();
      } else {
        throw new Error('Failed to delete quotation');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete quotation",
        variant: "destructive"
      });
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/quotations/${id}/duplicate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Success",
          description: `Quotation duplicated as ${result.quotation.number}`
        });
        loadQuotations();
      } else {
        throw new Error('Failed to duplicate quotation');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to duplicate quotation",
        variant: "destructive"
      });
    }
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      country: '',
      dateFrom: '',
      dateTo: '',
      minAmount: '',
      maxAmount: ''
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'draft': 'secondary',
      'pending': 'default',
      'approved': 'default',
      'rejected': 'destructive',
      'expired': 'outline'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'default'}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const filteredQuotations = quotations.filter(quotation => {
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      if (!quotation.number.toLowerCase().includes(searchTerm) &&
          !quotation.customerName.toLowerCase().includes(searchTerm) &&
          !quotation.customerCode.toLowerCase().includes(searchTerm)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quotation Management</h1>
          <p className="text-muted-foreground">
            Manage all quotations with advanced search and filtering
          </p>
        </div>
        <Button className="gap-2" data-testid="button-new-quotation">
          <Plus className="w-4 h-4" />
          New Quotation
        </Button>
      </div>

      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search quotations, customers, or numbers..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10"
                data-testid="input-search"
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
              data-testid="button-toggle-filters"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
            <Button onClick={handleSearch} data-testid="button-search">
              Search
            </Button>
            <Button variant="outline" onClick={clearFilters} data-testid="button-clear-filters">
              Clear
            </Button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <>
              <Separator className="my-4" />
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select 
                    value={filters.status} 
                    onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Statuses</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Country</Label>
                  <Select 
                    value={filters.country} 
                    onValueChange={(value) => setFilters(prev => ({ ...prev, country: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All countries" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Countries</SelectItem>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>{country}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Date From</Label>
                  <Input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Date To</Label>
                  <Input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Min Amount ($)</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={filters.minAmount}
                    onChange={(e) => setFilters(prev => ({ ...prev, minAmount: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Max Amount ($)</Label>
                  <Input
                    type="number"
                    placeholder="999999.00"
                    value={filters.maxAmount}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxAmount: e.target.value }))}
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing {filteredQuotations.length} of {quotations.length} quotations
        </span>
        <span>
          Total Value: ${filteredQuotations.reduce((sum, q) => sum + q.total, 0).toLocaleString()}
        </span>
      </div>

      {/* Quotations Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quotation #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Revision</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Valid Until</TableHead>
                <TableHead>Creator</TableHead>
                <TableHead className="w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-8">
                    Loading quotations...
                  </TableCell>
                </TableRow>
              ) : filteredQuotations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-8">
                    No quotations found
                  </TableCell>
                </TableRow>
              ) : (
                filteredQuotations.map((quotation) => (
                  <TableRow key={quotation.id} data-testid={`quotation-row-${quotation.id}`}>
                    <TableCell className="font-mono font-semibold">
                      {quotation.number}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{quotation.customerName}</div>
                        <div className="text-sm text-muted-foreground">
                          {quotation.customerCode}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{quotation.country}</Badge>
                    </TableCell>
                    <TableCell className="font-mono">
                      {quotation.revisionNumber}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{quotation.itemCount} items</Badge>
                    </TableCell>
                    <TableCell className="font-semibold">
                      ${quotation.total.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(quotation.status)}
                    </TableCell>
                    <TableCell>
                      {new Date(quotation.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {quotation.validUntil ? new Date(quotation.validUntil).toLocaleDateString() : 'No limit'}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {quotation.createdByInitials}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedQuotation(quotation.id);
                            setShowDetailModal(true);
                          }}
                          data-testid={`button-view-${quotation.id}`}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          data-testid={`button-edit-${quotation.id}`}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDuplicate(quotation.id)}
                          data-testid={`button-duplicate-${quotation.id}`}
                        >
                          <FileText className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(quotation.id)}
                          data-testid={`button-delete-${quotation.id}`}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quotation Detail Modal */}
      {selectedQuotation && showDetailModal && (
        <Dialog open={showDetailModal} onOpenChange={() => {
          setShowDetailModal(false);
          setSelectedQuotation(null);
        }}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Quotation Details</DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <p>Quotation ID: {selectedQuotation}</p>
              <p>Detail modal will be implemented</p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}