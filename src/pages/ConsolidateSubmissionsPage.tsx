import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchDepartmentSubmissions } from '@/services/api';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { DepartmentSubmission } from '@/types';

export default function ConsolidateSubmissionsPage() {
  const [submissions, setSubmissions] = useState<DepartmentSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([]);

  useEffect(() => {
    fetchDepartmentSubmissions()
      .then(data => {
        setSubmissions(data.filter(s => s.status === 'submitted'));
        setError(null);
      })
      .catch(err => {
        console.error('Failed to fetch submissions:', err.message);
        setError('Failed to load submissions. Please refresh the page.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSelectSubmission = (id: string) => {
    setSelectedSubmissions(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleConsolidate = () => {
    if (selectedSubmissions.length === 0) {
      toast.error('Please select at least one submission to consolidate');
      return;
    }
    // TODO: Call consolidation API
    toast.success(`Consolidated ${selectedSubmissions.length} submissions`);
    setSelectedSubmissions([]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Consolidate Department Submissions</h1>
        <p className="text-muted-foreground text-sm mt-1">Review and consolidate all submitted course requirements before venue allocation</p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-heading">Submitted Requirements</CardTitle>
            <Button 
              onClick={handleConsolidate} 
              disabled={selectedSubmissions.length === 0}
              variant="default"
            >
              Consolidate ({selectedSubmissions.length})
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : submissions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No submitted requirements yet</p>
          ) : (
            <div className="space-y-3">
              {submissions.map(sub => (
                <div key={sub.id} className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-secondary/30 transition-colors">
                  <Checkbox
                    checked={selectedSubmissions.includes(sub.id)}
                    onCheckedChange={() => handleSelectSubmission(sub.id)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-foreground">{sub.department}</h3>
                      <Badge variant="outline">{sub.courseUnits.length} units</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Submitted by: {sub.submittedBy}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Total Students: {sub.courseUnits.reduce((sum, u) => sum + u.numberOfStudents, 0)}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {sub.courseUnits.slice(0, 3).map(unit => (
                        <Badge key={unit.id} variant="secondary" className="text-xs">
                          {unit.courseCode} ({unit.numberOfStudents}s)
                        </Badge>
                      ))}
                      {sub.courseUnits.length > 3 && (
                        <Badge variant="secondary" className="text-xs">+{sub.courseUnits.length - 3} more</Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
