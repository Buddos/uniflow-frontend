import { AppLayout } from '@/components/layout/AppLayout';
import { mockVenues, mockMakeupClasses } from '@/services/api';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Plus, GraduationCap, CheckCircle } from 'lucide-react';

export default function MakeupClasses() {
  const [classes] = useState(mockMakeupClasses);
  const [bookOpen, setBookOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const availableVenues = mockVenues.filter(v => v.status === 'available');

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold">Makeup Classes</h1>
            <p className="text-sm text-muted-foreground mt-1">Book available venues for makeup sessions</p>
          </div>
          <Dialog open={bookOpen} onOpenChange={setBookOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-primary-foreground">
                <Plus className="h-4 w-4 mr-2" /> Book Makeup Class
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-display">Book Makeup Class</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label>Course Unit</Label>
                  <Input placeholder="e.g., MAT 201 - Calculus II" />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Time Slot</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="08-10">08:00 - 10:00</SelectItem>
                      <SelectItem value="10-12">10:00 - 12:00</SelectItem>
                      <SelectItem value="12-14">12:00 - 14:00</SelectItem>
                      <SelectItem value="14-16">14:00 - 16:00</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Available Venue</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select venue" /></SelectTrigger>
                    <SelectContent>
                      {availableVenues.map(v => (
                        <SelectItem key={v.id} value={v.id}>{v.name} — {v.building} ({v.capacity} seats)</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full gradient-primary text-primary-foreground" onClick={() => { setBookOpen(false); setConfirmOpen(true); }}>
                  Confirm Booking
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Confirmation modal */}
        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent className="text-center max-w-sm">
            <div className="flex flex-col items-center py-4">
              <div className="h-14 w-14 rounded-full bg-success/10 flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <h3 className="font-display font-bold text-lg">Booking Confirmed!</h3>
              <p className="text-sm text-muted-foreground mt-2">Your makeup class has been scheduled. Technical staff will be notified to prepare the venue.</p>
            </div>
            <DialogFooter>
              <Button className="w-full" onClick={() => setConfirmOpen(false)}>Done</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Existing makeup classes */}
        <div className="bg-card rounded-xl card-shadow overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                {['Course Unit', 'Lecturer', 'Date', 'Time', 'Venue', 'Status'].map(h => (
                  <th key={h} className="p-3 text-xs font-medium text-muted-foreground text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {classes.map(c => (
                <tr key={c.id} className="border-b last:border-0 hover:bg-muted/20">
                  <td className="p-3 text-sm font-medium">{c.courseUnit}</td>
                  <td className="p-3 text-sm">{c.lecturer}</td>
                  <td className="p-3 text-sm">{c.date}</td>
                  <td className="p-3 text-sm font-mono text-xs">{c.timeSlot}</td>
                  <td className="p-3 text-sm">{c.venue}</td>
                  <td className="p-3">
                    <Badge variant="outline" className={c.status === 'confirmed' ? 'bg-success/10 text-success border-success/20' : 'bg-warning/10 text-warning border-warning/20'}>
                      {c.status}
                    </Badge>
                  </td>
                </tr>
              ))}
              {classes.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-sm text-muted-foreground">No makeup classes scheduled.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
