import { useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, MapPin, Map, BookOpen, Plane,
  GraduationCap, Bell, Settings, LogOut, Cpu, ChevronLeft
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useAuth } from '@/context/AuthContext';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarFooter, SidebarHeader, useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

const adminNav = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Timetable', url: '/timetable', icon: Calendar },
  { title: 'Venues', url: '/venues', icon: MapPin },
  { title: 'Live Map', url: '/live-map', icon: Map },
  { title: 'Course Requests', url: '/course-requests', icon: BookOpen },
  { title: 'Academic Trips', url: '/academic-trips', icon: Plane },
  { title: 'Makeup Classes', url: '/makeup-classes', icon: GraduationCap },
  { title: 'Equipment', url: '/equipment', icon: Cpu },
];

const codNav = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Timetable', url: '/timetable', icon: Calendar },
  { title: 'Course Requests', url: '/course-requests', icon: BookOpen },
  { title: 'Academic Trips', url: '/academic-trips', icon: Plane },
  { title: 'Live Map', url: '/live-map', icon: Map },
];

const lecturerNav = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'My Timetable', url: '/timetable', icon: Calendar },
  { title: 'Makeup Classes', url: '/makeup-classes', icon: GraduationCap },
  { title: 'Live Map', url: '/live-map', icon: Map },
];

export function AppSidebar() {
  const { user, logout } = useAuth();
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();

  const navItems = user?.role === 'admin' ? adminNav : user?.role === 'cod' ? codNav : lecturerNav;

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="gradient-sidebar p-4">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display text-sm font-bold text-sidebar-primary-foreground">UniFlow</h1>
                <p className="text-[10px] text-sidebar-foreground/60">CARS 2.0</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center mx-auto">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="gradient-sidebar">
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="text-sidebar-foreground/40 text-[10px] uppercase tracking-widest px-4">Navigation</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="gradient-sidebar p-3">
        {!collapsed && user && (
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-sidebar-accent/50 mb-2">
            <div className="h-8 w-8 rounded-full bg-sidebar-primary/20 flex items-center justify-center text-sidebar-primary text-xs font-bold">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-sidebar-foreground truncate">{user.name}</p>
              <p className="text-[10px] text-sidebar-foreground/50 capitalize">{user.role === 'cod' ? 'Head of Dept.' : user.role}</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="w-full justify-start text-sidebar-foreground/50 hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4 mr-2" />
          {!collapsed && 'Sign Out'}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
