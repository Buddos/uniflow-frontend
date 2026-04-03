import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Timetable from "./pages/Timetable";
import Venues from "./pages/Venues";
import LiveMap from "./pages/LiveMap";
import CourseRequests from "./pages/CourseRequests";
import AcademicTrips from "./pages/AcademicTrips";
import MakeupClasses from "./pages/MakeupClasses";
import EquipmentPage from "./pages/Equipment";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/timetable" element={<ProtectedRoute><Timetable /></ProtectedRoute>} />
      <Route path="/venues" element={<ProtectedRoute><Venues /></ProtectedRoute>} />
      <Route path="/live-map" element={<ProtectedRoute><LiveMap /></ProtectedRoute>} />
      <Route path="/course-requests" element={<ProtectedRoute><CourseRequests /></ProtectedRoute>} />
      <Route path="/academic-trips" element={<ProtectedRoute><AcademicTrips /></ProtectedRoute>} />
      <Route path="/makeup-classes" element={<ProtectedRoute><MakeupClasses /></ProtectedRoute>} />
      <Route path="/equipment" element={<ProtectedRoute><EquipmentPage /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
