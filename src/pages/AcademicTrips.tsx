import { AppLayout } from '@/components/layout/AppLayout';
import { mockTrips } from '@/services/api';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Plane, Calendar, MapPin } from 'lucide-react';
import type { AcademicTrip } from '@/types';

const statusColors: Record<string, string> = {
  scheduled: 'bg-info/10 text-info border-info/20',
  completed: 'bg-success/10 text-success border-success/20',
  cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
};

export default function AcademicTrips() {
  const [trips] = useState<AcademicTrip[]>(mockTrips);
  const [open, setOpen] = useState(false);

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold">Academic Trips</h1>
            <p className="text-sm text-muted-foreground mt-1">Schedule trips and track affected timetable slots</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-primary-foreground">
                <Plus className="h-4 w-4 mr-2" /> Schedule Trip
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-display">Schedule Academic Trip</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label>Cohort</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select cohort" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agr3">BSc. Agriculture Y3</SelectItem>
                      <SelectItem value="eng4">BSc. Engineering Y4</SelectItem>
                      <SelectItem value="geo2">BA. Geography Y2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Destination</Label>
                  <Input placeholder="e.g., Naivasha Research Station" />
                </div>
                <Button className="w-full gradient-primary text-primary-foreground" onClick={() => setOpen(false)}>
                  Schedule Trip
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {trips.map(t => (
            <div key={t.id} className="bg-card rounded-xl card-shadow p-5">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-lg bg-info/10 flex items-center justify-center shrink-0">
                    <Plane className="h-5 w-5 text-info" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold">{t.cohort}</h3>
                    <p className="text-sm text-muted-foreground">{t.courseUnit}</p>
                    <div className="flex flex-wrap gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {t.startDate} → {t.endDate}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {t.destination}</span>
                    </div>
                    <p className="text-xs text-warning mt-2">{t.affectedSlots} timetable slots affected</p>
                  </div>
                </div>
                <Badge variant="outline" className={statusColors[t.status]}>{t.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
