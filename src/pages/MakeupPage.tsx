import { useState } from 'react';
import { mockVenues, timeSlots } from '@/data/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BookOpen, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function MakeupPage() {
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [selectedVenue, setSelectedVenue] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const availableVenues = mockVenues.filter(v => v.status === 'available');

  const handleBook = () => {
    setConfirmOpen(false);
    toast.success(`Makeup class booked: ${selectedVenue} on ${date} at ${timeSlot}`);
    setDate('');
    setTimeSlot('');
    setSelectedVenue('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Book Makeup Class</h1>
        <p className="text-muted-foreground text-sm mt-1">Find available venues and schedule makeup sessions</p>
      </div>

      <Card className="shadow-card max-w-lg">
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-1">
            <Label>Date</Label>
            <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Time Slot</Label>
            <Select value={timeSlot} onValueChange={setTimeSlot}>
              <SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger>
              <SelectContent>
                {timeSlots.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Available Venue</Label>
            <Select value={selectedVenue} onValueChange={setSelectedVenue}>
              <SelectTrigger><SelectValue placeholder="Select venue" /></SelectTrigger>
              <SelectContent>
                {availableVenues.map(v => (
                  <SelectItem key={v.id} value={v.name}>{v.name} ({v.capacity} seats)</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            className="w-full gradient-primary text-primary-foreground"
            disabled={!date || !timeSlot || !selectedVenue}
            onClick={() => setConfirmOpen(true)}
          >
            <BookOpen className="w-4 h-4 mr-2" /> Book Venue
          </Button>
        </CardContent>
      </Card>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading">Confirm Booking</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <div className="p-4 rounded-lg bg-secondary/50 space-y-2">
              <p><span className="text-muted-foreground">Date:</span> <span className="font-medium text-foreground">{date}</span></p>
              <p><span className="text-muted-foreground">Time:</span> <span className="font-medium text-foreground">{timeSlot}</span></p>
              <p><span className="text-muted-foreground">Venue:</span> <span className="font-medium text-foreground">{selectedVenue}</span></p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setConfirmOpen(false)}>Cancel</Button>
              <Button className="flex-1 gradient-primary text-primary-foreground" onClick={handleBook}>
                <CheckCircle className="w-4 h-4 mr-2" /> Confirm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
