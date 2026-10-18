import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { notificationsFor, type AppNotification } from "../services/notifications";
import { useAuth } from "./AuthContext";
import { useData } from "./DataContext";

interface NotificationsValue {
  notifications: AppNotification[];
  unreadCount: number;
  isRead: (id: string) => boolean;
  markAllRead: () => void;
}

const NotificationsContext = createContext<NotificationsValue | null>(null);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { data } = useData();
  const { user } = useAuth();
  const [readIds, setReadIds] = useState<string[]>([]);

  const value = useMemo<NotificationsValue>(() => {
    const notifications = user ? notificationsFor(data, user) : [];
    const isRead = (id: string) => readIds.includes(id);
    return {
      notifications,
      unreadCount: notifications.filter((n) => !isRead(n.id)).length,
      isRead,
      markAllRead: () => setReadIds((ids) => [...ids, ...notifications.map((n) => n.id)]),
    };
  }, [data, user, readIds]);

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) throw new Error("useNotifications must be used inside NotificationsProvider");
  return context;
}
