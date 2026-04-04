import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, CheckCircle, AlertTriangle, Clock, ClipboardList, ArrowRight } from 'lucide-react';
import { mockVenues, mockCourseRequests, mockDepartmentSubmissions } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

export function AdminDashboard() {
  const navigate = useNavigate();
  const totalVenues = mockVenues.length;
  const available = mockVenues.filter(v => v.status === 'available').length;
  const booked = mockVenues.filter(v => v.status === 'booked').length;
  const pending = mockCourseRequests.filter(r => r.status === 'pending').length;

  const submissions = mockDepartmentSubmissions;
  const submitted = submissions.filter(s => s.status === 'submitted' || s.status === 'consolidated');
  const drafts = submissions.filter(s => s.status === 'draft');
  const totalUnits = submissions.reduce((sum, s) => sum + s.courseUnits.length, 0);

  const stats = [
    { label: 'Total Venues', value: totalVenues, icon: Building2, color: 'text-primary' },
    { label: 'Available', value: available, icon: CheckCircle, color: 'text-success' },
    { label: 'Occupied', value: booked, icon: AlertTriangle, color: 'text-warning' },
    { label: 'COD Submissions', value: `${submitted.length}/${submissions.length}`, icon: ClipboardList, color: 'text-info' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Directorate of Examination & Timetabling</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.label} className="shadow-card">
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
        ))}
      </div>

      {/* COD Submissions Overview */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-heading">Department Submissions</CardTitle>
            <Button size="sm" variant="outline" onClick={() => navigate('/workflow')}>
              <ArrowRight className="w-3 h-3 mr-1" /> View Workflow
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">{totalUnits} course units across {submissions.length} departments</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary/50">
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground">Department</th>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground">COD</th>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground">Units</th>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground">Students</th>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground">Date</th>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map(s => (
                  <tr key={s.id} className="border-t border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="p-2 font-medium text-foreground">{s.department}</td>
                    <td className="p-2 text-muted-foreground">{s.submittedBy}</td>
                    <td className="p-2 text-foreground">{s.courseUnits.length}</td>
                    <td className="p-2 text-foreground">{s.courseUnits.reduce((a, u) => a + u.numberOfStudents, 0)}</td>
                    <td className="p-2 text-muted-foreground">{s.submittedDate || '—'}</td>
                    <td className="p-2">
                      <Badge variant={s.status === 'submitted' ? 'default' : 'secondary'}>
                        {s.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pending alert */}
      {drafts.length > 0 && (
        <Card className="shadow-card border-l-4 border-l-warning">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-warning shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {drafts.length} department(s) have not submitted requirements
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {drafts.map(d => d.department).join(', ')} — still in draft
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base font-heading">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/workflow')}>
              <ClipboardList className="w-4 h-4 mr-2" /> Consolidate & Generate Timetable
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/live-map')}>
              <Building2 className="w-4 h-4 mr-2" /> View Live Venue Map
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/course-requests')}>
              <Clock className="w-4 h-4 mr-2" /> Review Course Requests ({pending})
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base font-heading">Venue Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: 'Available', count: available, total: totalVenues, barClass: 'bg-success' },
                { label: 'Booked', count: booked, total: totalVenues, barClass: 'bg-warning' },
                { label: 'Maintenance', count: totalVenues - available - booked, total: totalVenues, barClass: 'bg-destructive' },
              ].map(b => (
                <div key={b.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{b.label}</span>
                    <span className="font-medium text-foreground">{b.count}/{b.total}</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className={`h-full ${b.barClass} rounded-full transition-all`} style={{ width: `${(b.count / b.total) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
