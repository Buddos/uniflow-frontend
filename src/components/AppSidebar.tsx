import { useCallback, useEffect, useState } from 'react';
import {
  LayoutDashboard, Calendar, Building2, Map, FileText,
  Plane, BookOpen, Bell, Wrench, LogOut, GraduationCap,
  ClipboardList, AlertTriangle, CheckCircle,
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { fetchCourseRequests } from '@/services/api';
import { useRealtimeRequests } from '@/hooks/useRealtimeUpdates';
import { useNavigate } from 'react-router-dom';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarFooter, useSidebar,
} from '@/components/ui/sidebar';

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

type NavItem = {
  title: string;
  url: string;
  icon: IconType;
  roles: string[];
  group?: string;
};

const navItems: NavItem[] = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'cod', 'lecturer', 'class_rep', 'timetabling_admin', 'student'], group: 'Main' },
  
  // Timetabling Admin specific
  { title: 'Timetabling Admin', url: '/timetabling-admin/dashboard', icon: ClipboardList, roles: ['timetabling_admin'], group: 'Admin' },
  { title: 'Consolidate Submissions', url: '/timetabling-admin/consolidate', icon: CheckCircle, roles: ['timetabling_admin'], group: 'Admin' },
  { title: 'Review Requirements', url: '/timetabling-admin/requests', icon: FileText, roles: ['timetabling_admin'], group: 'Admin' },
  { title: 'Allocate Venues', url: '/timetabling-admin/allocate-venues', icon: Building2, roles: ['timetabling_admin'], group: 'Admin' },
  { title: 'Class Rep Feedback', url: '/timetabling-admin/feedback', icon: AlertTriangle, roles: ['timetabling_admin'], group: 'Admin' },

  // Shared
  { title: 'Semester Workflow', url: '/workflow', icon: FileText, roles: ['admin', 'cod', 'lecturer'], group: 'Planning' },
  { title: 'Timetable', url: '/timetable', icon: Calendar, roles: ['admin', 'cod', 'lecturer', 'class_rep', 'timetabling_admin', 'student'], group: 'Planning' },
  { title: 'Venues', url: '/venues', icon: Building2, roles: ['admin', 'cod', 'lecturer', 'class_rep', 'timetabling_admin', 'student'], group: 'Planning' },
  { title: 'Live Map', url: '/live-map', icon: Map, roles: ['admin', 'cod', 'class_rep', 'student'], group: 'Planning' },
  
  // COD & Admin Only
  { title: 'Course Requests', url: '/course-requests', icon: FileText, roles: ['admin', 'cod'], group: 'Department' },
  { title: 'Academic Trips', url: '/trips', icon: Plane, roles: ['admin', 'cod'], group: 'Department' },
  
  // Lecturer Only
  { title: 'Makeup Classes', url: '/makeup', icon: BookOpen, roles: ['lecturer'], group: 'Teaching' },
  
  // Admin only
  { title: 'Equipment', url: '/equipment', icon: Wrench, roles: ['admin'], group: 'Management' },
  
  // All
  { title: 'Notifications', url: '/notifications', icon: Bell, roles: ['admin', 'cod', 'lecturer', 'class_rep', 'timetabling_admin', 'student'] },
];

export function AppSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const [rejectedCount, setRejectedCount] = useState(0);

  const refreshRejectedCount = useCallback(() => {
    if (!user || (user.role !== 'cod' && user.role !== 'admin')) {
      setRejectedCount(0);
      return;
    }

    fetchCourseRequests()
      .then(requests => {
        const relevant = user.role === 'cod' && user.department
          ? requests.filter(request => request.requestingDept === user.department)
          : requests;
        setRejectedCount(relevant.filter(request => request.status === 'rejected').length);
      })
        .catch(() => setRejectedCount(0));
      }, [user]);

  useEffect(() => {
    refreshRejectedCount();
  }, [refreshRejectedCount]);

  useRealtimeRequests(() => {
    refreshRejectedCount();
  });

  const filteredItems = navItems.filter(item => user && item.roles.includes(user.role));
  
  // Group items by section
  const groupedItems = filteredItems.reduce((acc, item) => {
    const group = item.group || 'Other';
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {} as Record<string, NavItem[]>);

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      'admin': 'Admin',
      'cod': 'Head of Department',
      'class_rep': 'Class Rep',
      'lecturer': 'Lecturer',
      'timetabling_admin': 'Timetabling Admin',
      'student': 'Student'
    };
    return labels[role] || role;
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {/* Logo */}
        <div className="px-4 py-5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shrink-0">
            <GraduationCap className="w-4 h-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="font-heading font-bold text-sidebar-foreground text-lg">UniFlow</span>
          )}
        </div>

        {/* Navigation Groups */}
        {Object.entries(groupedItems).map(([group, items]) => (
          <SidebarGroup key={group}>
            {!collapsed && <SidebarGroupLabel>{group}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map(item => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end
                        className="hover:bg-sidebar-accent/50"
                        activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                      >
                        <item.icon className="mr-2 h-4 w-4 shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-3">
        {rejectedCount > 0 && user?.role === 'cod' && (
          <button
            onClick={() => navigate('/course-requests')}
            className="mb-2 flex w-full items-center justify-between rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-left text-sm text-destructive hover:bg-destructive/15 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Bell className="w-4 h-4 shrink-0" />
              Request Rejections
            </span>
            <Badge className="bg-destructive text-destructive-foreground">{rejectedCount}</Badge>
          </button>
        )}
        {!collapsed && user && (
          <div className="px-2 py-2 mb-2">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{user.name}</p>
            <p className="text-xs text-sidebar-foreground/60">
              {getRoleLabel(user.role)}
            </p>
          </div>
        )}
        <button
          onClick={logout}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-md transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
