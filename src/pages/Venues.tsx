import { AppLayout } from '@/components/layout/AppLayout';
import { mockVenues } from '@/services/api';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Users, Monitor } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const statusColors: Record<string, string> = {
  available: 'bg-success/10 text-success border-success/20',
  booked: 'bg-destructive/10 text-destructive border-destructive/20',
  maintenance: 'bg-warning/10 text-warning border-warning/20',
};

export default function Venues() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = mockVenues.filter(v => {
    const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) || v.building.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || v.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold">Venue Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage lecture halls, capacity, and equipment</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search venues..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="booked">Booked</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-card rounded-xl card-shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/30">
                  {['Venue', 'Building', 'Capacity', 'Equipment', 'Resource Home', 'Status'].map(h => (
                    <th key={h} className="p-3 text-xs font-medium text-muted-foreground text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(v => (
                  <tr key={v.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="p-3">
                      <span className="text-sm font-semibold">{v.name}</span>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {v.building}
                    </td>
                    <td className="p-3 text-sm">
                      <span className="flex items-center gap-1"><Users className="h-3 w-3 text-muted-foreground" /> {v.capacity}</span>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {v.equipment.map(e => (
                          <Badge key={e} variant="outline" className="text-[10px] bg-muted/50">{e}</Badge>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 text-xs text-muted-foreground">{v.resourceHome}</td>
                    <td className="p-3">
                      <Badge variant="outline" className={statusColors[v.status]}>{v.status}</Badge>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="p-8 text-center text-sm text-muted-foreground">No venues match your search.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
