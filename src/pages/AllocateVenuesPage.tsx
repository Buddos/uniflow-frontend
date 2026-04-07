import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchDepartmentSubmissions, fetchVenues } from '@/services/api';
import { Building2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { DepartmentSubmission, Venue } from '@/types';

export default function AllocateVenuesPage() {
  const [submissions, setSubmissions] = useState<DepartmentSubmission[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allocations, setAllocations] = useState<Record<string, string>>({});

  useEffect(() => {
    Promise.all([
      fetchDepartmentSubmissions(),
      fetchVenues()
    ])
      .then(([subsData, venuesData]) => {
        setSubmissions(subsData.filter(s => s.status === 'consolidated'));
        setVenues(venuesData);
        setError(null);
      })
      .catch(err => {
        console.error('Failed to fetch data:', err.message);
        setError('Failed to load data. Please refresh the page.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleVenueSelect = (unitId: string, venueId: string) => {
    setAllocations(prev => ({ ...prev, [unitId]: venueId }));
  };

  const handleAllocate = () => {
    if (Object.keys(allocations).length === 0) {
      toast.error('Please allocate venues for at least one course unit');
      return;
    }
    // TODO: Call API to save allocations
    toast.success(`Allocated venues for ${Object.keys(allocations).length} course units`);
    setAllocations({});
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Allocate Venues</h1>
        <p className="text-muted-foreground text-sm mt-1">Assign venues to consolidated course units based on capacity and requirements</p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-heading">Course Units Requiring Venues</CardTitle>
            <Button 
              onClick={handleAllocate}
              disabled={Object.keys(allocations).length === 0}
            >
              Save Allocations ({Object.keys(allocations).length})
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : submissions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No consolidated submissions awaiting venue allocation</p>
          ) : (
            <div className="space-y-4">
              {submissions.map(sub =>
                sub.courseUnits.map(unit => (
                  <div key={unit.id} className="flex items-center gap-4 p-4 rounded-lg border border-border">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{unit.courseUnit}</h3>
                      <p className="text-sm text-muted-foreground">
                        {unit.courseCode} • {unit.numberOfStudents} students • {sub.department}
                      </p>
                      {unit.specialNeeds && (
                        <p className="text-xs text-warning mt-1">📌 Special needs: {unit.specialNeeds}</p>
                      )}
                    </div>
                    <Select 
                      value={allocations[unit.id] || ''}
                      onValueChange={(venueId) => handleVenueSelect(unit.id, venueId)}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select venue..." />
                      </SelectTrigger>
                      <SelectContent>
                        {venues
                          .filter(v => v.capacity >= unit.numberOfStudents)
                          .map(v => (
                            <SelectItem key={v.id} value={v.id}>
                              {v.name} ({v.capacity} capacity)
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
