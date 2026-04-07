import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, CheckCircle, Clock, Plane, Plus, Edit, Send, Users2 } from 'lucide-react';
import { fetchCourseRequests, fetchTrips, fetchNotifications, fetchCrossDepartmentRequests, submitDepartmentRequirements } from '@/services/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import type { CourseRequest, AcademicTrip, Notification, CrossDepartmentRequest } from '@/types';

export function CodDashboard() {
  const [courseRequests, setCourseRequests] = useState<CourseRequest[]>([]);
  const [trips, setTrips] = useState<AcademicTrip[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [crossDeptRequests, setCrossDeptRequests] = useState<CrossDepartmentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showRequirementDialog, setShowRequirementDialog] = useState(false);
  const [useTemplate, setUseTemplate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [requirements, setRequirements] = useState([
    { courseUnit: '', courseCode: '', lecturerName: '', numberOfStudents: 0, specialNeeds: '' }
  ]);

  useEffect(() => {
    Promise.all([
      fetchCourseRequests(),
      fetchTrips(),
      fetchNotifications(),
      fetchCrossDepartmentRequests()
    ])
      .then(([reqsData, tripsData, notifData, crossDeptData]) => {
        setCourseRequests(reqsData);
        setTrips(tripsData);
        setNotifications(notifData);
        setCrossDeptRequests(crossDeptData);
        setError(null);
      })
      .catch(err => {
        console.error('Failed to fetch dashboard data:', err.message);
        setError('Failed to load dashboard data');
      })
      .finally(() => setLoading(false));
  }, []);

  const pending = courseRequests.filter(r => r.status === 'pending').length;
  const accepted = courseRequests.filter(r => r.status === 'accepted').length;
  const crossDeptPending = crossDeptRequests.filter(r => r.status === 'pending').length;
  const tripsCount = trips.length;
  const unread = notifications.filter(n => !n.read).length;

  const handleAddRequirement = () => {
    setRequirements([...requirements, { courseUnit: '', courseCode: '', lecturerName: '', numberOfStudents: 0, specialNeeds: '' }]);
  };

  const handleRequirementChange = (index: number, field: string, value: string | number) => {
    const updated = [...requirements];
    updated[index] = { ...updated[index], [field]: value };
    setRequirements(updated);
  };

  const handleSubmitRequirements = async () => {
    setSubmitting(true);
    try {
      const submission = {
        department: 'Computer Science', // In real app, get from auth context
        submittedBy: 'Prof. Jane Wanjiku',
        submittedDate: new Date().toISOString(),
        status: 'submitted' as const,
        courseUnits: requirements.map(r => ({
          id: Math.random().toString(36).substr(2, 9),
          ...r
        }))
      };
      await submitDepartmentRequirements(submission);
      toast.success('Requirements submitted successfully to Timetabling Admin!');
      setShowRequirementDialog(false);
      setRequirements([{ courseUnit: '', courseCode: '', lecturerName: '', numberOfStudents: 0, specialNeeds: '' }]);
    } catch (err) {
      console.error('Failed to submit requirements:', err);
      toast.error('Failed to submit requirements. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const loadLastSemesterTemplate = () => {
    // Mock template data
    setRequirements([
      { courseUnit: 'Data Structures', courseCode: 'CS201', lecturerName: 'Dr. Ochieng', numberOfStudents: 250, specialNeeds: 'Projector required' },
      { courseUnit: 'Database Systems', courseCode: 'CS301', lecturerName: 'Dr. Wanjiku', numberOfStudents: 180, specialNeeds: 'Lab access needed' },
      { courseUnit: 'Software Engineering', courseCode: 'CS401', lecturerName: 'Dr. Ochieng', numberOfStudents: 160, specialNeeds: 'Group work spaces' }
    ]);
    setUseTemplate(true);
    toast.info('Last semester template loaded. You can now edit and submit.');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">COD Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Department coordination and requirement submission</p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="shadow-card">
              <CardContent className="pt-5 pb-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-12" />
                </div>
              </CardContent>
            </Card>
          ))
          : [
            { label: 'Pending Requests', value: pending, icon: Clock, color: 'text-warning' },
            { label: 'Accepted', value: accepted, icon: CheckCircle, color: 'text-success' },
            { label: 'Cross-Dept Requests', value: crossDeptPending, icon: Users2, color: 'text-info' },
            { label: 'Planned Trips', value: tripsCount, icon: Plane, color: 'text-info' },
            { label: 'Unread Alerts', value: unread, icon: FileText, color: 'text-destructive' },
          ].map(s => (
            <Card key={s.label} className="shadow-card">
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                    <p className="text-3xl font-heading font-bold text-foreground mt-1">{s.value}</p>
                  </div>
                  <s.icon className={`w-10 h-10 ${s.color} opacity-80`} />
                </div>
              </CardContent>
            </Card>
          ))
        }
      </div>

      {/* Requirement Submission Section */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-heading flex items-center justify-between">
            <span>Requirement Elicitation System</span>
            <Dialog open={showRequirementDialog} onOpenChange={setShowRequirementDialog}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Submit Requirements
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Submit Department Requirements</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <Button variant="outline" onClick={loadLastSemesterTemplate} className="flex-1">
                      <Edit className="h-4 w-4 mr-2" />
                      Use Last Semester Template
                    </Button>
                    <Button variant="outline" onClick={() => { setUseTemplate(false); setRequirements([{ courseUnit: '', courseCode: '', lecturerName: '', numberOfStudents: 0, specialNeeds: '' }]); }} className="flex-1">
                      <Plus className="h-4 w-4 mr-2" />
                      Start from Scratch
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Course Requirements</h4>
                    {requirements.map((req, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-4 border rounded-lg">
                        <div>
                          <label className="text-sm font-medium">Course Unit</label>
                          <input
                            type="text"
                            className="w-full mt-1 p-2 border rounded"
                            value={req.courseUnit}
                            onChange={(e) => handleRequirementChange(index, 'courseUnit', e.target.value)}
                            placeholder="e.g., Data Structures"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Course Code</label>
                          <input
                            type="text"
                            className="w-full mt-1 p-2 border rounded"
                            value={req.courseCode}
                            onChange={(e) => handleRequirementChange(index, 'courseCode', e.target.value)}
                            placeholder="e.g., CS201"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Lecturer</label>
                          <input
                            type="text"
                            className="w-full mt-1 p-2 border rounded"
                            value={req.lecturerName}
                            onChange={(e) => handleRequirementChange(index, 'lecturerName', e.target.value)}
                            placeholder="e.g., Dr. Ochieng"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Students</label>
                          <input
                            type="number"
                            className="w-full mt-1 p-2 border rounded"
                            value={req.numberOfStudents}
                            onChange={(e) => handleRequirementChange(index, 'numberOfStudents', parseInt(e.target.value) || 0)}
                            placeholder="150"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Special Needs</label>
                          <input
                            type="text"
                            className="w-full mt-1 p-2 border rounded"
                            value={req.specialNeeds}
                            onChange={(e) => handleRequirementChange(index, 'specialNeeds', e.target.value)}
                            placeholder="Projector, Lab access, etc."
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <Button onClick={handleAddRequirement} variant="outline" className="flex-1">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Another Course
                    </Button>
                    <Button onClick={handleSubmitRequirements} className="flex-1" disabled={submitting}>
                      <Send className="h-4 w-4 mr-2" />
                      {submitting ? 'Submitting...' : 'Submit to Timetabling Admin'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-medium">Template-Based</h4>
              <p className="text-sm text-muted-foreground">Use last semester's requirements as starting point</p>
            </div>
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <Users2 className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-medium">Cross-Department</h4>
              <p className="text-sm text-muted-foreground">Incorporate requests from other departments</p>
            </div>
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <Send className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-medium">Direct Submission</h4>
              <p className="text-sm text-muted-foreground">Submit compiled requirements to timetabling admin</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cross-Department Requests Section */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-heading">Cross-Department Course Requests</CardTitle>
          <p className="text-sm text-muted-foreground">Requests from other departments for your courses</p>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {crossDeptRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{request.courseUnit}</h4>
                    <p className="text-sm text-muted-foreground">
                      Requested by {request.requesterName} from {request.requestingDepartment} • {request.numberOfStudents} students
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={request.status === 'accepted' ? 'default' : 'secondary'}>
                      {request.status}
                    </Badge>
                    {request.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Accept</Button>
                        <Button size="sm" variant="outline">Decline</Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base font-heading">Recent Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {courseRequests.map(r => (
                  <div key={r.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-foreground">{r.courseUnit}</p>
                      <p className="text-xs text-muted-foreground">{r.requestingDept} → {r.providingDept} • {r.cohortSize} students</p>
                    </div>
                    <Badge variant={r.status === 'accepted' ? 'default' : r.status === 'pending' ? 'secondary' : 'destructive'}>
                      {r.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base font-heading">Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.slice(0, 4).map(n => (
                  <div key={n.id} className={`py-2 border-b border-border/50 last:border-0 ${!n.read ? 'pl-2 border-l-2 border-l-primary' : ''}`}>
                    <p className="text-sm font-medium text-foreground">{n.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
