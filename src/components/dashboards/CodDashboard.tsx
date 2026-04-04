import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, CheckCircle, Clock, Plane } from 'lucide-react';
import { mockCourseRequests, mockTrips, mockNotifications } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';

export function CodDashboard() {
  const pending = mockCourseRequests.filter(r => r.status === 'pending').length;
  const accepted = mockCourseRequests.filter(r => r.status === 'accepted').length;
  const trips = mockTrips.length;
  const unread = mockNotifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">COD Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Department coordination overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pending Requests', value: pending, icon: Clock, color: 'text-warning' },
          { label: 'Accepted', value: accepted, icon: CheckCircle, color: 'text-success' },
          { label: 'Planned Trips', value: trips, icon: Plane, color: 'text-info' },
          { label: 'Unread Alerts', value: unread, icon: FileText, color: 'text-destructive' },
        ].map(s => (
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base font-heading">Recent Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockCourseRequests.map(r => (
                <div key={r.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{r.courseUnit}</p>
                    <p className="text-xs text-muted-foreground">{r.requestingDept} → {r.providingDept} • {r.cohortSize} students</p>
                  </div>
                  <Badge variant={r.status === 'accepted' ? 'default' : r.status === 'pending' ? 'secondary' : 'destructive'}>
                    {r.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base font-heading">Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockNotifications.slice(0, 4).map(n => (
                <div key={n.id} className={`py-2 border-b border-border/50 last:border-0 ${!n.read ? 'pl-2 border-l-2 border-l-primary' : ''}`}>
                  <p className="text-sm font-medium text-foreground">{n.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
