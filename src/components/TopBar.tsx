import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationBell } from '@/components/NotificationBell';

export function TopBar() {
  const { user } = useAuth();

  return (
    <header className="h-14 flex items-center justify-between border-b border-border bg-card px-4">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <div className="hidden sm:block">
          <h2 className="text-sm font-medium text-foreground">
            Welcome, {user?.name?.split(' ').slice(-1)[0]}
          </h2>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <NotificationBell />
        <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
          {user?.name?.charAt(0)}
        </div>
      </div>
    </header>
  );
}
