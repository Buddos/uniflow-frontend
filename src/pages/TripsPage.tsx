import { useState, useEffect } from 'react';
import { fetchTrips, createTrip } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Plane, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import type { AcademicTrip } from '@/types';

export default function TripsPage() {
  const [trips, setTrips] = useState<AcademicTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTrips()
      .then(data => {
        setTrips(data);
        setError(null);
      })
      .catch(err => {
        console.error('Failed to fetch trips:', err.message);
        setError('Failed to load academic trips. Please try again later.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData(e.currentTarget);
      const trip: Omit<AcademicTrip, 'id'> = {
        cohort: fd.get('cohort') as string,
        destination: fd.get('destination') as string,
        startDate: fd.get('startDate') as string,
        endDate: fd.get('endDate') as string,
        affectedSlots: [],
        department: fd.get('department') as string,
      };
      const newTrip = await createTrip(trip);
      setTrips(prev => [newTrip, ...prev]);
      setOpen(false);
      (e.target as HTMLFormElement).reset();
      toast.success('Academic trip scheduled. Affected venues will be released.');
    } catch (err) {
      console.error('Failed to create trip:', err);
      toast.error('Failed to schedule trip. Please try again.');
    } finally {
      setSubmitting(false);
    }
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
              <Button type="submit" className="w-full gradient-primary text-primary-foreground" disabled={submitting}>
                {submitting ? 'Scheduling...' : 'Schedule Trip'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-4">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="shadow-card">
              <CardContent className="pt-5 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <Skeleton className="w-10 h-10 rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-40 mt-2" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-24" />
                </div>
              </CardContent>
            </Card>
          ))
          : trips.map(t => (
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
        {!loading && trips.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Plane className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No academic trips scheduled</p>
          </div>
        )}
      </div>
    </div>
  );
}
