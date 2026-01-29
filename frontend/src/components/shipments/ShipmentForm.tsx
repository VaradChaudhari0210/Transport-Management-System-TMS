import { useState } from 'react';
import { Shipment, ShipmentPriority, ShipmentStatus } from '@/types/shipment';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const statusOptions: ShipmentStatus[] = ['PENDING', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED', 'DELAYED'];
const priorityOptions: ShipmentPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

export interface ShipmentFormProps {
  initial?: Partial<Shipment>;
  onSubmit: (values: Omit<Shipment, 'id' | 'createdAt' | 'updatedAt' | 'trackingEvents' | 'createdBy' | 'updatedBy'>) => void;
  loading?: boolean;
  submitLabel?: string;
}

export function ShipmentForm({ initial = {}, onSubmit, loading, submitLabel = 'Save' }: ShipmentFormProps) {
  const [values, setValues] = useState({
    shipperName: initial.shipperName || '',
    carrierName: initial.carrierName || '',
    pickupLocation: initial.pickupLocation || '',
    pickupDate: initial.pickupDate || '',
    deliveryLocation: initial.deliveryLocation || '',
    deliveryDate: initial.deliveryDate || '',
    status: initial.status || 'PENDING',
    priority: initial.priority || 'MEDIUM',
    trackingNumber: initial.trackingNumber || '',
    rate: initial.rate || 0,
    weight: initial.weight || 0,
    dimensions: initial.dimensions || '',
    specialInstructions: initial.specialInstructions || '',
    flagged: initial.flagged || false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  return (
    <form
      className="space-y-3 sm:space-y-4"
      onSubmit={e => {
        e.preventDefault();
        onSubmit(values);
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
        <div>
          <label className="block mb-0.5 sm:mb-1 text-xs sm:text-sm font-medium">Shipper Name</label>
          <Input name="shipperName" value={values.shipperName} onChange={handleChange} required />
        </div>
        <div>
          <label className="block mb-0.5 sm:mb-1 text-xs sm:text-sm font-medium">Carrier Name</label>
          <Input name="carrierName" value={values.carrierName} onChange={handleChange} required />
        </div>
        <div>
          <label className="block mb-0.5 sm:mb-1 text-xs sm:text-sm font-medium">Pickup Location</label>
          <Input name="pickupLocation" value={values.pickupLocation} onChange={handleChange} required />
        </div>
        <div>
          <label className="block mb-0.5 sm:mb-1 text-xs sm:text-sm font-medium">Pickup Date</label>
          <Input name="pickupDate" type="date" value={values.pickupDate} onChange={handleChange} required />
        </div>
        <div>
          <label className="block mb-0.5 sm:mb-1 text-xs sm:text-sm font-medium">Delivery Location</label>
          <Input name="deliveryLocation" value={values.deliveryLocation} onChange={handleChange} required />
        </div>
        <div>
          <label className="block mb-0.5 sm:mb-1 text-xs sm:text-sm font-medium">Delivery Date</label>
          <Input name="deliveryDate" type="date" value={values.deliveryDate} onChange={handleChange} required />
        </div>
        <div>
          <label className="block mb-0.5 sm:mb-1 text-xs sm:text-sm font-medium">Status</label>
          <Select value={values.status} onValueChange={status => setValues(v => ({ ...v, status: status as ShipmentStatus }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(status => (
                <SelectItem key={status} value={status}>{status.replace('_', ' ')}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block mb-0.5 sm:mb-1 text-xs sm:text-sm font-medium">Priority</label>
          <Select value={values.priority} onValueChange={priority => setValues(v => ({ ...v, priority: priority as ShipmentPriority }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {priorityOptions.map(priority => (
                <SelectItem key={priority} value={priority}>{priority.charAt(0) + priority.slice(1).toLowerCase()}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block mb-0.5 sm:mb-1 text-xs sm:text-sm font-medium">Tracking Number</label>
          <Input name="trackingNumber" value={values.trackingNumber} onChange={handleChange} required />
        </div>
        <div>
          <label className="block mb-0.5 sm:mb-1 text-xs sm:text-sm font-medium">Rate</label>
          <Input name="rate" type="number" value={values.rate} onChange={handleChange} required min={0} />
        </div>
        <div>
          <label className="block mb-0.5 sm:mb-1 text-xs sm:text-sm font-medium">Weight</label>
          <Input name="weight" type="number" value={values.weight} onChange={handleChange} required min={0} />
        </div>
        <div>
          <label className="block mb-0.5 sm:mb-1 text-xs sm:text-sm font-medium">Dimensions</label>
          <Input name="dimensions" value={values.dimensions} onChange={handleChange} required />
        </div>
      </div>
      <div>
        <label className="block mb-0.5 sm:mb-1 text-xs sm:text-sm font-medium">Special Instructions</label>
        <Input name="specialInstructions" value={values.specialInstructions} onChange={handleChange} />
      </div>
      <div className="flex items-center gap-1 sm:gap-2">
        <input
          type="checkbox"
          id="flagged"
          checked={values.flagged}
          onChange={e => setValues(v => ({ ...v, flagged: e.target.checked }))}
        />
        <label htmlFor="flagged" className="font-medium">Flagged</label>
      </div>
      <Button type="submit" className="w-full h-9 sm:h-10 text-xs sm:text-sm" disabled={loading}>{submitLabel}</Button>
    </form>
  );
}
