import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { CREATE_SHIPMENT } from '@/graphql/queries';
import { ShipmentForm } from '@/components/shipments/ShipmentForm';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function CreateShipment() {
  const [createShipment, { loading }] = useMutation(CREATE_SHIPMENT);
  const navigate = useNavigate();
  const { toast } = useToast();

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center">Create Shipment</h2>
        </CardHeader>
        <CardContent>
          <ShipmentForm
            onSubmit={async (values) => {
              try {
                await createShipment({ variables: { input: values } });
                toast({ title: 'Shipment created successfully' });
                navigate('/');
              } catch (err: any) {
                toast({ title: 'Error', description: err.message, variant: 'destructive' });
              }
            }}
            loading={loading}
            submitLabel="Create"
          />
        </CardContent>
      </Card>
    </div>
  );
}
