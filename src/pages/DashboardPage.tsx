import { useAuth } from '@/contexts/AuthContext';
import { AdminDashboard } from '@/components/dashboards/AdminDashboard';
import { CodDashboard } from '@/components/dashboards/CodDashboard';
import { LecturerDashboard } from '@/components/dashboards/LecturerDashboard';
import { ClassRepDashboard } from '@/components/dashboards/ClassRepDashboard';
import { StudentDashboard } from '@/components/dashboards/StudentDashboard';
import TimetablingAdminDashboard from '@/pages/TimetablingAdminDashboard';
import { Navigate } from 'react-router-dom';

export default function DashboardPage() {
  const { user } = useAuth();

  if (user?.role === 'timetabling_admin') return <TimetablingAdminDashboard />;
  if (user?.role === 'admin') return <AdminDashboard />;
  if (user?.role === 'cod') return <CodDashboard />;
  if (user?.role === 'class_rep') return <ClassRepDashboard />;
  if (user?.role === 'student') return <StudentDashboard />;
  
  return <LecturerDashboard />;
}
