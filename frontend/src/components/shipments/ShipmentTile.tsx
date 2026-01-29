import { Shipment, ShipmentStatus, ShipmentPriority } from '@/types/shipment';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Flag, Trash2, MapPin, Truck, DollarSign, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatStatus, formatPriority } from '@/lib/format';

interface ShipmentTileProps {
  shipment: Shipment;
  onSelect: (shipment: Shipment) => void;
  onEdit: (shipment: Shipment) => void;
  onFlag: (shipment: Shipment) => void;
  onDelete: (shipment: Shipment) => void;
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

export function ShipmentTile({ shipment, onSelect, onEdit, onFlag, onDelete }: ShipmentTileProps) {
  return (
    <Card 
      className={cn(
        "border-4 border-border shadow-sm hover:shadow-md cursor-pointer transition-all hover:-translate-y-1 p-2 sm:p-4",
        shipment.flagged && "border-l-destructive"
      )}
      onClick={() => onSelect(shipment)}
    >
      <CardHeader className="p-2 sm:p-4 pb-1 sm:pb-2">
        <div className="flex items-start justify-between gap-1 sm:gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
              <span className="font-mono font-bold text-xs sm:text-sm">{shipment.id}</span>
              {shipment.flagged && <Flag className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-destructive fill-destructive" />}
            </div>
            <p className="text-xs sm:text-sm font-medium truncate">{shipment.shipperName}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="outline" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 border-2 shrink-0">
                <MoreVertical className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="border-2 border-border bg-popover z-50">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(shipment); }}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onFlag(shipment); }}>
                <Flag className={cn("h-4 w-4 mr-2", shipment.flagged && "fill-current")} />
                {shipment.flagged ? 'Unflag' : 'Flag'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={(e) => { e.stopPropagation(); onDelete(shipment); }}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-2 sm:p-4 pt-0 space-y-2 sm:space-y-3">
        {/* Status & Priority */}
        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
          <Badge 
            variant="outline" 
            className={cn("border-2 font-medium text-[10px] sm:text-xs", statusColors[shipment.status])}
          >
            {formatStatus(shipment.status)}
          </Badge>
          <Badge 
            variant="outline" 
            className={cn("border-2 font-medium text-[10px] sm:text-xs", priorityColors[shipment.priority])}
          >
            {formatPriority(shipment.priority)}
          </Badge>
        </div>

        {/* Route */}
        <div className="space-y-1 sm:space-y-2">
          <div className="flex items-start gap-1 sm:gap-2 text-xs sm:text-sm">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mt-0.5 text-chart-2 shrink-0" />
            <div className="min-w-0">
              <p className="font-medium truncate">{shipment.pickupLocation}</p>
              <p className="text-muted-foreground text-[10px] sm:text-xs">{shipment.pickupDate}</p>
            </div>
          </div>
          <div className="flex items-start gap-1 sm:gap-2 text-xs sm:text-sm">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mt-0.5 text-chart-1 shrink-0" />
            <div className="min-w-0">
              <p className="font-medium truncate">{shipment.deliveryLocation}</p>
              <p className="text-muted-foreground text-[10px] sm:text-xs">{shipment.deliveryDate}</p>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="flex items-center justify-between pt-1 sm:pt-2 border-t-2 border-border">
          <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
            <Truck className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="truncate max-w-[60px] sm:max-w-[100px]">{shipment.carrierName}</span>
          </div>
          <div className="flex items-center gap-1 font-bold text-xs sm:text-sm">
            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>{shipment.rate.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ShipmentTileGridProps {
  shipments: Shipment[];
  onSelect: (shipment: Shipment) => void;
  onEdit: (shipment: Shipment) => void;
  onFlag: (shipment: Shipment) => void;
  onDelete: (shipment: Shipment) => void;
}

import React from 'react';
export const ShipmentTileGrid = React.memo(function ShipmentTileGrid({ shipments, onSelect, onEdit, onFlag, onDelete }: ShipmentTileGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {shipments.map((shipment) => (
        <ShipmentTile
          key={shipment.id}
          shipment={shipment}
          onSelect={onSelect}
          onEdit={onEdit}
          onFlag={onFlag}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
});
