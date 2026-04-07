import SockJS from 'sockjs-client';
import { Client, Message } from '@stomp/stompjs';
import { toast } from 'sonner';

export interface RealtimeMessage {
  operation: 'CREATE' | 'UPDATE' | 'DELETE';
  entityType: 'BOOKING' | 'VENUE' | 'TIMETABLE' | 'TRIP' | 'NOTIFICATION' | 'REQUEST';
  timestamp: string;
  payload: any;
}

const getWebSocketUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';
  return apiUrl.replace(/\/api\/?$/, '') + '/ws';
};

class WebSocketService {
  private stompClient: Client | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 5000; // 5 seconds

  private listeners: { [key: string]: ((message: RealtimeMessage) => void)[] } = {};

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isConnected) {
        resolve();
        return;
      }

      if (!this.stompClient) {
        this.stompClient = new Client({
          webSocketFactory: () => new SockJS(getWebSocketUrl()),
          reconnectDelay: this.reconnectInterval,
          debug: (str) => console.debug('[STOMP]', str),
          onConnect: () => {
            console.log('Connected to WebSocket');
            this.isConnected = true;
            this.reconnectAttempts = 0;
            this.subscribeToTopic('/topic/bookings', 'bookings');
            this.subscribeToTopic('/topic/venues', 'venues');
            this.subscribeToTopic('/topic/timetables', 'timetables');
            this.subscribeToTopic('/topic/trips', 'trips');
            this.subscribeToTopic('/topic/notifications', 'notifications');
            this.subscribeToTopic('/topic/requests', 'requests');
            resolve();
          },
          onStompError: (frame) => {
            console.error('STOMP error:', frame.body);
            this.isConnected = false;
            reject(new Error(frame.body));
          },
          onWebSocketError: (error) => {
            console.error('WebSocket error:', error);
            this.isConnected = false;
          }
        });
      }

      try {
        this.stompClient.activate();
      } catch (error) {
        console.error('Failed to activate STOMP client:', error);
        reject(error);
      }
    });
  }

  private subscribeToTopic(topic: string, entityType: string) {
    if (!this.stompClient) return;

    this.stompClient.subscribe(topic, (message: Message) => {
      try {
        const realtimeMessage: RealtimeMessage = JSON.parse(message.body);
        console.log(`Received ${entityType} update:`, realtimeMessage);
        this.showToastForUpdate(realtimeMessage);
        this.notifyListeners(entityType, realtimeMessage);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });
  }

  private showToastForUpdate(message: RealtimeMessage) {
    const { operation, entityType, payload } = message;
    let title = '';
    let description = '';

    switch (entityType) {
      case 'BOOKING':
        title = `Booking ${operation.toLowerCase()}d`;
        description = payload?.purpose || `Booking for ${payload?.venue?.name || 'venue'}`;
        break;
      case 'VENUE':
        title = `Venue ${operation.toLowerCase()}d`;
        description = payload?.name || 'Venue updated';
        break;
      case 'TIMETABLE':
        title = `Timetable ${operation.toLowerCase()}d`;
        description = payload?.courseUnit?.name || 'Timetable entry updated';
        break;
      case 'TRIP':
        title = `Trip ${operation.toLowerCase()}d`;
        description = payload?.title || 'Academic trip updated';
        break;
      case 'NOTIFICATION':
        title = `Notification ${operation.toLowerCase()}d`;
        description = payload?.title || 'Notification updated';
        break;
      case 'REQUEST':
        title = `Request ${operation.toLowerCase()}d`;
        description = payload?.courseUnit?.name || 'Course request updated';
        break;
    }

    if (title && description) {
      toast.info(title, { description });
    }
  }

  private notifyListeners(entityType: string, message: RealtimeMessage) {
    const entityListeners = this.listeners[entityType];
    if (entityListeners) {
      entityListeners.forEach(listener => {
        try {
          listener(message);
        } catch (error) {
          console.error('Error in WebSocket listener:', error);
        }
      });
    }
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.isConnected = false;
    }
  }

  onEntityUpdate(entityType: string, callback: (message: RealtimeMessage) => void) {
    if (!this.listeners[entityType]) {
      this.listeners[entityType] = [];
    }
    this.listeners[entityType].push(callback);

    return () => {
      const index = this.listeners[entityType].indexOf(callback);
      if (index > -1) {
        this.listeners[entityType].splice(index, 1);
      }
    };
  }

  isWebSocketConnected(): boolean {
    return this.isConnected;
  }
}

export const websocketService = new WebSocketService();