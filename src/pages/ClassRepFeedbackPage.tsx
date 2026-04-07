import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchClassRepFeedback } from '@/services/api';
import { AlertTriangle, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import type { ClassRepFeedback } from '@/types';

export default function ClassRepFeedbackPage() {
  const [feedback, setFeedback] = useState<ClassRepFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all');

  useEffect(() => {
    fetchClassRepFeedback()
      .then(data => {
        setFeedback(data);
        setError(null);
      })
      .catch(err => {
        console.error('Failed to fetch feedback:', err.message);
        setError('Failed to load feedback. Please refresh the page.');
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredFeedback = feedback.filter(f => {
    if (filter === 'all') return true;
    return f.status === filter;
  });

  const getIssueIcon = (issue: string) => {
    switch (issue) {
      case 'overcrowding': return <AlertTriangle className="w-5 h-5 text-destructive" />;
      case 'equipment': return <AlertTriangle className="w-5 h-5 text-warning" />;
      case 'scheduling-conflict': return <Clock className="w-5 h-5 text-warning" />;
      default: return <AlertCircle className="w-5 h-5 text-info" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved': return <Badge className="bg-success">Resolved</Badge>;
      case 'dismissed': return <Badge variant="secondary">Dismissed</Badge>;
      default: return <Badge className="bg-warning">Open</Badge>;
    }
  };

  const getIssueBadge = (issue: string) => {
    const issueLabels: Record<string, string> = {
      'overcrowding': 'Overcrowding',
      'equipment': 'Equipment Failure',
      'wrong-venue': 'Wrong Venue',
      'scheduling-conflict': 'Schedule Conflict',
      'other': 'Other Issue'
    };
    return issueLabels[issue] || issue;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Class Representative Feedback</h1>
        <p className="text-muted-foreground text-sm mt-1">Monitor real-time classroom issues and timetabling adjustments</p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'open', 'resolved'] as const).map(f => (
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

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))
        ) : (
          <>
            <Card className="shadow-card">
              <CardContent className="pt-5">
                <p className="text-sm text-muted-foreground">Total Feedback</p>
                <p className="text-3xl font-bold mt-1">{feedback.length}</p>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardContent className="pt-5">
                <p className="text-sm text-muted-foreground">Open Issues</p>
                <p className="text-3xl font-bold text-warning mt-1">
                  {feedback.filter(f => f.status === 'open').length}
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardContent className="pt-5">
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="text-3xl font-bold text-success mt-1">
                  {feedback.filter(f => f.status === 'resolved').length}
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-heading">Feedback Items ({filteredFeedback.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : filteredFeedback.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No feedback matching the filter</p>
          ) : (
            <div className="space-y-3">
              {filteredFeedback.map(item => (
                <div key={item.id} className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-secondary/30 transition-colors">
                  <div className="mt-1">{getIssueIcon(item.issue)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-foreground">{item.courseUnit} ({item.courseCode})</h3>
                      <Badge variant="secondary">{getIssueBadge(item.issue)}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      From: {item.reportedBy} • Venue: {item.venue} • Date: {item.reportedDate}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(item.status)}
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
