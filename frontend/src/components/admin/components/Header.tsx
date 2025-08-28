import React, { useState, useEffect } from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import NotificationModal from './NotificationModal';
import { useSelector } from 'react-redux';
import { selectAdminAuthData } from '../../../store/selectors';
import { io } from 'socket.io-client';
import { NotificationService, getUnreadChatCount, markAllChatNotificationsRead } from '../../../api/NotificationService/NotificationService';

interface Notification {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  type: string;
  senderId?: string;
  senderName?: string;
  conversationId?: string;
}

const Header: React.FC<{ onToggleSidebar: () => void }> = ({ onToggleSidebar }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { adminData } = useSelector(selectAdminAuthData);
  const userId = adminData?.id;
  const token = adminData?.token;
  const role = 'admin';

  const fetchNotifications = async () => {
    if (!userId) return;
    try {
      const response = await NotificationService.getNotificationsForUser(userId);
      if (response.success && response.notifications) {
        setNotifications(response.notifications);
        setUnreadCount(response.notifications.filter((n: Notification) => !n.read).length);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const fetchUnreadCount = async () => {
    if (!userId || !role) return;
    try {
      const count = await getUnreadChatCount(userId, role);
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  const handleMarkAsRead = async (notificationId: string, conversationId?: string) => {
    try {
      if (conversationId) {
        const response = await NotificationService.markChatNotificationAsRead(notificationId, conversationId);
        if (response.success) {
          setNotifications((prev) =>
            prev.map((n) =>
              n._id === notificationId ? { ...n, read: true } : n
            )
          );
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
      } else {
        const response = await NotificationService.markNotificationAsRead(notificationId);
        if (response.success) {
          setNotifications((prev) =>
            prev.map((n) =>
              n._id === notificationId ? { ...n, read: true } : n
            )
          );
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!userId) return;
    try {
      const response = await markAllChatNotificationsRead(userId);
      if (response.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
        const socket = io( import.meta.env.VITE_REACT_APP_BACKEND_URL  ||"http://localhost:5000", { auth: { token } });
        socket.emit("all_chat_notifications_read", { userId });
      }
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    if (!userId || !token) return;

    const socket = io( import.meta.env.VITE_REACT_APP_BACKEND_URL || "http://localhost:5000", {
      transports: ["websocket"],
      auth: { token },
      withCredentials: true,
    });

    socket.on("connect", () => {
      socket.emit("join_user_room", userId);
    });

    socket.on("new_chat_notification", () => {
      setUnreadCount((prev) => prev + 1);
      fetchNotifications();
    });

    socket.on("chat_notifications_read", () => {
      setUnreadCount((prev) => Math.max(0, prev - 1));
      fetchNotifications();
    });

    socket.on("all_chat_notifications_read", () => {
      setUnreadCount(0);
      fetchNotifications();
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, token]);

  useEffect(() => {
    if (isModalOpen) fetchNotifications();
  }, [isModalOpen, userId]);

  return (
    <div className="bg-blue-500 p-4 fixed top-0 left-0 right-0 z-40 shadow-md min-h-16">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        
        {/* Left Side - Project Title + Hamburger */}
        <div className="flex items-center space-x-3">
          {/* Hamburger for small screens */}
          <button
            className="lg:hidden p-2 rounded-md text-white hover:bg-blue-600"
            onClick={onToggleSidebar}
          >
            <Menu size={22} />
          </button>

          <div className="flex flex-col">
          </div>
        </div>

        {/* Right Side - Search + Notifications */}
        <div className="flex items-center space-x-4">
          <div className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Search..."
              className="py-2 pl-10 pr-4 bg-blue-600 text-white placeholder-blue-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 w-64"
            />
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300" />
          </div>
          <div className="relative">
            <button
              onClick={() => setIsModalOpen(true)}
              className="p-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              <Bell size={20} />
            </button>
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Notification Modal always centered */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-start justify-end mt-16 mr-4 z-50">
          <NotificationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
          />
        </div>
      )}
    </div>
  );
};

export default Header;
