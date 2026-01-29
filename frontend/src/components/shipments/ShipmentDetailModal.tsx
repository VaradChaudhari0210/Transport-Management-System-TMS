import { Shipment, ShipmentStatus, ShipmentPriority } from '@/types/shipment';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, Truck, Package, Calendar, DollarSign, Scale, Ruler, 
  FileText, Flag, Clock, X, Edit, Printer, Share2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatStatus, formatPriority } from '@/lib/format';

interface ShipmentDetailModalProps {
  shipment: Shipment | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (shipment: Shipment) => void;
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

export function ShipmentDetailModal({ shipment, isOpen, onClose, onEdit }: ShipmentDetailModalProps) {
  if (!shipment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto border-4 border-border p-0 gap-0 w-[99vw] sm:w-full">
        {/* Header */}
        <DialogHeader className="p-2 sm:p-6 pb-2 sm:pb-4 border-b-4 border-border bg-muted/30">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <DialogTitle className="text-base sm:text-2xl font-bold font-mono">
                  {shipment.id}
                </DialogTitle>
                {shipment.flagged && (
                  <Flag className="h-5 w-5 text-destructive fill-destructive" />
                )}
              </div>
              <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                <Badge 
                  variant="outline" 
                  className={cn("border-2 font-medium text-[10px] sm:text-xs sm:text-sm", statusColors[shipment.status])}
                >
                  {formatStatus(shipment.status)}
                </Badge>
                <Badge 
                  variant="outline" 
                  className={cn("border-2 font-medium text-[10px] sm:text-xs sm:text-sm", priorityColors[shipment.priority])}
                >
                  {formatPriority(shipment.priority)} priority
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Button variant="outline" size="icon" className="border-2 h-7 w-7 sm:h-10 sm:w-10">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="border-2 h-7 w-7 sm:h-10 sm:w-10">
                <Printer className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="border-2 gap-1 sm:gap-2 h-8 sm:h-10 sm:px-4"
                onClick={() => onEdit(shipment)}
              >
                <Edit className="h-4 w-4" />
                <span className="hidden sm:inline">Edit</span>
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
          <div className="p-2 sm:p-6 space-y-4 sm:space-y-6">
          {/* Parties */}
          <div className="grid md:grid-cols-2 gap-3 sm:gap-6">
            <div className="space-y-1 sm:space-y-2">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-muted-foreground">Shipper</h3>
              <div className="p-2 sm:p-4 border-2 border-border bg-muted/20">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Package className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  <span className="font-medium text-xs sm:text-base">{shipment.shipperName}</span>
                </div>
              </div>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-muted-foreground">Carrier</h3>
              <div className="p-2 sm:p-4 border-2 border-border bg-muted/20">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  <span className="font-medium text-xs sm:text-base">{shipment.carrierName}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Route */}
          <div className="space-y-2 sm:space-y-4">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-muted-foreground">Route Details</h3>
            <div className="grid md:grid-cols-2 gap-2 sm:gap-4">
              <div className="p-2 sm:p-4 border-2 border-chart-2/50 bg-chart-2/5">
                <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-chart-2" />
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">Pickup</span>
                </div>
                <div className="space-y-1 ml-3 sm:ml-5">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                    <span className="font-medium text-xs sm:text-base">{shipment.pickupLocation}</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                    <span className="text-xs sm:text-sm text-muted-foreground">{shipment.pickupDate}</span>
                  </div>
                </div>
              </div>
              <div className="p-2 sm:p-4 border-2 border-chart-1/50 bg-chart-1/5">
                <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-chart-1" />
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">Delivery</span>
                </div>
                <div className="space-y-1 ml-3 sm:ml-5">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                    <span className="font-medium text-xs sm:text-base">{shipment.deliveryLocation}</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                    <span className="text-xs sm:text-sm text-muted-foreground">{shipment.deliveryDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shipment Details */}
          <div className="space-y-2 sm:space-y-4">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-muted-foreground">Shipment Details</h3>
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              <div className="p-2 sm:p-3 border-2 border-border text-center">
                <DollarSign className="h-4 w-4 sm:h-6 sm:w-6 mx-auto mb-1 sm:mb-2 text-muted-foreground" />
                <p className="text-base sm:text-2xl font-bold">${shipment.rate.toLocaleString()}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground uppercase">Rate</p>
              </div>
              <div className="p-2 sm:p-3 border-2 border-border text-center">
                <Scale className="h-4 w-4 sm:h-6 sm:w-6 mx-auto mb-1 sm:mb-2 text-muted-foreground" />
                <p className="text-base sm:text-2xl font-bold">{shipment.weight}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground uppercase">Weight (lbs)</p>
              </div>
              <div className="p-2 sm:p-3 border-2 border-border text-center">
                <Ruler className="h-4 w-4 sm:h-6 sm:w-6 mx-auto mb-1 sm:mb-2 text-muted-foreground" />
                <p className="text-xs sm:text-lg font-bold">{shipment.dimensions}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground uppercase">Dimensions</p>
              </div>
              <div className="p-2 sm:p-3 border-2 border-border text-center">
                <FileText className="h-4 w-4 sm:h-6 sm:w-6 mx-auto mb-1 sm:mb-2 text-muted-foreground" />
                <p className="text-[10px] sm:text-sm font-mono font-bold break-all">{shipment.trackingNumber}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground uppercase">Tracking #</p>
              </div>
            </div>
          </div>

          {/* Special Instructions */}
          {shipment.specialInstructions && (
            <div className="space-y-1 sm:space-y-2">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-muted-foreground">Special Instructions</h3>
              <div className="p-2 sm:p-4 border-2 border-chart-4/50 bg-chart-4/5">
                <p className="text-xs sm:text-sm">{shipment.specialInstructions}</p>
              </div>
            </div>
          )}

          {/* Tracking Events */}
          {shipment.trackingEvents && shipment.trackingEvents.length > 0 && (
            <div className="space-y-2 sm:space-y-4">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-muted-foreground">Tracking History</h3>
              <div className="border-2 border-border">
                <div className="divide-y-2 divide-border">
                  {shipment.trackingEvents.map((event, index) => (
                    <div key={event.id} className="p-2 sm:p-4 flex items-start gap-2 sm:gap-4">
                      <div className={cn(
                        "w-2 h-2 sm:w-3 sm:h-3 rounded-full mt-1.5 shrink-0",
                        index === 0 ? "bg-chart-2" : "bg-muted-foreground/30"
                      )} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 sm:gap-2">
                          <span className="font-medium text-xs sm:text-sm">{event.status}</span>
                          <span className="text-[10px] sm:text-xs text-muted-foreground font-mono">
                            {new Date(event.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground">{event.location}</p>
                        <p className="text-xs sm:text-sm mt-1">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0 pt-2 sm:pt-4 border-t-2 border-border text-[10px] sm:text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-2 w-2 sm:h-3 sm:w-3" />
              <span>Created: {new Date(shipment.createdAt).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-2 w-2 sm:h-3 sm:w-3" />
              <span>Updated: {new Date(shipment.updatedAt).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
