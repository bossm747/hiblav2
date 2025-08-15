import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  Edit,
  Trash2,
  Download,
  Copy,
  MoreVertical,
  Plus,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X,
  SlidersHorizontal,
  FileText,
  Printer,
  Mail,
  Check,
} from 'lucide-react';

interface Column<T> {
  key: string;
  header: string;
  accessor: (item: T) => any;
  sortable?: boolean;
  filterable?: boolean;
  filterType?: 'text' | 'select' | 'date' | 'number';
  filterOptions?: { label: string; value: string }[];
  render?: (value: any, item: T) => React.ReactNode;
  className?: string;
  mobileHidden?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchKeys?: string[];
  onView?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onDuplicate?: (item: T) => void;
  onPrint?: (item: T) => void;
  onEmail?: (item: T) => void;
  onApprove?: (item: T) => void;
  onCreate?: () => void;
  createLabel?: string;
  pageSize?: number;
  mobileCardView?: boolean;
  stickyHeader?: boolean;
  showPagination?: boolean;
  showFilters?: boolean;
  className?: string;
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  searchKeys = [],
  onView,
  onEdit,
  onDelete,
  onDuplicate,
  onPrint,
  onEmail,
  onApprove,
  onCreate,
  createLabel = 'Create New',
  pageSize = 10,
  mobileCardView = true,
  stickyHeader = true,
  showPagination = true,
  showFilters = true,
  className,
}: DataTableProps<T>) {
  const [globalSearch, setGlobalSearch] = useState('');
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(pageSize);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Mobile detection
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter data based on global search and column filters
  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Global search
    if (globalSearch) {
      filtered = filtered.filter((item) => {
        const searchFields = searchKeys.length > 0 
          ? searchKeys 
          : columns.map(col => col.key);
        
        return searchFields.some((key) => {
          const value = (item as any)[key];
          return value?.toString().toLowerCase().includes(globalSearch.toLowerCase());
        });
      });
    }

    // Column filters
    Object.entries(columnFilters).forEach(([key, filterValue]) => {
      if (filterValue) {
        filtered = filtered.filter((item) => {
          const value = (item as any)[key];
          return value?.toString().toLowerCase().includes(filterValue.toLowerCase());
        });
      }
    });

    return filtered;
  }, [data, globalSearch, columnFilters, searchKeys, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = (a as any)[sortConfig.key];
      const bValue = (b as any)[sortConfig.key];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  // Handle sort
  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        if (prev.direction === 'asc') return { key, direction: 'desc' };
        if (prev.direction === 'desc') return null;
      }
      return { key, direction: 'asc' };
    });
  };

  // Handle column filter
  const handleColumnFilter = (key: string, value: string) => {
    setColumnFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setCurrentPage(1);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setGlobalSearch('');
    setColumnFilters({});
    setSortConfig(null);
    setCurrentPage(1);
  };

  // Mobile card view
  const MobileCard = ({ item }: { item: T }) => (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="space-y-2">
          {columns
            .filter(col => !col.mobileHidden)
            .map((col) => (
              <div key={col.key} className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">
                  {col.header}:
                </span>
                <span className="text-sm">
                  {col.render 
                    ? col.render(col.accessor(item), item)
                    : col.accessor(item)}
                </span>
              </div>
            ))}
        </div>
        {/* Mobile Actions */}
        <div className="flex gap-2 mt-4 pt-4 border-t">
          {onView && (
            <Button size="sm" variant="outline" onClick={() => onView(item)}>
              <Eye className="h-4 w-4" />
            </Button>
          )}
          {onEdit && (
            <Button size="sm" variant="outline" onClick={() => onEdit(item)}>
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button size="sm" variant="outline" onClick={() => onDelete(item)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onDuplicate && (
                <DropdownMenuItem onClick={() => onDuplicate(item)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
              )}
              {onPrint && (
                <DropdownMenuItem onClick={() => onPrint(item)}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </DropdownMenuItem>
              )}
              {onEmail && (
                <DropdownMenuItem onClick={() => onEmail(item)}>
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </DropdownMenuItem>
              )}
              {onApprove && (
                <DropdownMenuItem onClick={() => onApprove(item)}>
                  <Check className="h-4 w-4 mr-2" />
                  Approve
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="flex flex-1 gap-2">
          {/* Global Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={globalSearch}
              onChange={(e) => {
                setGlobalSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-8"
            />
          </div>
          
          {/* Filter Toggle */}
          {showFilters && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className={cn(showFilterPanel && "bg-accent")}
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          )}

          {/* Clear Filters */}
          {(globalSearch || Object.keys(columnFilters).length > 0) && (
            <Button
              variant="outline"
              size="icon"
              onClick={clearAllFilters}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Create Button */}
        {onCreate && (
          <Button onClick={onCreate} className="shrink-0">
            <Plus className="h-4 w-4 mr-2" />
            {createLabel}
          </Button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && showFilterPanel && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {columns
                .filter(col => col.filterable)
                .map((col) => (
                  <div key={col.key}>
                    <label className="text-sm font-medium mb-1 block">
                      {col.header}
                    </label>
                    {col.filterType === 'select' && col.filterOptions ? (
                      <Select
                        value={columnFilters[col.key] || ''}
                        onValueChange={(value) => handleColumnFilter(col.key, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All</SelectItem>
                          {col.filterOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        type={col.filterType === 'number' ? 'number' : 'text'}
                        placeholder={`Filter ${col.header}...`}
                        value={columnFilters[col.key] || ''}
                        onChange={(e) => handleColumnFilter(col.key, e.target.value)}
                      />
                    )}
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table or Mobile Cards */}
      {isMobile && mobileCardView ? (
        <div>
          {paginatedData.map((item) => (
            <MobileCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader className={cn(stickyHeader && "sticky top-0 bg-background z-10")}>
              <TableRow>
                {columns.map((col) => (
                  <TableHead
                    key={col.key}
                    className={cn(
                      col.className,
                      col.sortable && "cursor-pointer select-none",
                      col.mobileHidden && "hidden md:table-cell"
                    )}
                    onClick={() => col.sortable && handleSort(col.key)}
                  >
                    <div className="flex items-center gap-1">
                      {col.header}
                      {col.sortable && (
                        <span className="ml-1">
                          {sortConfig?.key === col.key ? (
                            sortConfig.direction === 'asc' ? (
                              <ArrowUp className="h-3 w-3" />
                            ) : (
                              <ArrowDown className="h-3 w-3" />
                            )
                          ) : (
                            <ArrowUpDown className="h-3 w-3 opacity-50" />
                          )}
                        </span>
                      )}
                    </div>
                  </TableHead>
                ))}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + 1}
                    className="text-center text-muted-foreground py-8"
                  >
                    No data found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item) => (
                  <TableRow key={item.id}>
                    {columns.map((col) => (
                      <TableCell
                        key={col.key}
                        className={cn(
                          col.className,
                          col.mobileHidden && "hidden md:table-cell"
                        )}
                      >
                        {col.render 
                          ? col.render(col.accessor(item), item)
                          : col.accessor(item)}
                      </TableCell>
                    ))}
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        {onView && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onView(item)}
                            data-testid={`button-view-${item.id}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        {onEdit && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onEdit(item)}
                            data-testid={`button-edit-${item.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onDelete(item)}
                            data-testid={`button-delete-${item.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                        
                        {/* More Actions Dropdown */}
                        {(onDuplicate || onPrint || onEmail || onApprove) && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="ghost">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>More Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              {onDuplicate && (
                                <DropdownMenuItem onClick={() => onDuplicate(item)}>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Duplicate
                                </DropdownMenuItem>
                              )}
                              {onPrint && (
                                <DropdownMenuItem onClick={() => onPrint(item)}>
                                  <Printer className="h-4 w-4 mr-2" />
                                  Print
                                </DropdownMenuItem>
                              )}
                              {onEmail && (
                                <DropdownMenuItem onClick={() => onEmail(item)}>
                                  <Mail className="h-4 w-4 mr-2" />
                                  Email
                                </DropdownMenuItem>
                              )}
                              {onApprove && (
                                <DropdownMenuItem onClick={() => onApprove(item)}>
                                  <Check className="h-4 w-4 mr-2" />
                                  Approve
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, sortedData.length)} of{' '}
              {sortedData.length} entries
            </span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              data-testid="button-first-page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              data-testid="button-prev-page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    size="sm"
                    variant={currentPage === pageNum ? "default" : "outline"}
                    onClick={() => setCurrentPage(pageNum)}
                    className="w-8"
                    data-testid={`button-page-${pageNum}`}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              data-testid="button-next-page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              data-testid="button-last-page"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}