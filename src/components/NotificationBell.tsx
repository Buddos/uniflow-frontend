import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { fetchNotifications } from '@/services/api';
import {
  Popover, PopoverContent, PopoverTrigger,
} from '@/components/ui/popover';
import type { Notification } from '@/types';

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications()
      .then(data => {
        setNotifications(data);
      })
      .catch(err => {
        console.error('Failed to fetch notifications:', err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative p-2 rounded-md hover:bg-secondary transition-colors" aria-label="Notifications">
          <Bell className="w-5 h-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 text-[10px] font-bold rounded-full bg-destructive text-destructive-foreground flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-3 border-b border-border">
          <h3 className="font-heading font-semibold text-sm">Notifications</h3>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {loading ? (
            <div className="px-3 py-4 text-sm text-muted-foreground text-center">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="px-3 py-4 text-sm text-muted-foreground text-center">No notifications</div>
          ) : (
            notifications.map(n => (
              <div key={n.id} className={`px-3 py-2.5 border-b border-border/50 last:border-0 ${!n.read ? 'bg-primary/5' : ''}`}>
                <p className="text-sm font-medium text-foreground">{n.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
