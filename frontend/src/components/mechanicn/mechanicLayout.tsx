import { useState, useEffect, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MechanicSidebar from '../../pages/mechanic/MechanicSidebar';
import MechanicHeader from '../../pages/mechanic/MechanicHeader';
import NotificationPanel, { Notification } from '../mechanicn/NotificationPanel';
import { selectEmployeeAuthData } from '../../store/selectors';
import { io } from 'socket.io-client';

const MechanicLayout = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { employeeData } = useSelector(selectEmployeeAuthData);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [globalUnreadCount, setGlobalUnreadCount] = useState(0);
  const token = employeeData?.token;
  const userId = employeeData?.id;

  const mechanicId = employeeData?.id || '';
  const mechanicName = `${employeeData?.employeeName || 'Unknown'} - ${employeeData?.position || 'Mechanic'}`;
  
  const location = useLocation();
  
  const getActivePage = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'dashboard';
    if (path.includes('/tasks')) return 'tasks';
    if (path.includes('/complaints')) return 'complaints';
    if (path.includes('/history')) return 'history';
    return 'dashboard';
  };

   useEffect(() => {
    if (!userId || !token) return;

    const socket = io("http://localhost:5000", {
      transports: ["websocket"],
      auth: { token },
      withCredentials: true,
    });

    socket.on("connect", () => {
      socket.emit("join_user_room", userId);
    });

    socket.on("new_chat_notification", () => {
      setGlobalUnreadCount((prev) => prev + 1);
    });

    socket.on("chat_notifications_read", () => {
      setGlobalUnreadCount(0);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, token]);

  // NEW: Load initial notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/notification/notifications/${mechanicId}`);
        if (response.ok) {
          const data = await response.json();
          setNotifications(data.notifications || []);
          setUnreadCount(data.unreadCount || 0);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    if (mechanicId) {
      fetchNotifications();
    }
  }, [mechanicId]);

  const handleNotificationToggle = () => {
    setShowNotifications(!showNotifications);
  };

  // UPDATED: Improved notification handler
  const handleNewNotification = useCallback((newNotification: Notification) => {
    console.log('📢 New notification received:', newNotification);
    setNotifications(prev => {
      // Prevent duplicates
      if (prev.some(n => n._id === newNotification._id)) return prev;
      return [newNotification, ...prev];
    });
    setUnreadCount(prev => prev + 1);
  }, []);

  // UPDATED: Mark single notification as read
  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/notification/notifications/${notificationId}/mark-read`,
        { method: 'POST', credentials: 'include' }
      );

      if (response.ok) {
        setNotifications(prev =>
          prev.map(n =>
            n._id === notificationId ? { ...n, read: true } : n
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // UPDATED: Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/notification/notifications/mark-all-read`,
        { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: mechanicId }),
          credentials: 'include'
        }
      );

      if (response.ok) {
        setNotifications(prev =>
          prev.map(n => ({ ...n, read: true }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // NEW: Update unread count whenever notifications change
  useEffect(() => {
    const count = notifications.filter(n => !n.read).length;
    setUnreadCount(count);
  }, [notifications]);

  if (!mechanicId) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading...</h2>
          <p className="text-gray-600">Please wait while we load your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <MechanicSidebar activePage={getActivePage()} />
      
      <div className="md:ml-64 min-h-screen">
        <MechanicHeader
          mechanicName={mechanicName}
          isCheckedIn={isCheckedIn}
          onCheckIn={() => setIsCheckedIn(true)}
          onCheckOut={() => setIsCheckedIn(false)}
          onNotificationClick={handleNotificationToggle}
          notificationCount={unreadCount} 
        />
        
        <div className="p-6">
          <Outlet />
        </div>
      </div>
      
      {showNotifications && (
        <NotificationPanel 
          onClose={() => setShowNotifications(false)}
          recipientId={mechanicId}
          notifications={notifications}
          onNewNotification={handleNewNotification}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
        />
      )}
    </div>
  );
};

export default MechanicLayout;