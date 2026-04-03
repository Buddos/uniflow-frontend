import { Building, Users, AlertTriangle, CheckCircle, Calendar, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockVenues, mockCourseRequests, mockTimetable } from '@/services/api';
import { useNavigate } from 'react-router-dom';

const stats = [
  { label: 'Total Venues', value: mockVenues.length.toString(), icon: Building, change: '+2 this semester', color: 'text-primary bg-primary/10' },
  { label: 'Available Now', value: mockVenues.filter(v => v.status === 'available').length.toString(), icon: CheckCircle, change: 'Real-time', color: 'text-success bg-success/10' },
  { label: 'Booked', value: mockVenues.filter(v => v.status === 'booked').length.toString(), icon: Users, change: 'Currently occupied', color: 'text-warning bg-warning/10' },
  { label: 'Pending Requests', value: mockCourseRequests.filter(r => r.status === 'pending').length.toString(), icon: AlertTriangle, change: 'Needs action', color: 'text-destructive bg-destructive/10' },
];

export function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <Card key={i} className="card-shadow border-0 hover:elevated-shadow transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
                  <p className="font-display text-3xl font-bold text-foreground mt-1">{s.value}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">{s.change}</p>
                </div>
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${s.color}`}>
                  <s.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card className="card-shadow border-0">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { label: 'Generate Timetable', desc: 'Run allocation algorithm', action: () => navigate('/timetable') },
              { label: 'View Conflicts', desc: 'Check scheduling conflicts', action: () => navigate('/course-requests') },
              { label: 'Venue Status', desc: 'Live venue availability', action: () => navigate('/live-map') },
              { label: 'Equipment Audit', desc: 'Track equipment status', action: () => navigate('/equipment') },
            ].map((a, i) => (
              <button key={i} onClick={a.action} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group">
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground">{a.label}</p>
                  <p className="text-xs text-muted-foreground">{a.desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <Card className="card-shadow border-0">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Today's Schedule Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockTimetable.slice(0, 5).map((slot) => (
                <div key={slot.id} className={`p-3 rounded-lg text-xs ${slot.color}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{slot.courseUnit.code} — {slot.courseUnit.name}</p>
                      <p className="opacity-70 mt-0.5">{slot.lecturer} · {slot.venue.name}</p>
                    </div>
                    <span className="font-mono text-[11px]">{slot.startTime}–{slot.endTime}</span>
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
