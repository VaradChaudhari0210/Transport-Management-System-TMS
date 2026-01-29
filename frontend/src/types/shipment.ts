export type ShipmentStatus = 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED' | 'DELAYED';
export type ShipmentPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface TrackingEvent {
  id: string;
  timestamp: string;
  location: string;
  status: string;
  description: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'EMPLOYEE';
}

export interface Shipment {
  id: string;
  shipperName: string;
  carrierName: string;
  pickupLocation: string;
  pickupDate: string;
  deliveryLocation: string;
  deliveryDate: string;
  status: ShipmentStatus;
  priority: ShipmentPriority;
  trackingNumber: string;
  rate: number;
  weight: number;
  dimensions: string;
  specialInstructions?: string;
  flagged: boolean;
  createdAt: string;
  updatedAt: string;
  trackingEvents?: TrackingEvent[];
  createdBy?: User;
  updatedBy?: User;
}

export interface ShipmentFilters {
  status?: ShipmentStatus;
  priority?: ShipmentPriority;
  search?: string;
  flagged?: boolean;
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export interface ShipmentsResponse {
  nodes: Shipment[];
  pageInfo: PageInfo;
}

export type ViewMode = 'grid' | 'tile';
