import { AppLayout } from '@/components/layout/AppLayout';
import { mockEquipment } from '@/services/api';
import { Badge } from '@/components/ui/badge';
import { Cpu, QrCode } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const statusColors: Record<string, string> = {
  'available': 'bg-success/10 text-success border-success/20',
  'in-use': 'bg-warning/10 text-warning border-warning/20',
  'maintenance': 'bg-destructive/10 text-destructive border-destructive/20',
};

export default function EquipmentPage() {
  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold">Equipment Tracking</h1>
          <p className="text-sm text-muted-foreground mt-1">Monitor equipment status and digital vouchers</p>
        </div>

        <div className="bg-card rounded-xl card-shadow overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                {['Equipment', 'Type', 'Assigned Hall', 'Resource Home', 'Status', 'Voucher'].map(h => (
                  <th key={h} className="p-3 text-xs font-medium text-muted-foreground text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockEquipment.map(e => (
                <tr key={e.id} className="border-b last:border-0 hover:bg-muted/20">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{e.name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-sm text-muted-foreground">{e.type}</td>
                  <td className="p-3 text-sm">{e.assignedHall}</td>
                  <td className="p-3 text-xs text-muted-foreground">{e.resourceHome}</td>
                  <td className="p-3">
                    <Badge variant="outline" className={statusColors[e.status]}>{e.status}</Badge>
                  </td>
                  <td className="p-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-primary">
                          <QrCode className="h-3 w-3 mr-1" /> View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-xs text-center">
                        <DialogHeader>
                          <DialogTitle className="font-display text-sm">Digital Equipment Voucher</DialogTitle>
                        </DialogHeader>
                        <div className="py-6">
                          <div className="mx-auto h-32 w-32 rounded-xl border-2 border-dashed border-primary/30 flex items-center justify-center bg-primary/5">
                            <QrCode className="h-16 w-16 text-primary/40" />
                          </div>
                          <p className="text-sm font-semibold mt-4">{e.name}</p>
                          <p className="text-xs text-muted-foreground">{e.assignedHall} → {e.resourceHome}</p>
                          <p className="text-[10px] text-muted-foreground mt-2">
                            {e.lastCheckedOut ? `Checked out: ${e.lastCheckedOut}` : 'Not currently checked out'}
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
