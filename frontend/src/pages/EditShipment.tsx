import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_SHIPMENT, UPDATE_SHIPMENT } from '@/graphql/queries';
import { ShipmentForm } from '@/components/shipments/ShipmentForm';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function EditShipment() {
  const { id } = useParams<{ id: string }>();
  const { data, loading } = useQuery(GET_SHIPMENT, { variables: { id } });
  const [updateShipment, { loading: saving }] = useMutation(UPDATE_SHIPMENT);
  const navigate = useNavigate();
  const { toast } = useToast();

  if (loading) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
  if (!data?.shipment) return <div className="flex min-h-screen items-center justify-center">Shipment not found</div>;

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center">Edit Shipment</h2>
        </CardHeader>
        <CardContent>
          <ShipmentForm
            initial={data.shipment}
            onSubmit={async (values) => {
              try {
                await updateShipment({ variables: { id, input: values } });
                toast({ title: 'Shipment updated successfully' });
                navigate('/');
              } catch (err: any) {
                toast({ title: 'Error', description: err.message, variant: 'destructive' });
              }
            }}
            loading={saving}
            submitLabel="Update"
          />
        </CardContent>
      </Card>
    </div>
  );
}
