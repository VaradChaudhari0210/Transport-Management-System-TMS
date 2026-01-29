import { Card } from '@/components/ui/card';
import { MainLayout } from '@/components/layout/MainLayout';
import { Truck } from 'lucide-react';
import { carriers } from '@/data/carriers';

const Carriers = () => {
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-8 px-2 sm:px-6 md:px-8">
        <div className="flex items-center gap-3 mb-6">
          <Truck className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-extrabold tracking-tight">Carriers</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {carriers.map((carrier) => (
            <Card key={carrier.name} className="p-6 flex flex-col gap-3 shadow-md border-0 bg-gradient-to-br from-primary/5 to-secondary/10">
              <div className="flex items-center gap-2 mb-1">
                <Truck className="h-5 w-5 text-blue-600" />
                <span className="font-bold text-lg">{carrier.name}</span>
              </div>
              <span className="text-muted-foreground text-sm">Country: <span className="font-semibold text-foreground">{carrier.country}</span></span>
              <span className="text-muted-foreground text-sm">Founded: <span className="font-semibold text-foreground">{carrier.founded}</span></span>
              <span className="text-muted-foreground text-sm">Headquarters: <span className="font-semibold text-foreground">{carrier.headquarters}</span></span>
              <span className="text-muted-foreground text-sm">Phone: <span className="font-semibold text-foreground">{carrier.phone}</span></span>
              <span className="text-muted-foreground text-sm">{carrier.description}</span>
              <a href={carrier.website} target="_blank" rel="noopener noreferrer" className="text-primary underline text-sm mt-1">Visit Website</a>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Carriers;
