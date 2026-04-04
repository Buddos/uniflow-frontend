import { mockNotifications } from '@/data/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { Bell, FileText, Calendar, AlertTriangle, Info } from 'lucide-react';

const typeIcons: Record<string, typeof Bell> = {
  request: FileText,
  schedule: Calendar,
  alert: AlertTriangle,
  info: Info,
};

export default function NotificationsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Notifications</h1>
        <p className="text-muted-foreground text-sm mt-1">Stay updated on requests, changes, and alerts</p>
      </div>

      <div className="space-y-3 max-w-2xl">
        {mockNotifications.map(n => {
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
      </div>
    </div>
  );
}
