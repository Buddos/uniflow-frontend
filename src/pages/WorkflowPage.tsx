import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { mockDepartmentSubmissions, mockClassRepFeedback, mockVenues } from '@/data/mockData';
import { departments } from '@/data/mockData';
import { toast } from 'sonner';
import type { WorkflowPhase, DepartmentSubmission, SubmittedCourseUnit, ClassRepFeedback } from '@/types';
import {
  ClipboardList, Database, FileSpreadsheet, MessageSquare,
  Settings2, CheckCircle2, ChevronRight, Plus, AlertTriangle,
  Send, Eye, ArrowRight,
} from 'lucide-react';

const phases: { key: WorkflowPhase; label: string; icon: React.ElementType; description: string }[] = [
  { key: 'cod-submission', label: 'COD Submission', icon: ClipboardList, description: 'CODs provide course units, students, lecturers & special needs' },
  { key: 'det-consolidation', label: 'DET Consolidation', icon: Database, description: 'Directorate receives & consolidates all department data' },
  { key: 'draft-timetable', label: 'Draft Timetable', icon: FileSpreadsheet, description: 'Generate draft timetable and release for feedback' },
  { key: 'feedback-loop', label: 'Feedback Loop (Week 1)', icon: MessageSquare, description: 'Class reps report real issues of classes' },
  { key: 'det-adjustments', label: 'DET Adjustments (Week 2)', icon: Settings2, description: 'DET makes adjustments based on feedback' },
  { key: 'final-requirements', label: 'Final Timetable', icon: CheckCircle2, description: 'System generates the final timetable after all issues are resolved' },
];

export default function WorkflowPage() {
  const { user } = useAuth();
  const [activePhase, setActivePhase] = useState<WorkflowPhase>('cod-submission');
  const [submissions, setSubmissions] = useState<DepartmentSubmission[]>(mockDepartmentSubmissions);
  const [feedback, setFeedback] = useState<ClassRepFeedback[]>(mockClassRepFeedback);
  const [addUnitOpen, setAddUnitOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const currentPhaseIndex = phases.findIndex(p => p.key === activePhase);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Semester Planning Workflow</h1>
        <p className="text-muted-foreground text-sm mt-1">End-to-end timetable planning process</p>
      </div>

      {/* Stepper */}
      <div className="hidden md:flex items-center gap-1 overflow-x-auto pb-2">
        {phases.map((phase, i) => {
          const Icon = phase.icon;
          const isActive = phase.key === activePhase;
          const isPast = i < currentPhaseIndex;
          return (
            <div key={phase.key} className="flex items-center">
              <button
                onClick={() => setActivePhase(phase.key)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : isPast
                    ? 'bg-success/15 text-success'
                    : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                }`}
              >
                {isPast ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                <span className="font-medium">{phase.label}</span>
              </button>
              {i < phases.length - 1 && <ChevronRight className="w-4 h-4 text-muted-foreground mx-1 shrink-0" />}
            </div>
          );
        })}
      </div>

      {/* Mobile phase selector */}
      <div className="md:hidden">
        <Select value={activePhase} onValueChange={(v) => setActivePhase(v as WorkflowPhase)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {phases.map(p => (
              <SelectItem key={p.key} value={p.key}>{p.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Phase description */}
      <Card className="shadow-card border-l-4 border-l-primary">
        <CardContent className="py-4">
          <p className="text-sm text-muted-foreground">{phases[currentPhaseIndex].description}</p>
        </CardContent>
      </Card>

      {/* Phase Content */}
      {activePhase === 'cod-submission' && (
        <CodSubmissionPhase
          submissions={submissions}
          setSubmissions={setSubmissions}
          addUnitOpen={addUnitOpen}
          setAddUnitOpen={setAddUnitOpen}
          userRole={user?.role}
          userDept={user?.department}
        />
      )}

      {activePhase === 'det-consolidation' && (
        <DetConsolidationPhase submissions={submissions} />
      )}

      {activePhase === 'draft-timetable' && (
        <DraftTimetablePhase />
      )}

      {activePhase === 'feedback-loop' && (
        <FeedbackLoopPhase
          feedback={feedback}
          setFeedback={setFeedback}
          feedbackOpen={feedbackOpen}
          setFeedbackOpen={setFeedbackOpen}
        />
      )}

      {activePhase === 'det-adjustments' && (
        <DetAdjustmentsPhase feedback={feedback} setFeedback={setFeedback} />
      )}

      {activePhase === 'final-requirements' && (
        <FinalRequirementsPhase submissions={submissions} feedback={feedback} />
      )}
    </div>
  );
}

/* ─── Phase 1: COD Submission ─── */
function CodSubmissionPhase({
  submissions, setSubmissions, addUnitOpen, setAddUnitOpen, userRole, userDept,
}: {
  submissions: DepartmentSubmission[];
  setSubmissions: React.Dispatch<React.SetStateAction<DepartmentSubmission[]>>;
  addUnitOpen: boolean;
  setAddUnitOpen: (v: boolean) => void;
  userRole?: string;
  userDept?: string;
}) {
  const handleAddUnit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const unit: SubmittedCourseUnit = {
      id: Date.now().toString(),
      courseUnit: fd.get('courseUnit') as string,
      courseCode: fd.get('courseCode') as string,
      lecturerName: fd.get('lecturerName') as string,
      numberOfStudents: parseInt(fd.get('numberOfStudents') as string),
      specialNeeds: fd.get('specialNeeds') as string,
    };
    setSubmissions(prev => prev.map(s =>
      s.department === (userDept || 'Computer Science')
        ? { ...s, courseUnits: [...s.courseUnits, unit] }
        : s
    ));
    setAddUnitOpen(false);
    toast.success('Course unit added to submission');
  };

  const handleSubmit = (deptId: string) => {
    setSubmissions(prev => prev.map(s =>
      s.id === deptId ? { ...s, status: 'submitted', submittedDate: new Date().toISOString().split('T')[0] } : s
    ));
    toast.success('Department plan submitted to DET');
  };

  const isCod = userRole === 'cod';

  return (
    <div className="space-y-4">
      {isCod && (
        <div className="flex justify-end">
          <Dialog open={addUnitOpen} onOpenChange={setAddUnitOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" /> Add Course Unit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-heading">Add Course Unit</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddUnit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Course Unit</Label>
                    <Input name="courseUnit" required placeholder="e.g. Data Structures" />
                  </div>
                  <div className="space-y-1">
                    <Label>Course Code</Label>
                    <Input name="courseCode" required placeholder="e.g. CS201" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Lecturer Name</Label>
                    <Input name="lecturerName" required placeholder="e.g. Dr. Ochieng" />
                  </div>
                  <div className="space-y-1">
                    <Label>Number of Students</Label>
                    <Input name="numberOfStudents" type="number" required placeholder="250" />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label>Special Needs / Equipment</Label>
                  <Textarea name="specialNeeds" placeholder="e.g. Projector, PA System, Computer Lab" />
                </div>
                <Button type="submit" className="w-full gradient-primary text-primary-foreground">Add Unit</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {submissions.map(sub => (
        <Card key={sub.id} className="shadow-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-heading">{sub.department}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant={sub.status === 'submitted' ? 'default' : sub.status === 'draft' ? 'secondary' : 'outline'}>
                  {sub.status}
                </Badge>
                {isCod && sub.status === 'draft' && sub.department === (userDept || 'Computer Science') && (
                  <Button size="sm" onClick={() => handleSubmit(sub.id)} className="gradient-primary text-primary-foreground">
                    <Send className="w-3 h-3 mr-1" /> Submit
                  </Button>
                )}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Submitted by {sub.submittedBy} • {sub.courseUnits.length} course units
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-secondary/50">
                    <th className="text-left p-2 text-xs font-medium text-muted-foreground">Course</th>
                    <th className="text-left p-2 text-xs font-medium text-muted-foreground">Lecturer</th>
                    <th className="text-left p-2 text-xs font-medium text-muted-foreground">Students</th>
                    <th className="text-left p-2 text-xs font-medium text-muted-foreground">Special Needs</th>
                  </tr>
                </thead>
                <tbody>
                  {sub.courseUnits.map(u => (
                    <tr key={u.id} className="border-t border-border/50">
                      <td className="p-2">
                        <p className="font-medium text-foreground">{u.courseUnit}</p>
                        <p className="text-xs text-muted-foreground">{u.courseCode}</p>
                      </td>
                      <td className="p-2 text-muted-foreground">{u.lecturerName}</td>
                      <td className="p-2 text-foreground">{u.numberOfStudents}</td>
                      <td className="p-2 text-muted-foreground">{u.specialNeeds || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/* ─── Phase 2: DET Consolidation ─── */
function DetConsolidationPhase({ submissions }: { submissions: DepartmentSubmission[] }) {
  const [expandedDept, setExpandedDept] = useState<string | null>(null);
  const submitted = submissions.filter(s => s.status === 'submitted' || s.status === 'consolidated');
  const pending = submissions.filter(s => s.status === 'draft');
  const totalUnits = submissions.reduce((sum, s) => sum + s.courseUnits.length, 0);
  const totalStudents = submissions.reduce((sum, s) => sum + s.courseUnits.reduce((a, u) => a + u.numberOfStudents, 0), 0);

  const availableVenues = mockVenues.filter(v => v.status !== 'maintenance');

  // Find best venue for a given student count (110% rule)
  const suggestVenue = (students: number) => {
    const required = Math.ceil(students * 1.1);
    const venue = availableVenues.find(v => v.capacity >= required);
    return venue ? `${venue.name} (${venue.capacity})` : 'No suitable venue';
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="pt-5 pb-4">
            <p className="text-sm text-muted-foreground">Submitted</p>
            <p className="text-3xl font-heading font-bold text-foreground mt-1">{submitted.length}/{submissions.length}</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-5 pb-4">
            <p className="text-sm text-muted-foreground">Course Units</p>
            <p className="text-3xl font-heading font-bold text-foreground mt-1">{totalUnits}</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-5 pb-4">
            <p className="text-sm text-muted-foreground">Total Students</p>
            <p className="text-3xl font-heading font-bold text-foreground mt-1">{totalStudents.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-5 pb-4">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-3xl font-heading font-bold text-warning mt-1">{pending.length}</p>
          </CardContent>
        </Card>
      </div>

      {pending.length > 0 && (
        <Card className="shadow-card border-l-4 border-l-warning">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-heading flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-warning" /> Awaiting Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {pending.map(s => (
                <div key={s.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div>
                    <span className="text-sm font-medium text-foreground">{s.department}</span>
                    <span className="text-xs text-muted-foreground ml-2">({s.submittedBy})</span>
                  </div>
                  <Badge variant="secondary">Draft — Not Submitted</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Per-department expandable submissions */}
      <div className="space-y-3">
        {submissions.filter(s => s.status !== 'draft').map(sub => (
          <Card key={sub.id} className="shadow-card">
            <CardHeader className="pb-2 cursor-pointer" onClick={() => setExpandedDept(expandedDept === sub.id ? null : sub.id)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <ClipboardList className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-heading">{sub.department}</CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {sub.submittedBy} • Submitted {sub.submittedDate} • {sub.courseUnits.length} units • {sub.courseUnits.reduce((a, u) => a + u.numberOfStudents, 0)} students
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default">Submitted</Badge>
                  <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${expandedDept === sub.id ? 'rotate-90' : ''}`} />
                </div>
              </div>
            </CardHeader>
            {expandedDept === sub.id && (
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-secondary/50">
                        <th className="text-left p-2 text-xs font-medium text-muted-foreground">Course Unit</th>
                        <th className="text-left p-2 text-xs font-medium text-muted-foreground">Code</th>
                        <th className="text-left p-2 text-xs font-medium text-muted-foreground">Lecturer</th>
                        <th className="text-left p-2 text-xs font-medium text-muted-foreground">Students</th>
                        <th className="text-left p-2 text-xs font-medium text-muted-foreground">Required Capacity (110%)</th>
                        <th className="text-left p-2 text-xs font-medium text-muted-foreground">Suggested Venue</th>
                        <th className="text-left p-2 text-xs font-medium text-muted-foreground">Special Needs</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sub.courseUnits.map(u => {
                        const required = Math.ceil(u.numberOfStudents * 1.1);
                        const suggestion = suggestVenue(u.numberOfStudents);
                        const noVenue = suggestion === 'No suitable venue';
                        return (
                          <tr key={u.id} className="border-t border-border/50">
                            <td className="p-2 font-medium text-foreground">{u.courseUnit}</td>
                            <td className="p-2 text-muted-foreground">{u.courseCode}</td>
                            <td className="p-2 text-foreground">{u.lecturerName}</td>
                            <td className="p-2 text-foreground">{u.numberOfStudents}</td>
                            <td className="p-2 text-foreground">{required}</td>
                            <td className="p-2">
                              <span className={noVenue ? 'text-destructive font-medium' : 'text-success'}>
                                {suggestion}
                              </span>
                            </td>
                            <td className="p-2 text-muted-foreground">{u.specialNeeds || '—'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* All units consolidated table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base font-heading">All Submitted Requirements (Consolidated)</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary/50">
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">Department</th>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">Course</th>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">Lecturer</th>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">Students</th>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">Special Needs</th>
                </tr>
              </thead>
              <tbody>
                {submissions
                  .filter(s => s.status !== 'draft')
                  .flatMap(s => s.courseUnits.map(u => ({ ...u, department: s.department })))
                  .sort((a, b) => b.numberOfStudents - a.numberOfStudents)
                  .map(u => (
                    <tr key={u.id} className="border-t border-border/50 hover:bg-secondary/30 transition-colors">
                      <td className="p-3 text-muted-foreground">{u.department}</td>
                      <td className="p-3">
                        <p className="font-medium text-foreground">{u.courseUnit}</p>
                        <p className="text-xs text-muted-foreground">{u.courseCode}</p>
                      </td>
                      <td className="p-3 text-foreground">{u.lecturerName}</td>
                      <td className="p-3 text-foreground">{u.numberOfStudents}</td>
                      <td className="p-3 text-muted-foreground">{u.specialNeeds || '—'}</td>
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
/* ─── Phase 3: Draft Timetable ─── */
function DraftTimetablePhase() {
  const [generated, setGenerated] = useState(false);

  return (
    <div className="space-y-4">
      <Card className="shadow-card">
        <CardContent className="py-8 text-center">
          {!generated ? (
            <div className="space-y-4">
              <FileSpreadsheet className="w-16 h-16 text-muted-foreground mx-auto opacity-50" />
              <div>
                <h3 className="font-heading font-semibold text-foreground">Generate Draft Timetable</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Based on consolidated department submissions, the system will generate an optimized draft timetable applying the 110% capacity rule.
                </p>
              </div>
              <Button onClick={() => { setGenerated(true); toast.success('Draft timetable generated successfully'); }} className="gradient-primary text-primary-foreground">
                <FileSpreadsheet className="w-4 h-4 mr-2" /> Generate Draft
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <CheckCircle2 className="w-16 h-16 text-success mx-auto" />
              <div>
                <h3 className="font-heading font-semibold text-foreground">Draft Timetable Generated</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  The draft has been released for feedback. CODs and lecturers can now review it on the Timetable page.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Button variant="outline">
                  <Eye className="w-4 h-4 mr-2" /> View Timetable
                </Button>
                <Button variant="outline" onClick={() => toast.info('Notifications sent to all CODs and lecturers')}>
                  <Send className="w-4 h-4 mr-2" /> Notify Stakeholders
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ─── Phase 4: Feedback Loop ─── */
function FeedbackLoopPhase({
  feedback, setFeedback, feedbackOpen, setFeedbackOpen,
}: {
  feedback: ClassRepFeedback[];
  setFeedback: React.Dispatch<React.SetStateAction<ClassRepFeedback[]>>;
  feedbackOpen: boolean;
  setFeedbackOpen: (v: boolean) => void;
}) {
  const handleFeedback = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const fb: ClassRepFeedback = {
      id: Date.now().toString(),
      courseCode: fd.get('courseCode') as string,
      courseUnit: fd.get('courseUnit') as string,
      venue: fd.get('venue') as string,
      issue: fd.get('issue') as ClassRepFeedback['issue'],
      description: fd.get('description') as string,
      reportedBy: fd.get('reportedBy') as string,
      reportedDate: new Date().toISOString().split('T')[0],
      status: 'open',
    };
    setFeedback(prev => [fb, ...prev]);
    setFeedbackOpen(false);
    toast.success('Feedback submitted successfully');
  };

  const issueColor = (issue: string) => {
    switch (issue) {
      case 'overcrowding': return 'bg-destructive/15 text-destructive border-destructive/30';
      case 'equipment': return 'bg-warning/15 text-warning border-warning/30';
      case 'scheduling-conflict': return 'bg-info/15 text-info border-info/30';
      default: return 'bg-secondary text-muted-foreground';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" /> Report Issue
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-heading">Report Class Issue</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleFeedback} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Course Unit</Label>
                  <Input name="courseUnit" required placeholder="e.g. Data Structures" />
                </div>
                <div className="space-y-1">
                  <Label>Course Code</Label>
                  <Input name="courseCode" required placeholder="e.g. CS201" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Venue</Label>
                  <Input name="venue" required placeholder="e.g. NPL 1" />
                </div>
                <div className="space-y-1">
                  <Label>Issue Type</Label>
                  <Select name="issue" required>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="overcrowding">Overcrowding</SelectItem>
                      <SelectItem value="equipment">Equipment Issue</SelectItem>
                      <SelectItem value="wrong-venue">Wrong Venue</SelectItem>
                      <SelectItem value="scheduling-conflict">Scheduling Conflict</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1">
                <Label>Your Name (Class Rep)</Label>
                <Input name="reportedBy" required placeholder="e.g. John Kamau" />
              </div>
              <div className="space-y-1">
                <Label>Description</Label>
                <Textarea name="description" required placeholder="Describe the issue in detail..." />
              </div>
              <Button type="submit" className="w-full gradient-primary text-primary-foreground">Submit Feedback</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-card">
          <CardContent className="pt-5 pb-4">
            <p className="text-sm text-muted-foreground">Open Issues</p>
            <p className="text-3xl font-heading font-bold text-destructive mt-1">{feedback.filter(f => f.status === 'open').length}</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-5 pb-4">
            <p className="text-sm text-muted-foreground">Resolved</p>
            <p className="text-3xl font-heading font-bold text-success mt-1">{feedback.filter(f => f.status === 'resolved').length}</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-5 pb-4">
            <p className="text-sm text-muted-foreground">Total Reports</p>
            <p className="text-3xl font-heading font-bold text-foreground mt-1">{feedback.length}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base font-heading">Feedback Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {feedback.map(f => (
              <div key={f.id} className="flex items-start justify-between py-3 border-b border-border/50 last:border-0">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{f.courseUnit} ({f.courseCode})</p>
                    <Badge className={issueColor(f.issue)}>{f.issue}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Venue: {f.venue} • Reported by {f.reportedBy} on {f.reportedDate}</p>
                  <p className="text-sm text-muted-foreground">{f.description}</p>
                </div>
                <Badge variant={f.status === 'open' ? 'destructive' : f.status === 'resolved' ? 'default' : 'secondary'}>
                  {f.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ─── Phase 5: DET Adjustments ─── */
function DetAdjustmentsPhase({
  feedback, setFeedback,
}: {
  feedback: ClassRepFeedback[];
  setFeedback: React.Dispatch<React.SetStateAction<ClassRepFeedback[]>>;
}) {
  const openIssues = feedback.filter(f => f.status === 'open');

  const resolveIssue = (id: string) => {
    setFeedback(prev => prev.map(f => f.id === id ? { ...f, status: 'resolved' } : f));
    toast.success('Issue marked as resolved');
  };

  const dismissIssue = (id: string) => {
    setFeedback(prev => prev.map(f => f.id === id ? { ...f, status: 'dismissed' } : f));
    toast.info('Issue dismissed');
  };

  return (
    <div className="space-y-4">
      <Card className="shadow-card border-l-4 border-l-info">
        <CardContent className="py-4">
          <p className="text-sm text-muted-foreground">
            Review feedback from Week 1 and make necessary adjustments to the timetable. Resolve or dismiss each reported issue.
          </p>
        </CardContent>
      </Card>

      {openIssues.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="py-8 text-center">
            <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-3" />
            <p className="font-heading font-semibold text-foreground">All Issues Resolved</p>
            <p className="text-sm text-muted-foreground mt-1">No open feedback items remaining. Proceed to generate final requirements.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {openIssues.map(f => (
            <Card key={f.id} className="shadow-card">
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">{f.courseUnit} ({f.courseCode}) — {f.venue}</p>
                    <p className="text-xs text-muted-foreground">Issue: {f.issue} • By {f.reportedBy}</p>
                    <p className="text-sm text-muted-foreground">{f.description}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" onClick={() => resolveIssue(f.id)} className="bg-success hover:bg-success/90 text-white">Resolve</Button>
                    <Button size="sm" variant="outline" onClick={() => dismissIssue(f.id)}>Dismiss</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Phase 6: Final Timetable Generation ─── */
interface GeneratedSlot {
  courseUnit: string;
  courseCode: string;
  lecturer: string;
  department: string;
  venue: string;
  venueCapacity: number;
  day: string;
  timeSlot: string;
  students: number;
  capacityUsage: number;
}

function FinalRequirementsPhase({
  submissions, feedback,
}: {
  submissions: DepartmentSubmission[];
  feedback: ClassRepFeedback[];
}) {
  const [generated, setGenerated] = useState(false);
  const [finalTimetable, setFinalTimetable] = useState<GeneratedSlot[]>([]);
  const totalUnits = submissions.reduce((s, d) => s + d.courseUnits.length, 0);
  const resolvedIssues = feedback.filter(f => f.status === 'resolved').length;
  const openIssues = feedback.filter(f => f.status === 'open').length;

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlotsList = ['7:00-9:00', '9:00-11:00', '11:00-1:00', '2:00-4:00', '4:00-6:00'];

  const generateTimetable = () => {
    if (openIssues > 0) {
      toast.error(`Cannot generate — ${openIssues} unresolved issue(s) remain. Resolve them in DET Adjustments first.`);
      return;
    }

    const allUnits = submissions.flatMap(s =>
      s.courseUnits.map(u => ({ ...u, department: s.department }))
    );

    // Sort largest classes first so they get best venues
    const sorted = [...allUnits].sort((a, b) => b.numberOfStudents - a.numberOfStudents);

    const availableVenues = mockVenues.filter(v => v.status !== 'maintenance');
    const slots: GeneratedSlot[] = [];
    const venueSlotMap: Record<string, Set<string>> = {};
    availableVenues.forEach(v => { venueSlotMap[v.id] = new Set(); });

    for (const unit of sorted) {
      const requiredCapacity = Math.ceil(unit.numberOfStudents * 1.1); // 110% buffer
      let assigned = false;

      for (const day of days) {
        if (assigned) break;
        for (const time of timeSlotsList) {
          if (assigned) break;
          const slotKey = `${day}-${time}`;
          const venue = availableVenues.find(v =>
            v.capacity >= requiredCapacity && !venueSlotMap[v.id].has(slotKey)
          );
          if (venue) {
            venueSlotMap[venue.id].add(slotKey);
            slots.push({
              courseUnit: unit.courseUnit,
              courseCode: unit.courseCode,
              lecturer: unit.lecturerName,
              department: unit.department,
              venue: venue.name,
              venueCapacity: venue.capacity,
              day,
              timeSlot: time,
              students: unit.numberOfStudents,
              capacityUsage: Math.round((unit.numberOfStudents / venue.capacity) * 100),
            });
            assigned = true;
          }
        }
      }

      if (!assigned) {
        slots.push({
          courseUnit: unit.courseUnit, courseCode: unit.courseCode, lecturer: unit.lecturerName,
          department: unit.department, venue: '⚠ No venue available', venueCapacity: 0,
          day: '—', timeSlot: '—', students: unit.numberOfStudents, capacityUsage: 0,
        });
      }
    }

    setFinalTimetable(slots);
    setGenerated(true);
    toast.success('Final timetable generated successfully!');
  };

  return (
    <div className="space-y-4">
      {!generated ? (
        <Card className="shadow-card">
          <CardContent className="py-8 text-center">
            <div className="space-y-4">
              <CheckCircle2 className={`w-16 h-16 mx-auto ${openIssues > 0 ? 'text-warning' : 'text-muted-foreground opacity-50'}`} />
              <div>
                <h3 className="font-heading font-semibold text-foreground">Generate Final Timetable</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Assigns venues to all course units using the 110% capacity rule. All feedback issues must be resolved first.
                </p>
              </div>
              {openIssues > 0 && (
                <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-warning/15 text-warning text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  {openIssues} unresolved issue(s) — resolve before generating
                </div>
              )}
              <div className="flex justify-center gap-6 text-sm text-muted-foreground">
                <span>{submissions.length} departments</span>
                <span>{totalUnits} course units</span>
                <span>{resolvedIssues} issues resolved</span>
              </div>
              <Button onClick={generateTimetable} className="gradient-primary text-primary-foreground" disabled={openIssues > 0}>
                <ArrowRight className="w-4 h-4 mr-2" /> Generate Final Timetable
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="shadow-card border-l-4 border-l-success">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-success" />
                  <div>
                    <p className="font-heading font-semibold text-foreground">Final Timetable Generated</p>
                    <p className="text-xs text-muted-foreground">{finalTimetable.length} slots assigned across {submissions.length} departments</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => toast.info('Timetable published to all stakeholders')}>
                  <Send className="w-3 h-3 mr-1" /> Publish
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="shadow-card"><CardContent className="pt-5 pb-4">
              <p className="text-sm text-muted-foreground">Total Slots</p>
              <p className="text-3xl font-heading font-bold text-foreground mt-1">{finalTimetable.length}</p>
            </CardContent></Card>
            <Card className="shadow-card"><CardContent className="pt-5 pb-4">
              <p className="text-sm text-muted-foreground">Departments</p>
              <p className="text-3xl font-heading font-bold text-foreground mt-1">{submissions.length}</p>
            </CardContent></Card>
            <Card className="shadow-card"><CardContent className="pt-5 pb-4">
              <p className="text-sm text-muted-foreground">Issues Fixed</p>
              <p className="text-3xl font-heading font-bold text-success mt-1">{resolvedIssues}</p>
            </CardContent></Card>
            <Card className="shadow-card"><CardContent className="pt-5 pb-4">
              <p className="text-sm text-muted-foreground">Unassigned</p>
              <p className="text-3xl font-heading font-bold text-destructive mt-1">{finalTimetable.filter(s => s.venueCapacity === 0).length}</p>
            </CardContent></Card>
          </div>

          <Card className="shadow-card overflow-hidden">
            <CardHeader>
              <CardTitle className="text-base font-heading">Generated Timetable</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-secondary/50">
                      <th className="text-left p-3 text-xs font-medium text-muted-foreground">Course</th>
                      <th className="text-left p-3 text-xs font-medium text-muted-foreground">Lecturer</th>
                      <th className="text-left p-3 text-xs font-medium text-muted-foreground">Day</th>
                      <th className="text-left p-3 text-xs font-medium text-muted-foreground">Time</th>
                      <th className="text-left p-3 text-xs font-medium text-muted-foreground">Venue</th>
                      <th className="text-left p-3 text-xs font-medium text-muted-foreground">Students</th>
                      <th className="text-left p-3 text-xs font-medium text-muted-foreground">Usage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {finalTimetable.map((slot, i) => (
                      <tr key={i} className="border-t border-border/50 hover:bg-secondary/30 transition-colors">
                        <td className="p-3">
                          <p className="font-medium text-foreground">{slot.courseUnit}</p>
                          <p className="text-xs text-muted-foreground">{slot.courseCode} • {slot.department}</p>
                        </td>
                        <td className="p-3 text-muted-foreground">{slot.lecturer}</td>
                        <td className="p-3 text-foreground">{slot.day}</td>
                        <td className="p-3 text-foreground">{slot.timeSlot}</td>
                        <td className="p-3">
                          <span className={slot.venueCapacity === 0 ? 'text-destructive font-medium' : 'text-foreground'}>
                            {slot.venue}
                          </span>
                          {slot.venueCapacity > 0 && <span className="text-xs text-muted-foreground ml-1">({slot.venueCapacity})</span>}
                        </td>
                        <td className="p-3 text-foreground">{slot.students}</td>
                        <td className="p-3">
                          {slot.capacityUsage > 0 ? (
                            <Badge className={
                              slot.capacityUsage > 85 ? 'bg-warning/15 text-warning border-warning/30'
                                : slot.capacityUsage > 60 ? 'bg-info/15 text-info border-info/30'
                                : 'bg-success/15 text-success border-success/30'
                            }>
                              {slot.capacityUsage}%
                            </Badge>
                          ) : <span className="text-destructive">—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
