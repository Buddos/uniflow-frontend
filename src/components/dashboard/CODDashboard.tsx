import { BookOpen, Plane, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockCourseRequests, mockTrips } from '@/services/api';
import { useNavigate } from 'react-router-dom';

const statusVariant: Record<string, string> = {
  pending: 'bg-warning/10 text-warning border-warning/20',
  accepted: 'bg-success/10 text-success border-success/20',
  rejected: 'bg-destructive/10 text-destructive border-destructive/20',
};

export function CODDashboard() {
  const navigate = useNavigate();
  const pending = mockCourseRequests.filter(r => r.status === 'pending');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Pending Requests', value: pending.length, icon: Clock, color: 'text-warning bg-warning/10' },
          { label: 'Accepted Requests', value: mockCourseRequests.filter(r => r.status === 'accepted').length, icon: CheckCircle, color: 'text-success bg-success/10' },
          { label: 'Upcoming Trips', value: mockTrips.filter(t => t.status === 'scheduled').length, icon: Plane, color: 'text-info bg-info/10' },
        ].map((s, i) => (
          <Card key={i} className="card-shadow border-0">
            <CardContent className="p-5 flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="font-display text-3xl font-bold mt-1">{s.value}</p>
              </div>
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="card-shadow border-0">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="font-display text-base flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" /> Course Requests
            </CardTitle>
            <button onClick={() => navigate('/course-requests')} className="text-xs text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </button>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockCourseRequests.slice(0, 4).map(r => (
              <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div>
                  <p className="text-sm font-medium">{r.courseUnit.code} — {r.courseUnit.name}</p>
                  <p className="text-xs text-muted-foreground">{r.cohortSize} students · {r.requestingDepartment}</p>
                </div>
                <Badge variant="outline" className={statusVariant[r.status]}>{r.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="card-shadow border-0">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base flex items-center gap-2">
              <Plane className="h-4 w-4 text-primary" /> Academic Trips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockTrips.map(t => (
              <div key={t.id} className="p-3 rounded-lg bg-muted/30">
                <p className="text-sm font-medium">{t.cohort}</p>
                <p className="text-xs text-muted-foreground">{t.courseUnit}</p>
                <p className="text-xs text-muted-foreground mt-1">{t.startDate} → {t.endDate} · {t.affectedSlots} slots affected</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
