import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, BookOpen, Bell } from 'lucide-react';
import { fetchTimetable, fetchNotifications } from '@/services/api';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import type { TimetableSlot, Notification } from '@/types';

export function LecturerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [timetable, setTimetable] = useState<TimetableSlot[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchTimetable(), fetchNotifications()])
      .then(([timetableData, notificationsData]) => {
        setTimetable(timetableData);
        setNotifications(notificationsData);
        setError(null);
      })
      .catch(err => {
        console.error('Failed to fetch dashboard data:', err.message);
        // Check if it's a network/server error vs empty data
        if (err.message.includes('Failed to fetch') || err.message.includes('500') || err.message.includes('404')) {
          setError('Failed to load dashboard data. Please check your connection and try again.');
        } else {
          setError('Unable to load dashboard data at this time.');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const currentLecturerName = user?.name ?? 'Lecturer';
  const currentDepartment = user?.department ?? 'Academics';

  // Get today's day name (Monday, Tuesday, etc.)
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = days[new Date().getDay()];

  const todaySlots = timetable.filter(s => s.day === todayName && s.lecturer === currentLecturerName);
  const weekSlots = timetable.filter(s => s.lecturer === currentLecturerName);
  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">My Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">{currentLecturerName} — {currentDepartment}</p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {!loading && !error && timetable.length === 0 && notifications.length === 0 && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
          No timetable or notifications available yet. Information will appear here once your schedule and notifications are set up.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {loading ? (
          <>
            <Card className="shadow-card">
              <CardContent className="pt-5 pb-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-12" />
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardContent className="pt-5 pb-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-12" />
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardContent className="pt-5 pb-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-12" />
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          [
            { label: "Today's Classes", value: todaySlots.length, icon: Calendar, color: 'text-primary' },
            { label: 'Weekly Classes', value: weekSlots.length, icon: BookOpen, color: 'text-accent' },
            { label: 'Notifications', value: unreadNotifications, icon: Bell, color: 'text-warning' },
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
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-heading">Today's Schedule</CardTitle>
            <Button variant="outline" size="sm" onClick={() => navigate('/timetable')}>Full Timetable</Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-lg" />
                ))}
              </div>
            ) : todaySlots.length === 0 ? (
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
