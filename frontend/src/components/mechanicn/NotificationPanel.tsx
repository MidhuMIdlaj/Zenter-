import React, { useEffect, useRef, useState } from 'react';
import { X, Bell } from 'lucide-react';
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
  type?: string;
  senderId?: string;
  senderName?: string;
  senderRole?: string;
  conversationId?: string;
}

interface NotificationPanelProps {
  onClose: () => void;
  recipientId: string;
  notifications: Notification[];
  onNewNotification: (notification: Notification) => void;
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
  socket: any | null;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  onClose,
  recipientId,
  notifications,
  onNewNotification,
  onMarkAsRead,
  onMarkAllAsRead,
  socket,
}) => {
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [debugInfo, setDebugInfo] = useState<any>({});
  const navigate = useNavigate();
  const { employeeData } = useSelector(selectEmployeeAuthData);
  const token = employeeData?.token;
  const panelRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!recipientId || !socket) return;

    socket.on('connect', () => {
      setConnectionStatus('Connected');
      setDebugInfo((prev: any) => ({ ...prev, socketId: socket.id, connected: true }));
    });

    socket.on('connect_error', (error: any) => {
      setConnectionStatus('Connection Error');
      setDebugInfo((prev: any) => ({ ...prev, error: error.message }));
    });

    socket.on('disconnect', (reason: any) => {
      setConnectionStatus('Disconnected');
      setDebugInfo((prev: any) => ({ ...prev, connected: false, disconnectReason: reason }));
    });

    socket.on('new_complaint_assigned', (data: Notification) => {
      const newNotification: Notification = {
        _id: data._id || `temp-${Date.now()}`,
        title: data.title || 'New Complaint',
        message: data.message || 'You have been assigned a new complaint',
        createdAt: data.createdAt || new Date().toISOString(),
        read: false,
        complaintId: data.complaintId,
        deadline: data.deadline,
        type: 'complaint',
      };
      onNewNotification(newNotification);
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(newNotification.title, {
          body: newNotification.message,
          icon: '/favicon.ico',
        });
      }
    });

    return () => {
      socket.off('new_complaint_assigned');
      socket.off('connect');
      socket.off('connect_error');
      socket.off('disconnect');
    };
  }, [recipientId, socket, onNewNotification]);

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
      onMarkAsRead(notification._id);
    }
    if (notification.type === 'complaint' && notification.complaintId) {
      navigate('/mechanic/tasks', {
        state: {
          complaintId: notification.complaintId,
          fromNotification: true,
        },
      });
    } else if (notification.type === 'chat' && notification.conversationId) {
      navigate('/mechanic/chat', {
        state: {
          conversationId: notification.conversationId,
          senderId: notification.senderId,
        },
      });
    }
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
        {process.env.NODE_ENV === 'development' && (
          <div className="px-4 py-2 bg-gray-50 text-xs text-gray-500 border-b">
            Status: {connectionStatus} | Socket: {debugInfo.socketId || 'N/A'}
          </div>
        )}
        <div className="p-3 border-b border-gray-100 flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {unreadNotifications.length} unread notification{unreadNotifications.length !== 1 ? 's' : ''}
          </span>
          {unreadNotifications.length > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              Mark all as read
            </button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center p-4">
              <Bell size={40} className="text-gray-300 mb-2" />
              <p className="text-gray-500">No notifications yet</p>
              <p className="text-sm text-gray-400 mt-1">
                You'll see notifications about new complaints and messages here
              </p>
            </div>
          ) : (
            <>
              {unreadNotifications.length > 0 && (
                <div>
                  <h3 className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50">Unread</h3>
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
                            {notification.type === 'complaint' && notification.deadline && (
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
                            {notification.type === 'chat' && notification.senderName && (
                              <p className="text-xs text-gray-500 mt-1">
                                From: {notification.senderName} ({notification.senderRole})
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
              {readNotifications.length > 0 && (
                <div>
                  <h3 className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50">Earlier</h3>
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
                            {notification.type === 'complaint' && notification.deadline && (
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
                            {notification.type === 'chat' && notification.senderName && (
                              <p className="text-xs text-gray-500 mt-1">
                                From: {notification.senderName} ({notification.senderRole})
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