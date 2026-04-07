import { useState, useEffect } from 'react';
import { fetchNotifications } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Bell, FileText, Calendar, AlertTriangle, Info } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Notification } from '@/types';

const typeIcons: Record<string, typeof Bell> = {
  request: FileText,
  schedule: Calendar,
  alert: AlertTriangle,
  info: Info,
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNotifications()
      .then(data => {
        setNotifications(data);
        setError(null);
      })
      .catch(err => {
        console.error('Failed to fetch notifications:', err.message);
        setError('Failed to load notifications. Please try again later.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Notifications</h1>
        <p className="text-muted-foreground text-sm mt-1">Stay updated on requests, changes, and alerts</p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-3 max-w-2xl">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="shadow-card">
              <CardContent className="pt-4 pb-3">
                <div className="flex items-start gap-3">
                  <Skeleton className="w-9 h-9 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-64" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
          : notifications.map(n => {
            const Icon = typeIcons[n.type] || Bell;
            return (
              <Card key={n.id} className={`shadow-card ${!n.read ? 'border-l-2 border-l-primary' : ''}`}>
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground">{n.title}</p>
                        {!n.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">{new Date(n.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        {!loading && notifications.length === 0 && (
          <p className="text-center py-12 text-muted-foreground">No notifications yet</p>
        )}
      </div>
    </div>
  );
}
