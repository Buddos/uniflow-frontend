import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// Removed api import
import { toast } from "sonner";
import { FileCheck, Activity, CalendarClock, AlertTriangle } from "lucide-react";

export default function AdminConsolidationPage() {
  const [currentSemester, setCurrentSemester] = useState("Fall 2026");
  const [previousSemester, setPreviousSemester] = useState("Spring 2026");
  const [enforcing, setEnforcing] = useState(false);

  // For visual demo purposes, we fetch all stats and requests. 
  // If backend is not available, we use fallback mock data.
  const { data: requests, refetch } = useQuery({
    queryKey: ['admin-requests'],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/requests`);
        if (!response.ok) throw new Error("Network error");
        return await response.json();
      } catch (err) {
        toast.error("Using local data as backend is unavailable.");
        return [];
      }
    }
  });

  const handleEnforceDeadline = async () => {
    setEnforcing(true);
    try {
      // Typically this would be a POST request to `/api/requests/admin/enforce-deadline`
      await fetch(`/api/requests/admin/enforce-deadline?currentSemester=${currentSemester}&previousSemester=${previousSemester}`, {
        method: "POST"
      });
      toast.success("Deadline enforced! Previous semester data has been pulled as fallback.");
      refetch();
    } catch (e) {
      toast.error("Failed to enforce deadline or connect to backend.");
    } finally {
      setEnforcing(false);
    }
  };

  return (
    <div className="container mx-auto p-6 animate-fade-in space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Timetabling Administration</h1>
          <p className="text-muted-foreground mt-1">Consolidate department requirements and allocate venues for optimal timetabling</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
            <Button variant="outline" onClick={() => refetch()}>
              Refresh Data
            </Button>
            <Button variant="destructive" onClick={handleEnforceDeadline} disabled={enforcing}>
              {enforcing ? "Enforcing..." : "Enforce Deadline Now"}
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Semester</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-primary" /> {currentSemester}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Department Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" /> {requests?.length || 12}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" /> {requests?.filter((r: any) => r.status === 'pending')?.length || 3}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md border-border/50">
        <CardHeader>
          <CardTitle>Department Requirements & Venue Allocation</CardTitle>
          <CardDescription>Submitted course requirements pending venue scheduling</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="py-3 px-4 text-left font-medium">Department</th>
                  <th className="py-3 px-4 text-left font-medium">Course Unit</th>
                  <th className="py-3 px-4 text-left font-medium">Students</th>
                  <th className="py-3 px-4 text-left font-medium">Semester</th>
                  <th className="py-3 px-4 text-left font-medium">Status / Flag</th>
                </tr>
              </thead>
              <tbody>
                {(requests?.length ? requests : [
                   { requestingDepartment: "Computer Science", courseUnit: { code: "CS101", name: "Intro to CS" }, cohortSize: 150, semester: "Fall 2026", status: "accepted", isAutoFallback: false },
                   { requestingDepartment: "Mathematics", courseUnit: { code: "MATH100", name: "Calculus I" }, cohortSize: 200, semester: "Fall 2026", status: "pending", isAutoFallback: false }
                ]).map((req: any, i: number) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-muted/20">
                    <td className="py-3 px-4 font-medium">{req.requestingDepartment}</td>
                    <td className="py-3 px-4">
                      {req.courseUnit?.code} - <span className="text-muted-foreground">{req.courseUnit?.name}</span>
                    </td>
                    <td className="py-3 px-4">{req.cohortSize || req.expectedStudents}</td>
                    <td className="py-3 px-4 text-muted-foreground">{req.semester || "Fall 2026"}</td>
                    <td className="py-3 px-4">
                      {req.isAutoFallback ? (
                        <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50">Auto-Fallback</Badge>
                      ) : (
                        <Badge variant={req.status === 'accepted' ? 'secondary' : 'default'} className="capitalize">
                          <FileCheck className="h-3 w-3 mr-1"/> {req.status}
                        </Badge>
                      )}
                    </td>
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
