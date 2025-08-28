// Create a new NotificationContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { selectAdminAuthData, selectEmployeeAuthData } from '../store/selectors';

interface NotificationContextType {
  unreadCounts: Record<string, number>;
  markConversationAsRead: (conversationId: string) => void;
  resetUnreadCount: (conversationId: string) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  unreadCounts: {},
  markConversationAsRead: () => {},
  resetUnreadCount: () => {},
});

export const NotificationProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [socket, setSocket] = useState<Socket | null>(null);
  
  const { adminData } = useSelector(selectAdminAuthData);
  const { employeeData } = useSelector(selectEmployeeAuthData);
  const user = adminData || employeeData;
  
  useEffect(() => {
    if (!user) return;
    
    const newSocket = io( import.meta.env.VITE_REACT_APP_BACKEND_URL ||'http://localhost:5000', {
      auth: { token: user.token },
      transports: ['websocket'],
    });
    
    newSocket.on('connect', () => {
      newSocket.emit('join_user_room', user.id);
    });
    
    newSocket.on('new_message', (message) => {
      const conversationId = message.conversationId;
      setUnreadCounts(prev => ({
        ...prev,
        [conversationId]: (prev[conversationId] || 0) + 1
      }));
    });
    
    newSocket.on('messages_read', ({ conversationId }) => {
      resetUnreadCount(conversationId);
    });
    
    setSocket(newSocket);
    
    return () => {
      newSocket.disconnect();
    };
  }, [user]);
  
  const markConversationAsRead = (conversationId: string) => {
    if (socket && user) {
      socket.emit('mark_messages_read', { 
        conversationId, 
        userId: user.id 
      });
      resetUnreadCount(conversationId);
    }
  };
  
  const resetUnreadCount = (conversationId: string) => {
    setUnreadCounts(prev => ({
      ...prev,
      [conversationId]: 0
    }));
  };
  
  return (
    <NotificationContext.Provider value={{ 
      unreadCounts, 
      markConversationAsRead,
      resetUnreadCount
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);