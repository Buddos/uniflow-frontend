import { useState, useEffect } from 'react';
import { fetchEquipment } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Wrench, QrCode } from 'lucide-react';
import type { Equipment } from '@/types';

/** Map backend Equipment fields to the frontend Equipment type */
function mapEquipment(e: any): Equipment {
  return {
    id:            String(e.id),
    name:          e.name          ?? '—',
    type:          e.type          ?? e.category ?? '—',
    assignedVenue: e.currentVenue  ?? '—',
    resourceHome:  e.homeDepartment ?? '—',
    status:
      e.status === 'AVAILABLE'        ? 'available'    :
      e.status === 'IN_USE'           ? 'in-use'       :
      e.status === 'UNDER_MAINTENANCE'? 'maintenance'  : 'available',
  };
}

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);

  useEffect(() => {
    fetchEquipment()
      .then(data => setEquipment((data as any[]).map(mapEquipment)))
      .catch(err  => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const badgeClass = (status: Equipment['status']) => {
    if (status === 'available')   return 'bg-success/15 text-success border-success/30';
    if (status === 'in-use')      return 'bg-info/15 text-info border-info/30';
    return 'bg-warning/15 text-warning border-warning/30';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Equipment Tracking</h1>
        <p className="text-muted-foreground text-sm mt-1">Monitor equipment assignment and availability</p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Could not load equipment: {error}
        </div>
      )}

      <Card className="shadow-card overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-secondary/50">
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Equipment</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Type</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Assigned Venue</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Resource Home</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Status</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Voucher</th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-t border-border/50">
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="p-3"><Skeleton className="h-4 w-full" /></td>
                      ))}
                    </tr>
                  ))
                  : equipment.length === 0
                  ? (
                    <tr>
                      <td colSpan={6} className="p-10 text-center text-sm text-muted-foreground">
                        No equipment registered yet. Data is fetched from <strong>/api/equipment</strong>.
                      </td>
                    </tr>
                  )
                  : equipment.map(eq => (
                    <tr key={eq.id} className="border-t border-border/50 hover:bg-secondary/30 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Wrench className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">{eq.name}</span>
                        </div>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">{eq.type}</td>
                      <td className="p-3 text-sm text-foreground">{eq.assignedVenue}</td>
                      <td className="p-3 text-sm text-muted-foreground">{eq.resourceHome}</td>
                      <td className="p-3">
                        <Badge className={badgeClass(eq.status)}>{eq.status}</Badge>
                      </td>
                      <td className="p-3">
                        <div
                          className="w-8 h-8 rounded bg-secondary flex items-center justify-center"
                          title="Digital Equipment Voucher"
                        >
                          <QrCode className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
