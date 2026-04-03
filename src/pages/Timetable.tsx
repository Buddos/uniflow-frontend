import { AppLayout } from '@/components/layout/AppLayout';
import { mockTimetable } from '@/services/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';
import type { TimetableSlot } from '@/types';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const timeSlots = ['08:00', '10:00', '12:00', '14:00', '16:00'];

export default function Timetable() {
  const [selected, setSelected] = useState<TimetableSlot | null>(null);

  const getSlot = (day: string, time: string) =>
    mockTimetable.find(s => s.day === day && s.startTime === time);

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold">Timetable</h1>
          <p className="text-sm text-muted-foreground mt-1">Interactive weekly schedule — click any slot for details</p>
        </div>

        <div className="bg-card rounded-xl card-shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b">
                  <th className="p-3 text-xs font-medium text-muted-foreground text-left w-20">Time</th>
                  {days.map(d => (
                    <th key={d} className="p-3 text-xs font-medium text-muted-foreground text-center">{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map(time => (
                  <tr key={time} className="border-b last:border-0">
                    <td className="p-3 text-xs font-mono text-muted-foreground align-top">{time}</td>
                    {days.map(day => {
                      const slot = getSlot(day, time);
                      return (
                        <td key={day} className="p-2 align-top">
                          {slot ? (
                            <button
                              onClick={() => setSelected(slot)}
                              className={`w-full p-2.5 rounded-lg text-left transition-all hover:scale-[1.02] hover:elevated-shadow ${slot.color}`}
                            >
                              <p className="text-xs font-bold">{slot.courseUnit.code}</p>
                              <p className="text-[11px] opacity-80 mt-0.5 line-clamp-1">{slot.courseUnit.name}</p>
                              <p className="text-[10px] opacity-60 mt-1">{slot.venue.name} · {slot.lecturer}</p>
                            </button>
                          ) : (
                            <div className="h-16 rounded-lg border border-dashed border-border/50" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">{selected?.courseUnit.code} — {selected?.courseUnit.name}</DialogTitle>
            </DialogHeader>
            {selected && (
              <div className="space-y-3 text-sm">
                {[
                  ['Lecturer', selected.lecturer],
                  ['Department', selected.department],
                  ['Day & Time', `${selected.day}, ${selected.startTime} – ${selected.endTime}`],
                  ['Venue', `${selected.venue.name} (${selected.venue.building})`],
                  ['Capacity', `${selected.venue.capacity} seats`],
                  ['Equipment', selected.venue.equipment.join(', ')],
                ].map(([k, v]) => (
                  <div key={k as string} className="flex justify-between">
                    <span className="text-muted-foreground">{k}</span>
                    <span className="font-medium text-right">{v}</span>
                  </div>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
