import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, BookOpen, Bell } from 'lucide-react';
import { mockTimetable, mockNotifications } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function LecturerDashboard() {
  const navigate = useNavigate();
  const todaySlots = mockTimetable.filter(s => s.day === 'Monday' && s.lecturer === 'Dr. Ochieng');
  const weekSlots = mockTimetable.filter(s => s.lecturer === 'Dr. Ochieng');

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">My Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Dr. Peter Ochieng — Computer Science</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Today's Classes", value: todaySlots.length, icon: Calendar, color: 'text-primary' },
          { label: 'Weekly Classes', value: weekSlots.length, icon: BookOpen, color: 'text-accent' },
          { label: 'Notifications', value: mockNotifications.filter(n => !n.read).length, icon: Bell, color: 'text-warning' },
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
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-heading">Today's Schedule</CardTitle>
            <Button variant="outline" size="sm" onClick={() => navigate('/timetable')}>Full Timetable</Button>
          </CardHeader>
          <CardContent>
            {todaySlots.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">No classes today</p>
            ) : (
              <div className="space-y-3">
                {todaySlots.map(s => (
                  <div key={s.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                    <div className="w-1 h-10 rounded-full bg-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{s.courseUnit} ({s.courseCode})</p>
                      <p className="text-xs text-muted-foreground">{s.timeSlot} • {s.venue} • {s.cohortSize} students</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-heading">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/makeup')}>
              <BookOpen className="w-4 h-4 mr-2" /> Book Makeup Class
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/notifications')}>
              <Bell className="w-4 h-4 mr-2" /> View Notifications
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
