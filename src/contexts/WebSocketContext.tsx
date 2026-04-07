import React, { createContext, useContext, useEffect, useState } from 'react';
import { websocketService, RealtimeMessage } from '@/services/websocket';

interface WebSocketContextType {
  isConnected: boolean;
  onEntityUpdate: (entityType: string, callback: (message: RealtimeMessage) => void) => () => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Attempt WebSocket connection but don't block rendering if it fails
    const timeout = setTimeout(() => {
      websocketService.connect()
        .then(() => {
          setIsConnected(true);
        })
        .catch((error) => {
          console.warn('WebSocket connection failed (non-blocking):', error);
          setIsConnected(false);
        });
    }, 100);

    // Cleanup on unmount
    return () => {
      clearTimeout(timeout);
      websocketService.disconnect();
    };
  }, []);

  const onEntityUpdate = (entityType: string, callback: (message: RealtimeMessage) => void) => {
    return websocketService.onEntityUpdate(entityType, callback);
  };

  return (
    <WebSocketContext.Provider value={{ isConnected, onEntityUpdate }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
}