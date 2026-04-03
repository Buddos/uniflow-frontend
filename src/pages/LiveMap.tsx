import { AppLayout } from '@/components/layout/AppLayout';
import { mockVenues } from '@/services/api';
import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { MapPin, Users, Monitor } from 'lucide-react';

export default function LiveMap() {
  const [liveMode, setLiveMode] = useState(false);
  const [venues, setVenues] = useState(mockVenues);

  // Simulate real-time toggle
  const toggleLive = (checked: boolean) => {
    setLiveMode(checked);
    if (checked) {
      const interval = setInterval(() => {
        setVenues(prev => prev.map(v => ({
          ...v,
          status: Math.random() > 0.5 ? 'available' : 'booked' as const,
        })));
      }, 3000);
      return () => clearInterval(interval);
    } else {
      setVenues(mockVenues);
    }
  };

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold">Live Venue Map</h1>
            <p className="text-sm text-muted-foreground mt-1">Real-time venue availability</p>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="live" className="text-sm text-muted-foreground">Live Simulation</Label>
            <Switch id="live" checked={liveMode} onCheckedChange={toggleLive} />
            {liveMode && <span className="h-2 w-2 rounded-full bg-success animate-pulse-dot" />}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {venues.map(v => (
            <div
              key={v.id}
              className={`rounded-xl p-4 border transition-all ${
                v.status === 'available'
                  ? 'border-success/30 bg-success/5'
                  : v.status === 'booked'
                  ? 'border-destructive/30 bg-destructive/5'
                  : 'border-warning/30 bg-warning/5'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-display font-bold text-lg">{v.name}</h3>
                <span className={`h-3 w-3 rounded-full ${
                  v.status === 'available' ? 'bg-success' : v.status === 'booked' ? 'bg-destructive' : 'bg-warning'
                } ${liveMode ? 'animate-pulse-dot' : ''}`} />
              </div>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <p className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /> {v.building}</p>
                <p className="flex items-center gap-1.5"><Users className="h-3 w-3" /> {v.capacity} seats</p>
                <p className="flex items-center gap-1.5"><Monitor className="h-3 w-3" /> {v.equipment.slice(0, 2).join(', ')}</p>
              </div>
              <p className={`mt-3 text-xs font-semibold capitalize ${
                v.status === 'available' ? 'text-success' : v.status === 'booked' ? 'text-destructive' : 'text-warning'
              }`}>
                {v.status}
              </p>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
