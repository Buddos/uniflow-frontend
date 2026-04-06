import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Clock, MessageSquare, Plus, Send } from 'lucide-react';
import { toast } from 'sonner';

interface ClassIssue {
  id: string;
  title: string;
  description: string;
  category: string;
  venue?: string;
  status: 'pending' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
}

export function ClassRepDashboard() {
  const [issues, setIssues] = useState<ClassIssue[]>([
    {
      id: '1',
      title: 'Projector not working in Room 101',
      description: 'The projector in Room 101 is not displaying properly during lectures.',
      category: 'Equipment',
      venue: 'Room 101',
      status: 'pending',
      priority: 'high',
      createdAt: '2026-04-06T10:00:00Z',
      updatedAt: '2026-04-06T10:00:00Z'
    },
    {
      id: '2',
      title: 'AC not working in Lecture Hall A',
      description: 'The air conditioning system is not functioning, making the room very hot.',
      category: 'Facilities',
      venue: 'Lecture Hall A',
      status: 'in_progress',
      priority: 'urgent',
      createdAt: '2026-04-05T14:30:00Z',
      updatedAt: '2026-04-06T09:15:00Z'
    }
  ]);

  const [showReportForm, setShowReportForm] = useState(false);
  const [newIssue, setNewIssue] = useState({
    title: '',
    description: '',
    category: '',
    venue: '',
    priority: 'medium' as const
  });

  const handleSubmitIssue = (e: React.FormEvent) => {
    e.preventDefault();

    const issue: ClassIssue = {
      id: Date.now().toString(),
      title: newIssue.title,
      description: newIssue.description,
      category: newIssue.category,
      venue: newIssue.venue,
      status: 'pending',
      priority: newIssue.priority,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setIssues(prev => [issue, ...prev]);
    setNewIssue({ title: '', description: '', category: '', venue: '', priority: 'medium' });
    setShowReportForm(false);
    toast.success('Issue reported successfully!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const pendingIssues = issues.filter(i => i.status === 'pending').length;
  const inProgressIssues = issues.filter(i => i.status === 'in_progress').length;
  const resolvedIssues = issues.filter(i => i.status === 'resolved').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Class Representative Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Report and track class issues</p>
        </div>
        <Button onClick={() => setShowReportForm(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Report Issue
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-card">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Issues</p>
                <p className="text-3xl font-heading font-bold text-foreground mt-1">{pendingIssues}</p>
              </div>
              <Clock className="w-10 h-10 text-yellow-500 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-3xl font-heading font-bold text-foreground mt-1">{inProgressIssues}</p>
              </div>
              <AlertTriangle className="w-10 h-10 text-blue-500 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="text-3xl font-heading font-bold text-foreground mt-1">{resolvedIssues}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-500 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Issue Form */}
      {showReportForm && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Report New Issue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitIssue} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Issue Title</Label>
                  <Input
                    id="title"
                    placeholder="Brief description of the issue"
                    value={newIssue.title}
                    onChange={(e) => setNewIssue(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={newIssue.category} onValueChange={(value) => setNewIssue(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Equipment">Equipment</SelectItem>
                      <SelectItem value="Facilities">Facilities</SelectItem>
                      <SelectItem value="Venue">Venue Issues</SelectItem>
                      <SelectItem value="Teaching">Teaching Resources</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="venue">Venue (Optional)</Label>
                  <Input
                    id="venue"
                    placeholder="e.g., Room 101, Lecture Hall A"
                    value={newIssue.venue}
                    onChange={(e) => setNewIssue(prev => ({ ...prev, venue: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={newIssue.priority} onValueChange={(value: any) => setNewIssue(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed information about the issue..."
                  value={newIssue.description}
                  onChange={(e) => setNewIssue(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Submit Report
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowReportForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Issues List */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Reported Issues</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {issues.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No issues reported yet.</p>
            ) : (
              issues.map((issue) => (
                <div key={issue.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{issue.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{issue.description}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Badge className={getStatusColor(issue.status)}>
                        {issue.status.replace('_', ' ')}
                      </Badge>
                      <Badge className={getPriorityColor(issue.priority)}>
                        {issue.priority}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <div className="flex gap-4">
                      <span>Category: {issue.category}</span>
                      {issue.venue && <span>Venue: {issue.venue}</span>}
                    </div>
                    <span>Reported: {new Date(issue.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}