import { mockEquipment } from '@/data/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wrench, QrCode } from 'lucide-react';

export default function EquipmentPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Equipment Tracking</h1>
        <p className="text-muted-foreground text-sm mt-1">Monitor equipment assignment and availability</p>
      </div>

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
                {mockEquipment.map(eq => (
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
                      <Badge className={eq.status === 'available'
                        ? 'bg-success/15 text-success border-success/30'
                        : eq.status === 'in-use'
                        ? 'bg-info/15 text-info border-info/30'
                        : 'bg-warning/15 text-warning border-warning/30'
                      }>
                        {eq.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center" title="Digital Equipment Voucher">
                        <QrCode className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
