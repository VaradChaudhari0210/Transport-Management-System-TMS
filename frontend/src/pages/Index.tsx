import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { MainLayout } from '@/components/layout/MainLayout';
import { ShipmentGrid } from '@/components/shipments/ShipmentGrid';
import { ShipmentTileGrid } from '@/components/shipments/ShipmentTile';
import { ShipmentDetailModal } from '@/components/shipments/ShipmentDetailModal';
import { ShipmentToolbar } from '@/components/shipments/ShipmentToolbar';
import { GET_SHIPMENTS, GET_SHIPMENT, UPDATE_SHIPMENT, DELETE_SHIPMENT } from '@/graphql/queries';
import { Shipment, ViewMode, ShipmentStatus, ShipmentPriority } from '@/types/shipment';
import { useToast } from '@/hooks/use-toast';
import { Package, Loader2 } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<ViewMode>('tile');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ShipmentStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<ShipmentPriority | 'all'>('all');
  const [sortBy, setSortBy] = useState<keyof Shipment>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50;

  // Query for shipments list
  const { data, loading, error, refetch } = useQuery(GET_SHIPMENTS, {
    variables: {
      page: currentPage,
      limit: pageSize,
      filters: {
        status: statusFilter !== 'all' ? statusFilter : undefined,
        priority: priorityFilter !== 'all' ? priorityFilter : undefined,
        search: searchTerm || undefined,
      },
      sort: {
        field: sortBy,
        order: sortOrder.toUpperCase(),
      },
    },
    fetchPolicy: 'network-only',
  });

  // Query for selected shipment details
  const { data: shipmentData, loading: shipmentLoading } = useQuery(GET_SHIPMENT, {
    variables: { id: selectedShipmentId },
    skip: !selectedShipmentId,
    fetchPolicy: 'network-only',
  });

  // Mutations
  const [updateShipment] = useMutation(UPDATE_SHIPMENT);
  const [deleteShipment] = useMutation(DELETE_SHIPMENT);

  const shipments = useMemo(() => data?.shipments?.nodes || [], [data]);
  const pageInfo = data?.shipments?.pageInfo;
  const selectedShipment = shipmentData?.shipment || null;

  const handleSort = (column: keyof Shipment) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleEdit = (shipment: Shipment) => {
    navigate(`/shipments/${shipment.id}/edit`);
  };

  const handleFlag = async (shipment: Shipment) => {
    try {
      await updateShipment({
        variables: { 
          id: shipment.id,
          input: {
            flagged: !shipment.flagged
          }
        },
      });
      refetch();
      toast({
        title: shipment.flagged ? 'Shipment Unflagged' : 'Shipment Flagged',
        description: `${shipment.id} has been ${shipment.flagged ? 'unflagged' : 'flagged'}`,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to toggle flag',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (shipment: Shipment) => {
    try {
      await deleteShipment({
        variables: { id: shipment.id },
      });
      refetch();
      toast({
        title: 'Shipment Deleted',
        description: `${shipment.id} has been removed`,
        variant: 'destructive',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete shipment',
        variant: 'destructive',
      });
    }
  };

  const handleAddShipment = () => {
    navigate('/shipments/new');
  };

  if (error) {
    return (
      <MainLayout onAddShipment={handleAddShipment}>
        <div className="flex flex-col items-center justify-center py-16">
          <Package className="h-16 w-16 text-destructive mb-4" />
          <h3 className="text-xl font-bold mb-2">Error Loading Shipments</h3>
          <p className="text-muted-foreground text-center max-w-md mb-4">
            {error.message}
          </p>
          <button onClick={() => refetch()} className="px-4 py-2 bg-primary text-primary-foreground rounded">
            Retry
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout onAddShipment={handleAddShipment}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary flex items-center justify-center shadow-sm shrink-0">
            <Package className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Shipments</h1>
            <p className="text-muted-foreground text-sm sm:text-base truncate">Manage and track all your freight shipments</p>
          </div>
        </div>

        {/* Toolbar */}
        <ShipmentToolbar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={setPriorityFilter}
          totalCount={pageInfo?.totalCount || 0}
          filteredCount={shipments.length}
        />

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : shipments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 border-4 border-dashed border-border">
            <Package className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-bold mb-2">No Shipments Found</h3>
            <p className="text-muted-foreground text-center max-w-md">
              No shipments match your current filters. Try adjusting your search criteria or create a new shipment.
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <ShipmentGrid
            shipments={shipments}
            onSelect={(shipment) => setSelectedShipmentId(shipment.id)}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            onEdit={handleEdit}
          />
        ) : (
          <ShipmentTileGrid
            shipments={shipments}
            onSelect={(shipment) => setSelectedShipmentId(shipment.id)}
            onEdit={handleEdit}
            onFlag={handleFlag}
            onDelete={handleDelete}
          />
        )}

        {/* Detail Modal */}
        <ShipmentDetailModal
          shipment={selectedShipment}
          isOpen={!!selectedShipmentId}
          onClose={() => setSelectedShipmentId(null)}
          onEdit={handleEdit}
        />
      </div>
    </MainLayout>
  );
};

export default Index;
