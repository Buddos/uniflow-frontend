import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchCourseRequests } from '@/services/api';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { CourseRequest } from '@/types';

export default function ReviewCrossDepRequestsPage() {
  const [requests, setRequests] = useState<CourseRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');

  useEffect(() => {
    fetchCourseRequests()
      .then(data => {
        setRequests(data);
        setError(null);
      })
      .catch(err => {
        console.error('Failed to fetch requests:', err.message);
        setError('Failed to load requests. Please refresh the page.');
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredRequests = filter === 'all' 
    ? requests 
    : requests.filter(r => r.status === filter);

  const handleApprove = (id: string) => {
    // TODO: Call API to approve
    setRequests(prev => 
      prev.map(r => r.id === id ? { ...r, status: 'accepted' } : r)
    );
    toast.success('Request approved');
  };

  const handleReject = (id: string) => {
    // TODO: Call API to reject
    setRequests(prev => 
      prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r)
    );
    toast.success('Request rejected');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="w-5 h-5 text-success" />;
      case 'rejected': return <XCircle className="w-5 h-5 text-destructive" />;
      default: return <Clock className="w-5 h-5 text-warning" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Cross-Department Course Requests</h1>
        <p className="text-muted-foreground text-sm mt-1">Review and approve course requests from other departments</p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'pending', 'accepted', 'rejected'] as const).map(f => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(f)}
            className="capitalize"
          >
            {f}
          </Button>
        ))}
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-heading">Requests ({filteredRequests.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : filteredRequests.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No {filter !== 'all' ? filter : 'course'} requests</p>
          ) : (
            <div className="space-y-3">
              {filteredRequests.map(req => (
                <div key={req.id} className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-secondary/30 transition-colors">
                  <div className="mt-1">{getStatusIcon(req.status)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-foreground">{req.courseUnit}</h3>
                      <Badge variant="secondary">{req.courseCode}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {req.requestingDept} requesting from {req.providingDept}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Expected Students: {req.cohortSize} • Date: {req.requestDate}
                    </p>
                  </div>
                  {req.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="default"
                        onClick={() => handleApprove(req.id)}
                      >
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleReject(req.id)}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
