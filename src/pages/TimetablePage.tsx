import { useState, useEffect } from 'react';
import { fetchTimetable } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import type { TimetableSlot } from '@/types';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const timeSlots = ['7:00-9:00', '9:00-11:00', '11:00-13:00', '14:00-16:00', '16:00-18:00'];

const departmentColors: Record<string, string> = {
  'Computer Science': 'bg-blue-50 text-blue-800 border-blue-200',
  'Mathematics':      'bg-green-50 text-green-800 border-green-200',
  'Physics':          'bg-yellow-50 text-yellow-800 border-yellow-200',
  'Engineering':      'bg-red-50 text-red-800 border-red-200',
  'Business':         'bg-purple-50 text-purple-800 border-purple-200',
};

/** Map a backend TimetableEntry (from /api/timetable) into TimetableSlot shape */
function mapEntry(e: any): TimetableSlot {
  // dayOfWeek comes as "MONDAY" — normalise to "Monday"
  const rawDay = (e.dayOfWeek || '').charAt(0).toUpperCase() + (e.dayOfWeek || '').slice(1).toLowerCase();
  const startHour = e.startTime ? parseInt((e.startTime as string).split(':')[0]) : -1;
  const endHour   = e.endTime   ? parseInt((e.endTime   as string).split(':')[0]) : startHour + 2;
  const timeSlot  = `${startHour}:00-${endHour}:00`;
  return {
    id:         String(e.id),
    day:        rawDay,
    timeSlot,
    courseUnit: e.courseUnit?.name  ?? 'Session',
    courseCode: e.courseUnit?.code  ?? '',
    venue:      e.venue?.name       ?? '',
    lecturer:   e.lecturer?.name    ?? '',
    department: e.courseUnit?.department ?? '',
    cohortSize: e.expectedStudents  ?? 0,
  };
}

export default function TimetablePage() {
  const [slots, setSlots]     = useState<TimetableSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [selected, setSelected] = useState<TimetableSlot | null>(null);

  useEffect(() => {
    fetchTimetable()
      .then(data => setSlots((data as any[]).map(mapEntry)))
      .catch(err  => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const getSlot = (day: string, time: string) =>
    slots.find(s => s.day === day && s.timeSlot === time);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Timetable</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Weekly schedule overview — click a slot for details
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Could not load timetable: {error}
        </div>
      )}

      <Card className="shadow-card overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="bg-secondary/50">
                  <th className="text-left text-xs font-medium text-muted-foreground p-3 w-24">Time</th>
                  {days.map(d => (
                    <th key={d} className="text-left text-xs font-medium text-muted-foreground p-3">{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-t border-border/50">
                      <td className="p-3"><Skeleton className="h-4 w-20" /></td>
                      {days.map(d => (
                        <td key={d} className="p-1.5"><Skeleton className="h-16 w-full rounded-md" /></td>
                      ))}
                    </tr>
                  ))
                  : timeSlots.map(time => (
                    <tr key={time} className="border-t border-border/50">
                      <td className="p-3 text-xs font-medium text-muted-foreground whitespace-nowrap">{time}</td>
                      {days.map(day => {
                        const slot = getSlot(day, time);
                        return (
                          <td key={day} className="p-1.5">
                            {slot ? (
                              <button
                                onClick={() => setSelected(slot)}
                                className={`w-full text-left p-2 rounded-md border text-xs transition-all hover:shadow-elevated
                                  ${departmentColors[slot.department] ?? 'bg-secondary text-secondary-foreground border-border'}`}
                              >
                                <p className="font-semibold truncate">{slot.courseCode}</p>
                                <p className="truncate opacity-80">{slot.courseUnit}</p>
                                <p className="opacity-60 mt-0.5">{slot.venue}</p>
                              </button>
                            ) : (
                              <div className="h-16 rounded-md bg-secondary/30" />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(departmentColors).map(([dept, cls]) => (
          <span key={dept} className={`px-2 py-1 rounded text-xs border ${cls}`}>{dept}</span>
        ))}
      </div>

      {/* Slot detail dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading">{selected?.courseUnit}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div><span className="text-muted-foreground">Code:</span> <span className="font-medium">{selected.courseCode}</span></div>
                <div><span className="text-muted-foreground">Day:</span> <span className="font-medium">{selected.day}</span></div>
                <div><span className="text-muted-foreground">Time:</span> <span className="font-medium">{selected.timeSlot}</span></div>
                <div><span className="text-muted-foreground">Venue:</span> <span className="font-medium">{selected.venue}</span></div>
                <div><span className="text-muted-foreground">Lecturer:</span> <span className="font-medium">{selected.lecturer || '—'}</span></div>
                <div><span className="text-muted-foreground">Cohort:</span> <span className="font-medium">{selected.cohortSize} students</span></div>
                <div className="col-span-2"><span className="text-muted-foreground">Department:</span> <span className="font-medium">{selected.department || '—'}</span></div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
