import { useAuth } from '@/context/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { CODDashboard } from '@/components/dashboard/CODDashboard';
import { LecturerDashboard } from '@/components/dashboard/LecturerDashboard';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-foreground">
            Welcome, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        {user?.role === 'admin' && <AdminDashboard />}
        {user?.role === 'cod' && <CODDashboard />}
        {user?.role === 'lecturer' && <LecturerDashboard />}
      </div>
    </AppLayout>
  );
}
