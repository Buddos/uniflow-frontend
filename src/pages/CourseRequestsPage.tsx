import { useState, useEffect } from 'react';
import { fetchCourseRequests, submitCourseRequest } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import type { CourseRequest } from '@/types';
import { useNavigate, useParams } from 'react-router-dom';

type BackendCourseRequest = {
  id: string | number;
  courseUnit?: { name?: string; code?: string };
  comments?: string;
  requestingDepartment?: string;
  providingDepartment?: string;
  expectedStudents?: number;
  status?: string;
  requestedAt?: string;
  rejectionReason?: string;
  rejection_reason?: string;
  notes?: string;
};

const departments = [
  'Computer Science', 'Mathematics', 'Physics', 'Agriculture',
  'Engineering', 'Education', 'Business Administration', 'Chemistry', 'Statistics',
];

const COURSE_REQUEST_DRAFT_KEY = 'uniflow_draft_course_request';

type CourseRequestDraft = {
  courseUnit: string;
  courseCode: string;
  requestingDept: string;
  providingDept: string;
  cohortSize: string;
  notes: string;
};

const emptyDraft: CourseRequestDraft = {
  courseUnit: '',
  courseCode: '',
  requestingDept: '',
  providingDept: '',
  cohortSize: '',
  notes: '',
};

/** Map backend CourseUnitRequest → frontend CourseRequest */
function mapRequest(r: BackendCourseRequest): CourseRequest {
  return {
    id:             String(r.id),
    courseUnit:     r.courseUnit?.name ?? r.comments ?? '—',
    courseCode:     r.courseUnit?.code ?? '',
    requestingDept: r.requestingDepartment ?? '',
    providingDept:  r.providingDepartment  ?? '',
    cohortSize:     r.expectedStudents     ?? 0,
    status:
      r.status === 'ACCEPTED' ? 'accepted' :
      r.status === 'REJECTED' ? 'rejected' : 'pending',
    requestDate:    r.requestedAt
      ? String(r.requestedAt).split('T')[0]
      : new Date().toISOString().split('T')[0],
    rejectionReason: r.rejectionReason ?? r.rejection_reason ?? '',
    notes: r.notes ?? r.comments ?? '',
  };
}

const statusBadge = (status: CourseRequest['status']) => {
  if (status === 'accepted') return <Badge className="bg-success/15 text-success border-success/30">Accepted</Badge>;
  if (status === 'rejected') return <Badge className="bg-destructive/15 text-destructive border-destructive/30">Rejected</Badge>;
  return <Badge className="bg-warning/15 text-warning border-warning/30">Pending</Badge>;
};

export default function CourseRequestsPage() {
  const navigate = useNavigate();
  const { id: deepLinkEditId } = useParams();
  const [requests, setRequests] = useState<CourseRequest[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [open, setOpen]         = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingRequest, setEditingRequest] = useState<CourseRequest | null>(null);
  const [draftRestored, setDraftRestored] = useState(false);
  const [formDraft, setFormDraft] = useState<CourseRequestDraft>(emptyDraft);

  // Controlled select values
  const [reqDept, setReqDept] = useState('');
  const [provDept, setProvDept] = useState('');

  const openRequestDialog = (request?: CourseRequest) => {
    setEditingRequest(request ?? null);
    if (request) {
      setReqDept(request.requestingDept);
      setProvDept(request.providingDept);
      setFormDraft({
        courseUnit: request.courseUnit,
        courseCode: request.courseCode,
        requestingDept: request.requestingDept,
        providingDept: request.providingDept,
        cohortSize: String(request.cohortSize),
        notes: request.notes ?? '',
      });
      setOpen(true);
    } else {
      setReqDept('');
      setProvDept('');
      setFormDraft(emptyDraft);
      setOpen(true);
    }
  };

  const closeRequestDialog = () => {
    setOpen(false);
    setEditingRequest(null);
    setReqDept('');
    setProvDept('');
    setFormDraft(emptyDraft);

    if (deepLinkEditId) {
      navigate('/course-requests', { replace: true });
    }
  };

  useEffect(() => {
    fetchCourseRequests()
      .then(data => setRequests((data as BackendCourseRequest[]).map(mapRequest)))
      .catch(error => setError(error instanceof Error ? error.message : 'Failed to load requests'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (editingRequest || draftRestored) return;
    if (deepLinkEditId) {
      setDraftRestored(true);
      return;
    }
    const rawDraft = localStorage.getItem(COURSE_REQUEST_DRAFT_KEY);
    if (!rawDraft) {
      setDraftRestored(true);
      return;
    }

    const shouldRestore = window.confirm('We found an unsaved draft. Would you like to restore it?');
    if (shouldRestore) {
      try {
        const parsedDraft = JSON.parse(rawDraft) as CourseRequestDraft;
        setFormDraft(parsedDraft);
        setReqDept(parsedDraft.requestingDept);
        setProvDept(parsedDraft.providingDept);
        setOpen(true);
      } catch {
        localStorage.removeItem(COURSE_REQUEST_DRAFT_KEY);
      }
    } else {
      localStorage.removeItem(COURSE_REQUEST_DRAFT_KEY);
    }

    setDraftRestored(true);
  }, [deepLinkEditId, draftRestored, editingRequest]);

  useEffect(() => {
    if (loading || !deepLinkEditId) return;

    const foundRequest = requests.find(request => request.id === deepLinkEditId);
    if (foundRequest) {
      openRequestDialog(foundRequest);
    }
  }, [loading, deepLinkEditId, requests]);

  useEffect(() => {
    if (!open || editingRequest) return;
    const nextDraft: CourseRequestDraft = {
      ...formDraft,
      requestingDept: reqDept,
      providingDept: provDept,
    };

    localStorage.setItem(COURSE_REQUEST_DRAFT_KEY, JSON.stringify(nextDraft));
  }, [formDraft, reqDept, provDept, open, editingRequest]);

  const updateDraftField = (field: keyof CourseRequestDraft, value: string) => {
    setFormDraft(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setSubmitting(true);
    try {
      const notes = String(fd.get('notes') || '');
      const saved = await submitCourseRequest({
        courseUnit:     fd.get('courseUnit') as string,
        courseCode:     fd.get('courseCode') as string,
        requestingDept: reqDept,
        providingDept:  provDept,
        cohortSize:     parseInt(fd.get('cohortSize') as string),
        notes,
      });
      setRequests(prev => [mapRequest(saved), ...prev.filter(req => req.id !== editingRequest?.id)]);
      localStorage.removeItem(COURSE_REQUEST_DRAFT_KEY);
      closeRequestDialog();
      (e.target as HTMLFormElement).reset();
      toast.success(editingRequest ? 'Request updated and resubmitted' : 'Course unit request submitted');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      toast.error('Failed to submit request: ' + message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Course Unit Requests</h1>
          <p className="text-muted-foreground text-sm mt-1">Inter-departmental course coordination</p>
        </div>
        <Dialog open={open} onOpenChange={(nextOpen) => (nextOpen ? setOpen(true) : closeRequestDialog())}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground" onClick={() => openRequestDialog()}>
              <Plus className="w-4 h-4 mr-2" /> New Request
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-heading">{editingRequest ? 'Edit & Resubmit Request' : 'Submit Course Request'}</DialogTitle>
            </DialogHeader>
            <form key={editingRequest?.id ?? 'new'} onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="courseUnit">Course Unit</Label>
                  <Input
                    id="courseUnit"
                    name="courseUnit"
                    required
                    placeholder="e.g. Calculus I"
                    value={formDraft.courseUnit}
                    onChange={e => updateDraftField('courseUnit', e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="courseCode">Course Code</Label>
                  <Input
                    id="courseCode"
                    name="courseCode"
                    required
                    placeholder="e.g. MAT101"
                    value={formDraft.courseCode}
                    onChange={e => updateDraftField('courseCode', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Requesting Dept</Label>
                  <Select value={reqDept} onValueChange={(value) => { setReqDept(value); updateDraftField('requestingDept', value); }} required>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Providing Dept</Label>
                  <Select value={provDept} onValueChange={(value) => { setProvDept(value); updateDraftField('providingDept', value); }} required>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="cohortSize">Expected Cohort Size</Label>
                <Input
                  id="cohortSize"
                  name="cohortSize"
                  type="number"
                  required
                  placeholder="200"
                  min={1}
                  value={formDraft.cohortSize}
                  onChange={e => updateDraftField('cohortSize', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  name="notes"
                  placeholder="Optional notes for timetabling admin"
                  value={formDraft.notes}
                  onChange={e => updateDraftField('notes', e.target.value)}
                />
              </div>
              <Button
                type="submit"
                disabled={submitting || !reqDept || !provDept}
                className="w-full gradient-primary text-primary-foreground"
              >
                {submitting ? 'Submitting…' : editingRequest ? 'Resubmit Request' : 'Submit Request'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Could not load requests: {error}
        </div>
      )}

      {/* ── Table ── */}
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
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-t border-border/50">
                      {[...Array(5)].map((_, j) => (
                        <td key={j} className="p-3"><Skeleton className="h-4 w-full" /></td>
                      ))}
                    </tr>
                  ))
                  : requests.length === 0
                  ? (
                    <tr>
                      <td colSpan={5} className="p-10 text-center text-sm text-muted-foreground">
                        No requests yet. Click <strong>New Request</strong> to submit the first one.
                      </td>
                    </tr>
                  )
                  : requests.map(r => (
                    <tr key={r.id} className="border-t border-border/50 hover:bg-secondary/30 transition-colors">
                      <td className="p-3">
                        <p className="text-sm font-medium text-foreground">{r.courseUnit}</p>
                        <p className="text-xs text-muted-foreground">{r.courseCode}</p>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">
                        {r.requestingDept} → {r.providingDept}
                      </td>
                      <td className="p-3 text-sm text-foreground">{r.cohortSize}</td>
                      <td className="p-3 text-sm text-muted-foreground">{r.requestDate}</td>
                      <td className="p-3 space-y-2">
                        {statusBadge(r.status)}
                        {r.status === 'rejected' && (
                          <div className="space-y-2 rounded-md border border-destructive/30 bg-destructive/10 p-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-destructive">Rejected</p>
                            <p className="text-sm text-destructive">{r.rejectionReason || 'No rejection reason was provided.'}</p>
                            <Button size="sm" variant="destructive" onClick={() => openRequestDialog(r)}>
                              Edit &amp; Resubmit
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
