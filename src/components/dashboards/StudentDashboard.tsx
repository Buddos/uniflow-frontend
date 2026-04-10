import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, MapPinned, Bell, GraduationCap } from 'lucide-react';
import { fetchNotifications, fetchTimetable, fetchTrips } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import type { TimetableSlot, Notification, AcademicTrip } from '@/types';

export function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [timetable, setTimetable] = useState<TimetableSlot[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [trips, setTrips] = useState<AcademicTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchTimetable(), fetchNotifications(), fetchTrips()])
      .then(([timetableData, notificationsData, tripsData]) => {
        setTimetable(timetableData);
        setNotifications(notificationsData);
        setTrips(tripsData);
        setError(null);
      })
      .catch(() => {
        setError('Failed to load student dashboard data. Please try again later.');
      })
      .finally(() => setLoading(false));
  }, []);

  const currentDepartment = user?.department ?? '';
  const studentName = user?.name ?? 'Student';

  const enrolledUnits = useMemo(() => {
    if (!currentDepartment) return timetable;
    return timetable.filter(slot => slot.department === currentDepartment);
  }, [currentDepartment, timetable]);

  const departmentTrips = useMemo(() => {
    if (!currentDepartment) return trips;
    return trips.filter(trip => trip.department === currentDepartment);
  }, [currentDepartment, trips]);

  const scheduleNotices = notifications.filter(notification =>
    notification.type === 'schedule' || /makeup|trip/i.test(`${notification.title} ${notification.message}`)
  );

  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayClasses = enrolledUnits.filter(slot => slot.day === todayName);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Student Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {studentName}{currentDepartment ? ` — ${currentDepartment}` : ''}
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20" />)
        ) : (
          <>
            <Card className="shadow-card">
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Enrolled Units</p>
                    <p className="text-3xl font-heading font-bold text-foreground mt-1">{enrolledUnits.length}</p>
                  </div>
                  <GraduationCap className="w-10 h-10 text-primary opacity-80" />
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Today&apos;s Classes</p>
                    <p className="text-3xl font-heading font-bold text-foreground mt-1">{todayClasses.length}</p>
                  </div>
                  <Calendar className="w-10 h-10 text-info opacity-80" />
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Schedule Notices</p>
                    <p className="text-3xl font-heading font-bold text-foreground mt-1">{scheduleNotices.length}</p>
                  </div>
                  <Bell className="w-10 h-10 text-warning opacity-80" />
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base font-heading">Personal Schedule</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Read-only view of your enrolled units and timetable</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/timetable')}>
            View Live Timetable
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}
            </div>
          ) : enrolledUnits.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No enrolled units available yet.</p>
          ) : (
            <div className="space-y-3">
              {enrolledUnits.slice(0, 8).map(slot => (
                <div key={slot.id} className="flex items-center justify-between gap-4 rounded-lg border border-border/60 p-3 bg-secondary/20">
                  <div>
                    <p className="font-medium text-foreground">{slot.courseUnit} ({slot.courseCode})</p>
                    <p className="text-xs text-muted-foreground">{slot.day} • {slot.timeSlot} • {slot.venue}</p>
                  </div>
                  <Badge variant="secondary">{slot.department}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base font-heading flex items-center gap-2">
              <MapPinned className="w-4 h-4" /> Academic Trips
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
              </div>
            ) : departmentTrips.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No trips affecting your department yet.</p>
            ) : (
              <div className="space-y-3">
                {departmentTrips.map(trip => (
                  <div key={trip.id} className="rounded-lg border border-border/60 p-3">
                    <p className="font-medium text-foreground">{trip.cohort}</p>
                    <p className="text-sm text-muted-foreground">{trip.destination}</p>
                    <p className="text-xs text-muted-foreground mt-1">{trip.startDate} — {trip.endDate}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base font-heading">Schedule Notices</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : scheduleNotices.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No schedule notices at the moment.</p>
            ) : (
              <div className="space-y-3">
                {scheduleNotices.slice(0, 4).map(notification => (
                  <div key={notification.id} className="rounded-lg border border-border/60 p-3 bg-secondary/20">
                    <p className="font-medium text-foreground">{notification.title}</p>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}