import { useState } from 'react';
import { mockTrips } from '@/data/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Plane, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import type { AcademicTrip } from '@/types';

export default function TripsPage() {
  const [trips, setTrips] = useState<AcademicTrip[]>(mockTrips);
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const trip: AcademicTrip = {
      id: Date.now().toString(),
      cohort: fd.get('cohort') as string,
      destination: fd.get('destination') as string,
      startDate: fd.get('startDate') as string,
      endDate: fd.get('endDate') as string,
      affectedSlots: [],
      department: fd.get('department') as string,
    };
    setTrips(prev => [trip, ...prev]);
    setOpen(false);
    toast.success('Academic trip scheduled. Affected venues will be released.');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Academic Trips</h1>
          <p className="text-muted-foreground text-sm mt-1">Schedule trips and auto-release affected venues</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground"><Plus className="w-4 h-4 mr-2" /> Schedule Trip</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-heading">Schedule Academic Trip</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label>Cohort</Label>
                <Input name="cohort" required placeholder="e.g. BSc. Agriculture Y3" />
              </div>
              <div className="space-y-1">
                <Label>Destination</Label>
                <Input name="destination" required placeholder="e.g. KARI Research Station" />
              </div>
              <div className="space-y-1">
                <Label>Department</Label>
                <Input name="department" required placeholder="e.g. Agriculture" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Start Date</Label>
                  <Input name="startDate" type="date" required />
                </div>
                <div className="space-y-1">
                  <Label>End Date</Label>
                  <Input name="endDate" type="date" required />
                </div>
              </div>
              <Button type="submit" className="w-full gradient-primary text-primary-foreground">Schedule Trip</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {trips.map(t => (
          <Card key={t.id} className="shadow-card">
            <CardContent className="pt-5 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center shrink-0">
                    <Plane className="w-5 h-5 text-info" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{t.cohort}</p>
                    <p className="text-sm text-muted-foreground">{t.destination}</p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {t.startDate} — {t.endDate}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">{t.department}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
        {trips.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Plane className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No academic trips scheduled</p>
          </div>
        )}
      </div>
    </div>
  );
}
