import { Calendar, GraduationCap, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockTimetable, mockMakeupClasses } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

export function LecturerDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's classes */}
        <Card className="card-shadow border-0 lg:col-span-2">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="font-display text-base flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" /> Today's Classes
            </CardTitle>
            <button onClick={() => navigate('/timetable')} className="text-xs text-primary hover:underline flex items-center gap-1">
              Full timetable <ArrowRight className="h-3 w-3" />
            </button>
          </CardHeader>
          <CardContent className="space-y-2">
            {mockTimetable.slice(0, 4).map((slot) => (
              <div key={slot.id} className={`p-3 rounded-lg text-sm ${slot.color}`}>
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold">{slot.courseUnit.code} — {slot.courseUnit.name}</p>
                    <p className="text-xs opacity-70 mt-0.5">{slot.venue.name} · {slot.venue.building}</p>
                  </div>
                  <span className="font-mono text-xs">{slot.startTime}–{slot.endTime}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick actions */}
        <div className="space-y-4">
          <Button onClick={() => navigate('/makeup-classes')} className="w-full gradient-primary text-primary-foreground font-semibold h-12">
            <GraduationCap className="h-4 w-4 mr-2" /> Book Makeup Class
          </Button>

          <Card className="card-shadow border-0">
            <CardHeader className="pb-2">
              <CardTitle className="font-display text-sm">My Makeup Classes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {mockMakeupClasses.map(m => (
                <div key={m.id} className="p-2 rounded-lg bg-muted/30">
                  <p className="text-xs font-medium">{m.courseUnit}</p>
                  <p className="text-[11px] text-muted-foreground">{m.date} · {m.timeSlot} · {m.venue}</p>
                  <Badge variant="outline" className={`text-[10px] mt-1 ${m.status === 'confirmed' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                    {m.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
