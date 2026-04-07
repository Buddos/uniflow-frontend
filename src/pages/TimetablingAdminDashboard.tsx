import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, CheckCircle, Clock, AlertTriangle, Building2 } from 'lucide-react';
import { fetchDepartmentSubmissions, fetchCourseRequests, fetchClassRepFeedback } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import type { DepartmentSubmission, CourseRequest, ClassRepFeedback } from '@/types';

export function TimetablingAdminDashboard() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<DepartmentSubmission[]>([]);
  const [courseRequests, setCourseRequests] = useState<CourseRequest[]>([]);
  const [feedback, setFeedback] = useState<ClassRepFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetchDepartmentSubmissions(),
      fetchCourseRequests(),
      fetchClassRepFeedback()
    ])
      .then(([submissionsData, requestsData, feedbackData]) => {
        setSubmissions(submissionsData);
        setCourseRequests(requestsData);
        setFeedback(feedbackData);
        setError(null);
      })
      .catch(err => {
        console.error('Failed to fetch dashboard data:', err.message);
        // Check if it's a network/server error vs empty data
        if (err.message.includes('Failed to fetch') || err.message.includes('500') || err.message.includes('404')) {
          setError('Failed to load dashboard data. Please refresh the page and try again.');
        } else {
          setError('Unable to load dashboard data at this time.');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const submitted = submissions.filter(s => s.status === 'submitted').length;
  const consolidated = submissions.filter(s => s.status === 'consolidated').length;
  const crossDeptRequests = courseRequests.filter(r => r.status === 'pending').length;
  const urgentFeedback = feedback.filter(f => f.priority === 'urgent').length;

  const stats = [
    { label: 'Pending Submissions', value: submitted, icon: Clock, color: 'text-warning', action: '/timetabling-admin/consolidate' },
    { label: 'Consolidated', value: consolidated, icon: CheckCircle, color: 'text-success', action: '/timetabling-admin/consolidate' },
    { label: 'Cross-Dept Requests', value: crossDeptRequests, icon: FileText, color: 'text-info', action: '/timetabling-admin/requests' },
    { label: 'Urgent Feedback', value: urgentFeedback, icon: AlertTriangle, color: 'text-destructive', action: '/timetabling-admin/feedback' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Timetabling Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage semester workflow, consolidate submissions & allocate venues</p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {!loading && !error && submissions.length === 0 && courseRequests.length === 0 && feedback.length === 0 && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
          No data available yet. Dashboard information will appear here once department submissions, course requests, and feedback are added.
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="shadow-card">
              <CardContent className="pt-5 pb-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </CardContent>
            </Card>
          ))
          : stats.map(s => (
            <Card key={s.label} className="shadow-card cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate(s.action)}>
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                    <p className="text-3xl font-heading font-bold text-foreground mt-1">{s.value}</p>
                  </div>
                  <s.icon className={`w-10 h-10 ${s.color} opacity-80`} />
                </div>
              </CardContent>
            </Card>
          ))
        }
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base font-heading">Recent Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-lg" />
                ))}
              </div>
            ) : submissions.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">No submissions yet</p>
            ) : (
              <div className="space-y-2">
                {submissions.slice(0, 5).map(sub => (
                  <div key={sub.id} className="flex items-center justify-between p-2 rounded-lg bg-secondary/50">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{sub.department}</p>
                      <p className="text-xs text-muted-foreground">{sub.courseUnits.length} course units</p>
                    </div>
                    <Badge variant={sub.status === 'consolidated' ? 'default' : 'secondary'}>
                      {sub.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base font-heading">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/timetabling-admin/consolidate')}>
              <FileText className="w-4 h-4 mr-2" /> Consolidate Submissions
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/timetabling-admin/requests')}>
              <Building2 className="w-4 h-4 mr-2" /> Review Cross-Dept Requests
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/timetabling-admin/allocate-venues')}>
              <Building2 className="w-4 h-4 mr-2" /> Allocate Venues
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/timetabling-admin/feedback')}>
              <AlertTriangle className="w-4 h-4 mr-2" /> View Class Rep Feedback
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default TimetablingAdminDashboard;
