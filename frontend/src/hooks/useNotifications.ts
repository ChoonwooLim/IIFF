import { useState, useEffect, useRef, useCallback } from 'react';

export interface Notification {
  id: string;
  type: string;
  data: Record<string, unknown>;
  timestamp: number;
}

export function useNotifications(enabled: boolean) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoRemoveTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    const timer = autoRemoveTimers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      autoRemoveTimers.current.delete(id);
    }
  }, []);

  const addNotification = useCallback((notif: Notification) => {
    setNotifications((prev) => [...prev, notif]);
    const timer = setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== notif.id));
      autoRemoveTimers.current.delete(notif.id);
    }, 5000);
    autoRemoveTimers.current.set(notif.id, timer);
  }, []);

  const connect = useCallback(() => {
    if (!enabledRef.current) return;

    const token = localStorage.getItem('access_token');
    if (!token) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const url = `${protocol}//${host}/ws/notifications?token=${token}`;

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        const notif: Notification = {
          id: msg.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          type: msg.type,
          data: msg.data || msg,
          timestamp: msg.timestamp || Date.now(),
        };
        addNotification(notif);
      } catch {
        // Ignore malformed messages
      }
    };

    ws.onclose = () => {
      wsRef.current = null;
      if (enabledRef.current) {
        reconnectTimer.current = setTimeout(connect, 3000);
      }
    };

    ws.onerror = () => {
      ws.close();
    };
  }, [addNotification]);

  useEffect(() => {
    if (enabled) {
      connect();
    }

    return () => {
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
        reconnectTimer.current = null;
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      autoRemoveTimers.current.forEach((t) => clearTimeout(t));
      autoRemoveTimers.current.clear();
    };
  }, [enabled, connect]);

  return { notifications, removeNotification };
}
