import React, { useEffect, useRef, useState } from 'react';
import { X, Bell } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectEmployeeAuthData } from '../../store/selectors';

export interface Notification {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  complaintId?: string;
  deadline?: string;
}

interface NotificationPanelProps {
  onClose: () => void;
  recipientId: string;
  notifications: Notification[];
  onNewNotification: (notification: Notification) => void;
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  onClose,
  recipientId,
  notifications,
  onNewNotification,
  onMarkAsRead,
  onMarkAllAsRead
}) => {
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [debugInfo, setDebugInfo] = useState<any>({});
  const navigate = useNavigate();
  const { employeeData } = useSelector(selectEmployeeAuthData);
  const socketRef = useRef<Socket | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const token = employeeData?.token
  // Handle clicks outside the panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Socket connection and event handlers
   useEffect(() => {
    if (!recipientId) return;

    // Cleanup previous connection if exists
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    console.log('🔌 Initializing socket for mechanic:', recipientId);

    const newSocket = io('http://localhost:5000', {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      timeout: 10000,
      auth: { token }
    });

    socketRef.current = newSocket;

    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id);
      setConnectionStatus('Connected');
      setDebugInfo((prev: any) => ({ ...prev, socketId: newSocket.id, connected: true }));

      newSocket.emit('join_user_room', recipientId, (response: any) => {
        console.log('🏠 Room join response:', response);
        setDebugInfo((prev: any) => ({
          ...prev,
          roomJoined: response?.success,
          room: response?.room,
        }));

        if (response?.success) {
          console.log(`✅ Successfully joined room for mechanic ${recipientId}`);
        } else {
          console.error('❌ Failed to join room');
        }
      });
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error);
      setConnectionStatus('Connection Error');
      setDebugInfo((prev: any) => ({ ...prev, error: error.message }));
    });

    newSocket.on('disconnect', (reason) => {
      console.log('🔌 Socket disconnected:', reason);
      setConnectionStatus('Disconnected');
      setDebugInfo((prev: any) => ({ ...prev, connected: false, disconnectReason: reason }));
    });

    newSocket.on('new_complaint_assigned', (data: any) => {
      console.log('🔥 Received complaint assignment:', data);
      
      const newNotification: Notification = {
        _id: data._id || `temp-${Date.now()}`,
        title: data.title || 'New Complaint',
        message: data.message || 'You have been assigned a new complaint',
        createdAt: data.createdAt || new Date().toISOString(),
        read: false,
        complaintId: data.complaintId,
        deadline: data.deadline,
      };

      onNewNotification(newNotification);

      // Show browser notification if permission is granted
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(newNotification.title, {
          body: newNotification.message,
          icon: '/favicon.ico',
        });
      }
    });

    return () => {
      if (socketRef.current?.connected) {
        console.log('🔌 Cleaning up socket connection');
        socketRef.current.disconnect();
      }
      socketRef.current = null;
    };
  }, [recipientId, token, onNewNotification]);

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/notification/notifications/${notificationId}/mark-read`,
        {
          method: 'POST',
          credentials: 'include',
        }
      );

      if (response.ok) {
        onMarkAsRead(notificationId);
      }
    } catch (error) {
      console.error('❌ Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((n) => !n.read);
      for (const notification of unreadNotifications) {
        await markAsRead(notification._id);
      }
      onMarkAllAsRead();
    } catch (error) {
      console.error('❌ Error marking all notifications as read:', error);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    return date.toLocaleDateString();
  };

  const formatDeadline = (deadline?: string) => {
    if (!deadline) return 'No deadline';
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diffHours = Math.floor((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60));

    if (diffHours <= 0) return 'Deadline passed';
    return `Due in ${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification._id);
    }
    navigate('/mechanic/tasks', {
      state: {
        complaintId: notification.complaintId,
        fromNotification: true,
      },
    });
    onClose();
  };

  const unreadNotifications = notifications.filter((n) => !n.read);
  const readNotifications = notifications.filter((n) => n.read);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60">
      <div 
        ref={panelRef}
        className="bg-white w-full max-w-md h-full shadow-lg flex flex-col animate-slide-in"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <Bell size={20} className="text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold">Notifications</h2>
            {unreadNotifications.length > 0 && (
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {unreadNotifications.length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close notifications"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Connection status (debug) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="px-4 py-2 bg-gray-50 text-xs text-gray-500 border-b">
            Status: {connectionStatus} | Socket: {debugInfo.socketId || 'N/A'}
          </div>
        )}

        {/* Notification actions */}
        <div className="p-3 border-b border-gray-100 flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {unreadNotifications.length} unread notification{unreadNotifications.length !== 1 ? 's' : ''}
          </span>
          {unreadNotifications.length > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Notifications list */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center p-4">
              <Bell size={40} className="text-gray-300 mb-2" />
              <p className="text-gray-500">No notifications yet</p>
              <p className="text-sm text-gray-400 mt-1">
                You'll see notifications about new complaints here
              </p>
            </div>
          ) : (
            <>
              {/* Unread notifications section */}
              {unreadNotifications.length > 0 && (
                <div>
                  <h3 className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50">
                    Unread
                  </h3>
                  <div className="divide-y divide-gray-100">
                    {unreadNotifications.map((notification) => (
                      <div
                        key={notification._id}
                        className="p-4 hover:bg-blue-50 transition-colors cursor-pointer bg-blue-50"
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <p className="font-medium text-gray-800">{notification.title}</p>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            {notification.deadline && (
                              <p
                                className={`text-xs mt-1 ${
                                  new Date(notification.deadline) < new Date()
                                    ? 'text-red-500'
                                    : 'text-yellow-600'
                                }`}
                              >
                                {formatDeadline(notification.deadline)}
                              </p>
                            )}
                          </div>
                          <span className="w-2 h-2 bg-blue-600 rounded-full mt-1.5"></span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          {formatTimestamp(notification.createdAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Read notifications section */}
              {readNotifications.length > 0 && (
                <div>
                  <h3 className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50">
                    Earlier
                  </h3>
                  <div className="divide-y divide-gray-100">
                    {readNotifications.map((notification) => (
                      <div
                        key={notification._id}
                        className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <p className="font-medium text-gray-800">{notification.title}</p>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            {notification.deadline && (
                              <p
                                className={`text-xs mt-1 ${
                                  new Date(notification.deadline) < new Date()
                                    ? 'text-red-500'
                                    : 'text-yellow-600'
                                }`}
                              >
                                {formatDeadline(notification.deadline)}
                              </p>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          {formatTimestamp(notification.createdAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;