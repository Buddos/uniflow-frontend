import { useState, useEffect } from 'react';
import { fetchVenues } from '@/services/api';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import type { Venue } from '@/types';

export default function LiveMapPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [simulate, setSimulate] = useState(false);

  useEffect(() => {
    fetchVenues()
      .then(data => {
        setVenues(data);
        setError(null);
      })
      .catch(err => {
        console.error('Failed to fetch venues:', err.message);
        setError('Failed to load venues');
      })
      .finally(() => setLoading(false));
  }, []);

  const displayVenues = venues.map(v => {
    if (!simulate) return v;
    // Toggle some statuses for demo
    const rand = Math.random();
    return { ...v, status: rand > 0.6 ? 'booked' as const : 'available' as const };
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Live Venue Map</h1>
          <p className="text-muted-foreground text-sm mt-1">Real-time venue availability overview</p>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="simulate" checked={simulate} onCheckedChange={setSimulate} disabled={loading} />
          <Label htmlFor="simulate" className="text-sm text-muted-foreground">Simulate Live Updates</Label>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Group by location */}
      {['Block A', 'Block B', 'Main Campus', 'Education Block'].map(loc => {
        const locVenues = displayVenues.filter(v => v.location === loc);
        if (locVenues.length === 0) return null;
        return (
          <div key={loc}>
            <h2 className="text-sm font-heading font-semibold text-muted-foreground mb-3">{loc}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 rounded-lg" />
                ))
                : locVenues.map(v => (
                  <div
                    key={v.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      v.status === 'available'
                        ? 'border-success/40 bg-success/5'
                        : v.status === 'booked'
                        ? 'border-destructive/40 bg-destructive/5'
                        : 'border-warning/40 bg-warning/5'
                    }`}
                  >
                    <p className="font-heading font-bold text-foreground">{v.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{v.capacity} seats</p>
                    <div className="mt-2 flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${
                      v.status === 'available' ? 'bg-success' : v.status === 'booked' ? 'bg-destructive' : 'bg-warning'
                    }`} />
                    <span className="text-xs capitalize text-muted-foreground">{v.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <div className="flex gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-success" /> Available</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-destructive" /> Occupied</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-warning" /> Maintenance</span>
      </div>
    </div>
  );
}
