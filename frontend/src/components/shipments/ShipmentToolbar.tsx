import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Grid3X3, LayoutGrid, Search, Filter, X } from 'lucide-react';
import { ViewMode, ShipmentStatus, ShipmentPriority } from '@/types/shipment';
import { cn } from '@/lib/utils';

interface ShipmentToolbarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusFilter: ShipmentStatus | 'all';
  onStatusFilterChange: (status: ShipmentStatus | 'all') => void;
  priorityFilter: ShipmentPriority | 'all';
  onPriorityFilterChange: (priority: ShipmentPriority | 'all') => void;
  totalCount: number;
  filteredCount: number;
}

export function ShipmentToolbar({
  viewMode,
  onViewModeChange,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  totalCount,
  filteredCount,
}: ShipmentToolbarProps) {
  const [showFilters, setShowFilters] = useState(false);
  const hasActiveFilters = statusFilter !== 'all' || priorityFilter !== 'all' || searchTerm.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left side - Search & Filter Toggle */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search shipments..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 border-2"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
                onClick={() => onSearchChange('')}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          <Button
            variant={showFilters ? "default" : "outline"}
            size="icon"
            className={cn("border-2", hasActiveFilters && !showFilters && "border-primary")}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Right side - View toggle & Count */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-bold text-foreground">{filteredCount}</span> of {totalCount}
          </p>
          <div className="flex items-center border-2 border-border">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-none"
              onClick={() => onViewModeChange('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <div className="w-px h-6 bg-border" />
            <Button
              variant={viewMode === 'tile' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-none"
              onClick={() => onViewModeChange('tile')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filters Row */}
      {showFilters && (
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 p-3 sm:p-4 border-2 border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium shrink-0 w-16 sm:w-auto">Status:</span>
            <Select value={statusFilter} onValueChange={(value) => onStatusFilterChange(value as ShipmentStatus | 'all')}>
              <SelectTrigger className="flex-1 sm:w-36 border-2">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="border-2 border-border bg-popover">
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="DELAYED">Delayed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium shrink-0 w-16 sm:w-auto">Priority:</span>
            <Select value={priorityFilter} onValueChange={(value) => onPriorityFilterChange(value as ShipmentPriority | 'all')}>
              <SelectTrigger className="flex-1 sm:w-32 border-2">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="border-2 border-border bg-popover">
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="URGENT">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              className="border-2 w-full sm:w-auto"
              onClick={() => {
                onSearchChange('');
                onStatusFilterChange('all');
                onPriorityFilterChange('all');
              }}
            >
              <X className="h-3 w-3 mr-1" />
              Clear filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
