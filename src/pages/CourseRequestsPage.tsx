import { useState } from 'react';
import { mockCourseRequests, departments } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import type { CourseRequest } from '@/types';

export default function CourseRequestsPage() {
  const [requests, setRequests] = useState<CourseRequest[]>(mockCourseRequests);
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newReq: CourseRequest = {
      id: Date.now().toString(),
      courseUnit: fd.get('courseUnit') as string,
      courseCode: fd.get('courseCode') as string,
      requestingDept: fd.get('requestingDept') as string,
      providingDept: fd.get('providingDept') as string,
      cohortSize: parseInt(fd.get('cohortSize') as string),
      status: 'pending',
      requestDate: new Date().toISOString().split('T')[0],
    };
    setRequests(prev => [newReq, ...prev]);
    setOpen(false);
    toast.success('Course unit request submitted');
  };

  const statusBadge = (status: string) => {
    if (status === 'accepted') return <Badge className="bg-success/15 text-success border-success/30">Accepted</Badge>;
    if (status === 'pending') return <Badge className="bg-warning/15 text-warning border-warning/30">Pending</Badge>;
    return <Badge className="bg-destructive/15 text-destructive border-destructive/30">Rejected</Badge>;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Course Unit Requests</h1>
          <p className="text-muted-foreground text-sm mt-1">Inter-departmental course coordination</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground"><Plus className="w-4 h-4 mr-2" /> New Request</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-heading">Submit Course Request</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="courseUnit">Course Unit</Label>
                  <Input id="courseUnit" name="courseUnit" required placeholder="e.g. Calculus I" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="courseCode">Course Code</Label>
                  <Input id="courseCode" name="courseCode" required placeholder="e.g. MAT101" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Requesting Dept</Label>
                  <Select name="requestingDept" required>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Providing Dept</Label>
                  <Select name="providingDept" required>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="cohortSize">Expected Cohort Size</Label>
                <Input id="cohortSize" name="cohortSize" type="number" required placeholder="200" />
              </div>
              <Button type="submit" className="w-full gradient-primary text-primary-foreground">Submit Request</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-card overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-secondary/50">
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Course</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">From → To</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Students</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Date</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(r => (
                  <tr key={r.id} className="border-t border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="p-3">
                      <p className="text-sm font-medium text-foreground">{r.courseUnit}</p>
                      <p className="text-xs text-muted-foreground">{r.courseCode}</p>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">{r.requestingDept} → {r.providingDept}</td>
                    <td className="p-3 text-sm text-foreground">{r.cohortSize}</td>
                    <td className="p-3 text-sm text-muted-foreground">{r.requestDate}</td>
                    <td className="p-3">{statusBadge(r.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
