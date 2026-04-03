import { AppLayout } from '@/components/layout/AppLayout';
import { mockCourseRequests } from '@/services/api';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Check, X } from 'lucide-react';
import type { CourseRequest } from '@/types';

const statusColors: Record<string, string> = {
  pending: 'bg-warning/10 text-warning border-warning/20',
  accepted: 'bg-success/10 text-success border-success/20',
  rejected: 'bg-destructive/10 text-destructive border-destructive/20',
};

export default function CourseRequests() {
  const [requests, setRequests] = useState<CourseRequest[]>(mockCourseRequests);
  const [open, setOpen] = useState(false);

  const updateStatus = (id: string, status: 'accepted' | 'rejected') => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold">Course Unit Requests</h1>
            <p className="text-sm text-muted-foreground mt-1">Inter-departmental coordination module</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-primary-foreground">
                <Plus className="h-4 w-4 mr-2" /> New Request
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-display">New Course Unit Request</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label>Course Unit</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select course unit" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mat201">MAT 201 - Calculus II</SelectItem>
                      <SelectItem value="phy101">PHY 101 - Physics I</SelectItem>
                      <SelectItem value="chm101">CHM 101 - Chemistry I</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Expected Cohort Size</Label>
                  <Input type="number" placeholder="e.g., 250" />
                </div>
                <div className="space-y-2">
                  <Label>Providing Department</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="math">Mathematics</SelectItem>
                      <SelectItem value="physics">Physics</SelectItem>
                      <SelectItem value="chemistry">Chemistry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full gradient-primary text-primary-foreground" onClick={() => setOpen(false)}>
                  Submit Request
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-card rounded-xl card-shadow overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                {['Course Unit', 'Requesting Dept.', 'Providing Dept.', 'Cohort Size', 'Date', 'Status', 'Actions'].map(h => (
                  <th key={h} className="p-3 text-xs font-medium text-muted-foreground text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {requests.map(r => (
                <tr key={r.id} className="border-b last:border-0 hover:bg-muted/20">
                  <td className="p-3">
                    <p className="text-sm font-semibold">{r.courseUnit.code}</p>
                    <p className="text-xs text-muted-foreground">{r.courseUnit.name}</p>
                  </td>
                  <td className="p-3 text-sm">{r.requestingDepartment}</td>
                  <td className="p-3 text-sm">{r.providingDepartment}</td>
                  <td className="p-3 text-sm font-medium">{r.cohortSize}</td>
                  <td className="p-3 text-xs text-muted-foreground">{r.createdAt}</td>
                  <td className="p-3"><Badge variant="outline" className={statusColors[r.status]}>{r.status}</Badge></td>
                  <td className="p-3">
                    {r.status === 'pending' && (
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-success hover:bg-success/10" onClick={() => updateStatus(r.id, 'accepted')}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:bg-destructive/10" onClick={() => updateStatus(r.id, 'rejected')}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
