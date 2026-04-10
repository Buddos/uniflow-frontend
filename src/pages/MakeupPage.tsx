import { useState, useEffect } from 'react';
import { fetchVenues, bookMakeupClass } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BookOpen, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { HttpError } from '@/services/api';
import type { Venue } from '@/types';

const LIVE_MAP_REFRESH_EVENT = 'uniflow:refresh-live-map';
const MAKEUP_DRAFT_KEY = 'uniflow_draft_makeup_booking';

const timeSlots = ['7:00-9:00', '9:00-11:00', '11:00-1:00', '2:00-4:00', '4:00-6:00'];

export default function MakeupPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [selectedVenue, setSelectedVenue] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [conflictOpen, setConflictOpen] = useState(false);
  const [conflictMessage, setConflictMessage] = useState('');

  useEffect(() => {
    fetchVenues()
      .then(data => {
        setVenues(data);
        setError(null);
      })
      .catch(err => {
        console.error('Failed to fetch venues:', err.message);
        setError('Failed to load venues. Please try again later.');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const rawDraft = localStorage.getItem(MAKEUP_DRAFT_KEY);
    if (!rawDraft) return;

    const shouldRestore = window.confirm('We found an unsaved draft. Would you like to restore it?');
    if (!shouldRestore) {
      localStorage.removeItem(MAKEUP_DRAFT_KEY);
      return;
    }

    try {
      const parsedDraft = JSON.parse(rawDraft) as { date?: string; timeSlot?: string; selectedVenue?: string };
      setDate(parsedDraft.date ?? '');
      setTimeSlot(parsedDraft.timeSlot ?? '');
      setSelectedVenue(parsedDraft.selectedVenue ?? '');
    } catch {
      localStorage.removeItem(MAKEUP_DRAFT_KEY);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(MAKEUP_DRAFT_KEY, JSON.stringify({ date, timeSlot, selectedVenue }));
  }, [date, timeSlot, selectedVenue]);

  const availableVenues = venues.filter(v => v.status === 'available');

  const handleBook = async () => {
    setSubmitting(true);
    try {
      const venueId = venues.find(v => v.name === selectedVenue)?.id;
      if (!venueId) throw new Error('Venue not found');
      
      await bookMakeupClass({
        date,
        timeSlot,
        venueId,
      });
      setConfirmOpen(false);
      toast.success(`Makeup class booked: ${selectedVenue} on ${date} at ${timeSlot}`);
      localStorage.removeItem(MAKEUP_DRAFT_KEY);
      setDate('');
      setTimeSlot('');
      setSelectedVenue('');
    } catch (error) {
      if (error instanceof HttpError && error.status === 409) {
        setConflictMessage('Error: Someone beat you to it! This slot has already been booked. The Live Map is refreshing...');
        setConflictOpen(true);
        return;
      }

      if (error instanceof HttpError && error.status === 403) {
        toast.error('You do not have permission to book this makeup slot.');
        return;
      }

      toast.error('Failed to book venue. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConflictClosed = () => {
    setConflictOpen(false);
    window.dispatchEvent(new CustomEvent(LIVE_MAP_REFRESH_EVENT));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Book Makeup Class</h1>
        <p className="text-muted-foreground text-sm mt-1">Find available venues and schedule makeup sessions</p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

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
            <Select value={selectedVenue} onValueChange={setSelectedVenue} disabled={loading}>
              <SelectTrigger><SelectValue placeholder={loading ? 'Loading venues...' : 'Select venue'} /></SelectTrigger>
              <SelectContent>
                {availableVenues.map(v => (
                  <SelectItem key={v.id} value={v.name}>{v.name} ({v.capacity} seats)</SelectItem>
                ))}
                {!loading && availableVenues.length === 0 && (
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">No available venues</div>
                )}
              </SelectContent>
            </Select>
          </div>
          <Button
            className="w-full gradient-primary text-primary-foreground"
            disabled={!date || !timeSlot || !selectedVenue || loading}
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

      <AlertDialog open={conflictOpen} onOpenChange={(open) => !open && handleConflictClosed()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">Booking Conflict</AlertDialogTitle>
            <AlertDialogDescription className="text-base text-foreground">
              {conflictMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Refresh Live Map
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
