import { useState, useEffect } from 'react';
import { fetchVenues } from '@/services/api';
import { useRealtimeVenues } from '@/hooks/useRealtimeUpdates';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Building2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Venue } from '@/types';

export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [capacityFilter, setCapacityFilter] = useState('all');

  useEffect(() => {
    fetchVenues()
      .then(data => {
        setVenues(data);
        setError(null);
      })
      .catch(err => {
        console.error('Failed to fetch venues:', err.message);
        setError('Failed to load venues. Please try again later.');
      })
      .finally(() => setLoading(false));
  }, []);

  // Handle real-time venue updates
  useRealtimeVenues((message) => {
    const { operation, payload } = message;

    setVenues(currentVenues => {
      switch (operation) {
        case 'CREATE':
          return [...currentVenues, payload];
        case 'UPDATE':
          return currentVenues.map(venue =>
            venue.id === payload.id ? payload : venue
          );
        case 'DELETE':
          return currentVenues.filter(venue => venue.id !== payload.id);
        default:
          return currentVenues;
      }
    });
  });

  const filtered = venues.filter(v => {
    if (search && !v.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== 'all' && v.status !== statusFilter) return false;
    if (capacityFilter === 'small' && v.capacity > 150) return false;
    if (capacityFilter === 'medium' && (v.capacity <= 150 || v.capacity > 250)) return false;
    if (capacityFilter === 'large' && v.capacity <= 250) return false;
    return true;
  });

  const statusBadge = (status: string) => {
    if (status === 'available') return <Badge className="bg-success/15 text-success border-success/30">Available</Badge>;
    if (status === 'booked') return <Badge className="bg-destructive/15 text-destructive border-destructive/30">Booked</Badge>;
    return <Badge className="bg-warning/15 text-warning border-warning/30">Maintenance</Badge>;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Venue Management</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage and monitor all lecture halls</p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search venues..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="booked">Booked</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
        <Select value={capacityFilter} onValueChange={setCapacityFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Capacity" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sizes</SelectItem>
            <SelectItem value="small">≤150</SelectItem>
            <SelectItem value="medium">151-250</SelectItem>
            <SelectItem value="large">251+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="shadow-card overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-secondary/50">
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Venue</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Capacity</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Location</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Equipment</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-t border-border/50">
                      <td className="p-3"><Skeleton className="h-4 w-20" /></td>
                      <td className="p-3"><Skeleton className="h-4 w-12" /></td>
                      <td className="p-3"><Skeleton className="h-4 w-24" /></td>
                      <td className="p-3"><Skeleton className="h-4 w-32" /></td>
                      <td className="p-3"><Skeleton className="h-6 w-20" /></td>
                    </tr>
                  ))
                  : filtered.map(v => (
                    <tr key={v.id} className="border-t border-border/50 hover:bg-secondary/30 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium text-sm text-foreground">{v.name}</span>
                        </div>
                      </td>
                      <td className="p-3 text-sm text-foreground">{v.capacity}</td>
                      <td className="p-3 text-sm text-muted-foreground">{v.location}</td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {v.equipment.map(eq => (
                            <span key={eq} className="text-xs px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">{eq}</span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3">{statusBadge(v.status)}</td>
                    </tr>
                  ))}
                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-muted-foreground text-sm">No venues match your filters</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
