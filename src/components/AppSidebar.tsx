import {
  LayoutDashboard, Calendar, Building2, Map, FileText,
  Plane, BookOpen, Bell, Wrench, LogOut, GraduationCap,
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarFooter, useSidebar,
} from '@/components/ui/sidebar';

const navItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'cod', 'lecturer'] },
  { title: 'Semester Workflow', url: '/workflow', icon: FileText, roles: ['admin', 'cod', 'lecturer'] },
  { title: 'Timetable', url: '/timetable', icon: Calendar, roles: ['admin', 'cod', 'lecturer'] },
  { title: 'Venues', url: '/venues', icon: Building2, roles: ['admin', 'cod', 'lecturer'] },
  { title: 'Live Map', url: '/live-map', icon: Map, roles: ['admin', 'cod'] },
  { title: 'Course Requests', url: '/course-requests', icon: FileText, roles: ['admin', 'cod'] },
  { title: 'Academic Trips', url: '/trips', icon: Plane, roles: ['admin', 'cod'] },
  { title: 'Makeup Classes', url: '/makeup', icon: BookOpen, roles: ['lecturer'] },
  { title: 'Equipment', url: '/equipment', icon: Wrench, roles: ['admin'] },
  { title: 'Notifications', url: '/notifications', icon: Bell, roles: ['admin', 'cod', 'lecturer'] },
];

export function AppSidebar() {
  const { user, logout } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();

  const filteredItems = navItems.filter(item => user && item.roles.includes(user.role));

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

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map(item => (
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
      </SidebarContent>

      <SidebarFooter className="p-3">
        {!collapsed && user && (
          <div className="px-2 py-2 mb-2">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{user.name}</p>
            <p className="text-xs text-sidebar-foreground/60 capitalize">{user.role === 'cod' ? 'Head of Department' : user.role}</p>
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
