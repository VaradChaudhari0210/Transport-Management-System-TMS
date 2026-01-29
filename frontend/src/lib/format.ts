import { ShipmentStatus, ShipmentPriority } from '@/types/shipment';

export function formatStatus(status: ShipmentStatus): string {
  return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
}

export function formatPriority(priority: ShipmentPriority): string {
  return priority.charAt(0) + priority.slice(1).toLowerCase();
}
