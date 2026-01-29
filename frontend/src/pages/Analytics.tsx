import { useQuery } from '@apollo/client';
import { useUser } from '@/hooks/use-user';
import { Navigate } from 'react-router-dom';
import { GET_SHIPMENT_STATS } from '@/graphql/queries';
import { Card } from '@/components/ui/card';
import { MainLayout } from '@/components/layout/MainLayout';
import { Loader2, BarChart2, PieChart as PieIcon, TrendingUp } from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ChartTooltip, Legend, LineChart, Line, XAxis, YAxis
} from '@/components/ui/charts';

const Analytics = () => {
  const user = useUser();
  const { data, loading, error } = useQuery(GET_SHIPMENT_STATS);

  // DEBUG: Show user info for troubleshooting access issues
  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="p-8 text-sm text-red-600">
        <div>Access denied. Only admins can view analytics.</div>
        <div className="mt-2">Current user: {user ? JSON.stringify(user) : 'none'}</div>
        <div className="mt-2">Decoded role: {user?.role || 'none'}</div>
        <div className="mt-2">Try logging out and logging in as an admin. Your JWT may not have the correct role.</div>
        <div className="mt-2">If you need help, copy the above info and share it for debugging.</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <BarChart2 className="h-16 w-16 text-destructive mb-4" />
        <h3 className="text-xl font-bold mb-2">Error Loading Analytics</h3>
        <p className="text-muted-foreground text-center max-w-md mb-4">{error.message}</p>
      </div>
    );
  }

  const stats = data?.shipmentStats || {};

  // Colors for pie chart
  const pieColors = ['#2563eb', '#22c55e', '#f59e42', '#ef4444', '#a21caf'];
  const statusData = stats.byStatus?.map((s: any) => ({
    name: s.status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),
    value: s.count
  })) || [];

  // Fake time series for demo (replace with real data if available)
  const timeData = [
    { date: '2026-01-01', count: 5 },
    { date: '2026-01-05', count: 12 },
    { date: '2026-01-10', count: 18 },
    { date: '2026-01-15', count: 25 },
    { date: '2026-01-20', count: 32 },
    { date: '2026-01-25', count: 46 },
  ];

  return (
    <MainLayout>
      <div className="space-y-10 max-w-6xl mx-auto px-2 sm:px-6 md:px-8">
        <div className="flex items-center gap-3 mb-6">
          <BarChart2 className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-extrabold tracking-tight">Analytics</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 flex flex-col items-center bg-gradient-to-br from-primary/10 to-secondary/10 border-0 shadow-md">
            <span className="text-5xl font-extrabold text-primary">{stats.totalShipments ?? '-'}</span>
            <span className="text-muted-foreground mt-2 text-lg">Total Shipments</span>
          </Card>
          <Card className="p-6 flex flex-col items-center bg-gradient-to-br from-green-100/40 to-green-50/40 border-0 shadow-md">
            <span className="text-5xl font-extrabold text-green-600">${stats.totalRevenue?.toLocaleString() ?? '-'}</span>
            <span className="text-muted-foreground mt-2 text-lg">Total Revenue</span>
          </Card>
          <Card className="p-6 flex flex-col items-center bg-gradient-to-br from-blue-100/40 to-blue-50/40 border-0 shadow-md">
            <span className="text-5xl font-extrabold text-blue-600">{statusData.find(s => s.name === 'Delivered')?.value ?? '-'}</span>
            <span className="text-muted-foreground mt-2 text-lg">Delivered</span>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          <Card className="p-6 shadow-md border-0 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <PieIcon className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">Status Distribution</h2>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {statusData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={pieColors[idx % pieColors.length]} />
                  ))}
                </Pie>
                <ChartTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
          <Card className="p-6 shadow-md border-0 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">Shipments Over Time</h2>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={timeData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <ChartTooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Analytics;
