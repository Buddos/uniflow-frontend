import { useEffect } from 'react';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { RealtimeMessage } from '@/services/websocket';

export function useRealtimeUpdates(
  entityType: string,
  onUpdate: (message: RealtimeMessage) => void
) {
  const { onEntityUpdate } = useWebSocket();

  useEffect(() => {
    const unsubscribe = onEntityUpdate(entityType, onUpdate);

    return unsubscribe;
  }, [entityType, onEntityUpdate, onUpdate]);
}

// Specific hooks for each entity type
export function useRealtimeBookings(onUpdate: (message: RealtimeMessage) => void) {
  useRealtimeUpdates('bookings', onUpdate);
}

export function useRealtimeVenues(onUpdate: (message: RealtimeMessage) => void) {
  useRealtimeUpdates('venues', onUpdate);
}

export function useRealtimeTimetables(onUpdate: (message: RealtimeMessage) => void) {
  useRealtimeUpdates('timetables', onUpdate);
}

export function useRealtimeTrips(onUpdate: (message: RealtimeMessage) => void) {
  useRealtimeUpdates('trips', onUpdate);
}

export function useRealtimeNotifications(onUpdate: (message: RealtimeMessage) => void) {
  useRealtimeUpdates('notifications', onUpdate);
}

export function useRealtimeRequests(onUpdate: (message: RealtimeMessage) => void) {
  useRealtimeUpdates('requests', onUpdate);
}