import { Shipment, ShipmentStatus, ShipmentPriority } from '@/types/shipment';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUpDown, Flag, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ShipmentGridProps {
  shipments: Shipment[];
  onSelect: (shipment: Shipment) => void;
  sortBy: keyof Shipment;
  sortOrder: 'asc' | 'desc';
  onSort: (column: keyof Shipment) => void;
  onEdit?: (shipment: Shipment) => void;
}

const statusColors: Record<ShipmentStatus, string> = {
  PENDING: 'bg-muted text-foreground border-border',
  IN_TRANSIT: 'bg-chart-2/20 text-chart-2 border-chart-2',
  DELIVERED: 'bg-chart-1/20 text-chart-1 border-chart-1',
  CANCELLED: 'bg-destructive/20 text-destructive border-destructive',
  DELAYED: 'bg-chart-4/20 text-chart-4 border-chart-4',
};

const priorityColors: Record<ShipmentPriority, string> = {
  LOW: 'bg-muted text-muted-foreground border-border',
  MEDIUM: 'bg-chart-3/20 text-chart-3 border-chart-3',
  HIGH: 'bg-chart-5/20 text-chart-5 border-chart-5',
  URGENT: 'bg-destructive/20 text-destructive border-destructive',
};

import React from 'react';
export const ShipmentGrid = React.memo(function ShipmentGrid({ shipments, onSelect, sortBy, sortOrder, onSort, onEdit }: ShipmentGridProps) {
  const SortButton = ({ column, children }: { column: keyof Shipment; children: React.ReactNode }) => (
    <button
      onClick={() => onSort(column)}
      className="flex items-center gap-1 hover:text-foreground transition-colors"
    >
      {children}
      <ArrowUpDown className={cn(
        "h-3 w-3",
        sortBy === column && "text-primary"
      )} />
    </button>
  );

  return (
    <div className="border-4 border-border overflow-hidden text-xs sm:text-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b-4 border-border bg-muted/50">
              <TableHead className="font-bold px-2 sm:px-4 py-2"> <SortButton column="id">ID</SortButton> </TableHead>
              <TableHead className="font-bold px-2 sm:px-4 py-2"> <SortButton column="shipperName">Shipper</SortButton> </TableHead>
              <TableHead className="font-bold px-2 sm:px-4 py-2"> <SortButton column="carrierName">Carrier</SortButton> </TableHead>
              <TableHead className="font-bold px-2 sm:px-4 py-2">Pickup</TableHead>
              <TableHead className="font-bold px-2 sm:px-4 py-2">Delivery</TableHead>
              <TableHead className="font-bold px-2 sm:px-4 py-2"> <SortButton column="status">Status</SortButton> </TableHead>
              <TableHead className="font-bold px-2 sm:px-4 py-2"> <SortButton column="priority">Priority</SortButton> </TableHead>
              <TableHead className="font-bold px-2 sm:px-4 py-2">Tracking #</TableHead>
              <TableHead className="font-bold px-2 sm:px-4 py-2 text-right"> <SortButton column="rate">Rate</SortButton> </TableHead>
              <TableHead className="font-bold px-2 sm:px-4 py-2 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shipments.map((shipment) => (
              <TableRow 
                key={shipment.id}
                className="border-b-2 border-border hover:bg-accent/50 cursor-pointer transition-colors"
                onClick={() => onSelect(shipment)}
              >
                <TableCell className="font-mono font-medium px-2 sm:px-4 py-2">
                  <div className="flex items-center gap-1 sm:gap-2">
                    {shipment.flagged && <Flag className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-destructive fill-destructive" />}
                    {shipment.id}
                  </div>
                </TableCell>
                <TableCell className="max-w-[80px] sm:max-w-[150px] truncate px-2 sm:px-4 py-2">{shipment.shipperName}</TableCell>
                <TableCell className="max-w-[80px] sm:max-w-[150px] truncate px-2 sm:px-4 py-2">{shipment.carrierName}</TableCell>
                <TableCell className="px-2 sm:px-4 py-2">
                  <div className="text-[10px] sm:text-sm">
                    <div className="truncate max-w-[70px] sm:max-w-[120px]">{shipment.pickupLocation}</div>
                    <div className="text-muted-foreground text-[10px] sm:text-xs">{shipment.pickupDate}</div>
                  </div>
                </TableCell>
                <TableCell className="px-2 sm:px-4 py-2">
                  <div className="text-[10px] sm:text-sm">
                    <div className="truncate max-w-[70px] sm:max-w-[120px]">{shipment.deliveryLocation}</div>
                    <div className="text-muted-foreground text-[10px] sm:text-xs">{shipment.deliveryDate}</div>
                  </div>
                </TableCell>
                <TableCell className="px-2 sm:px-4 py-2">
                  <Badge 
                    variant="outline" 
                    className={cn("border-2 font-medium text-[10px] sm:text-xs", statusColors[shipment.status])}
                  >
                    {formatStatus(shipment.status)}
                  </Badge>
                </TableCell>
                <TableCell className="px-2 sm:px-4 py-2">
                  <Badge 
                    variant="outline" 
                    className={cn("border-2 font-medium text-[10px] sm:text-xs", priorityColors[shipment.priority])}
                  >
                    {formatPriority(shipment.priority)}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-[10px] sm:text-xs px-2 sm:px-4 py-2">{shipment.trackingNumber}</TableCell>
                <TableCell className="text-right font-medium px-2 sm:px-4 py-2">${shipment.rate.toLocaleString()}</TableCell>
                <TableCell className="text-center flex gap-1 sm:gap-2 justify-center px-2 sm:px-4 py-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-2 h-7 w-7 sm:h-8 sm:w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(shipment);
                    }}
                  >
                    <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Button>
                  {onEdit && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-2 h-7 w-7 sm:h-8 sm:w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(shipment);
                      }}
                    >
                      <span className="text-[10px] sm:text-xs">Edit</span>
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
});
