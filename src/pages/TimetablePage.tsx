import { useState } from 'react';
import { mockTimetable, days, timeSlots, departmentColors } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { TimetableSlot } from '@/types';

export default function TimetablePage() {
  const [selected, setSelected] = useState<TimetableSlot | null>(null);

  const getSlot = (day: string, time: string) =>
    mockTimetable.find(s => s.day === day && s.timeSlot === time);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Timetable</h1>
        <p className="text-muted-foreground text-sm mt-1">Weekly schedule overview — click a slot for details</p>
      </div>

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
                {timeSlots.map(time => (
                  <tr key={time} className="border-t border-border/50">
                    <td className="p-3 text-xs font-medium text-muted-foreground whitespace-nowrap">{time}</td>
                    {days.map(day => {
                      const slot = getSlot(day, time);
                      return (
                        <td key={day} className="p-1.5">
                          {slot ? (
                            <button
                              onClick={() => setSelected(slot)}
                              className={`w-full text-left p-2 rounded-md border text-xs transition-all hover:shadow-elevated ${departmentColors[slot.department] || 'bg-secondary text-secondary-foreground border-border'}`}
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
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(departmentColors).slice(0, 6).map(([dept, cls]) => (
          <span key={dept} className={`px-2 py-1 rounded text-xs border ${cls}`}>{dept}</span>
        ))}
      </div>

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
                <div><span className="text-muted-foreground">Lecturer:</span> <span className="font-medium">{selected.lecturer}</span></div>
                <div><span className="text-muted-foreground">Cohort:</span> <span className="font-medium">{selected.cohortSize} students</span></div>
                <div className="col-span-2"><span className="text-muted-foreground">Department:</span> <span className="font-medium">{selected.department}</span></div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
