import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WebSocketProvider } from "@/contexts/WebSocketContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/ErrorBoundary";
import { DashboardLayout } from "@/components/DashboardLayout";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import TimetablePage from "@/pages/TimetablePage";
import VenuesPage from "@/pages/VenuesPage";
import LiveMapPage from "@/pages/LiveMapPage";
import CourseRequestsPage from "@/pages/CourseRequestsPage";
import TripsPage from "@/pages/TripsPage";
import MakeupPage from "@/pages/MakeupPage";
import NotificationsPage from "@/pages/NotificationsPage";
import EquipmentPage from "@/pages/EquipmentPage";
import WorkflowPage from "@/pages/WorkflowPage";
import NotFound from "@/pages/NotFound";
import Index from "@/pages/Index";
import AdminConsolidationPage from "@/pages/AdminConsolidationPage";
import TimetablingAdminDashboard from "@/pages/TimetablingAdminDashboard";
import ConsolidateSubmissionsPage from "@/pages/ConsolidateSubmissionsPage";
import ReviewCrossDepRequestsPage from "@/pages/ReviewCrossDepRequestsPage";
import AllocateVenuesPage from "@/pages/AllocateVenuesPage";
import ClassRepFeedbackPage from "@/pages/ClassRepFeedbackPage";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <DashboardLayout>{children}</DashboardLayout>;
}

function RoleProtectedRoute({
  children,
  allowedRoles,
  redirectTo = '/dashboard',
}: {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}) {
  const { isAuthenticated, currentRole } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (currentRole && !allowedRoles.includes(currentRole)) return <Navigate to={redirectTo} replace />;
  return <DashboardLayout>{children}</DashboardLayout>;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/" element={<Index />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/admin/consolidation" element={<ProtectedRoute><AdminConsolidationPage /></ProtectedRoute>} />
      <Route path="/timetabling-admin/dashboard" element={<ProtectedRoute><TimetablingAdminDashboard /></ProtectedRoute>} />
      <Route path="/timetabling-admin/consolidate" element={<ProtectedRoute><ConsolidateSubmissionsPage /></ProtectedRoute>} />
      <Route path="/timetabling-admin/requests" element={<ProtectedRoute><ReviewCrossDepRequestsPage /></ProtectedRoute>} />
      <Route path="/timetabling-admin/allocate-venues" element={<ProtectedRoute><AllocateVenuesPage /></ProtectedRoute>} />
      <Route path="/timetabling-admin/feedback" element={<ProtectedRoute><ClassRepFeedbackPage /></ProtectedRoute>} />
      <Route path="/workflow" element={<ProtectedRoute><WorkflowPage /></ProtectedRoute>} />
      <Route path="/timetable" element={<ProtectedRoute><TimetablePage /></ProtectedRoute>} />
      <Route path="/venues" element={<ProtectedRoute><VenuesPage /></ProtectedRoute>} />
      <Route path="/live-map" element={<ProtectedRoute><LiveMapPage /></ProtectedRoute>} />
      <Route path="/course-requests" element={<ProtectedRoute><CourseRequestsPage /></ProtectedRoute>} />
        <Route path="/courserequest.jsp" element={<ProtectedRoute><CourseRequestsPage /></ProtectedRoute>} />
      <Route path="/trips" element={<ProtectedRoute><TripsPage /></ProtectedRoute>} />
      <Route path="/makeup" element={<RoleProtectedRoute allowedRoles={['admin', 'cod', 'lecturer']}><MakeupPage /></RoleProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
      <Route path="/equipment" element={<ProtectedRoute><EquipmentPage /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <WebSocketProvider>
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </WebSocketProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
