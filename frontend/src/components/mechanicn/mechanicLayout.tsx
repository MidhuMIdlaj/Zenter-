import { useState, useEffect, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MechanicSidebar from '../../pages/mechanic/MechanicSidebar';
import MechanicHeader from '../../pages/mechanic/MechanicHeader';
import NotificationPanel, { Notification } from './NotificationPanel';
import { selectEmployeeAuthData } from '../../store/selectors';
import { io } from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MechanicLayout = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { employeeData } = useSelector(selectEmployeeAuthData);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [globalUnreadCount, setGlobalUnreadCount] = useState(0);
  const [socket, setSocket] = useState<any | null>(null);
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
    if (path.includes('/chat')) return 'chat';
    return 'dashboard';
  };

  const fetchNotifications = useCallback(async () => {
    if (!mechanicId) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/notification/notifications/${mechanicId}`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
        const unread = data.notifications?.filter((n: Notification) => !n.read).length || 0;
        setUnreadCount(unread);
        setGlobalUnreadCount(unread);
        localStorage.setItem('mechanicUnreadCount', unread.toString());
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, [mechanicId, token]);

  useEffect(() => {
    if (!userId || !token) return;

    const newSocket = io( import.meta.env.VITE_REACT_APP_BACKEND_URL ||'http://localhost:5000', {
      transports: ['websocket'],
      auth: { token },
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      newSocket.emit('join_user_room', userId);
      newSocket.emit('join_role_room', 'mechanic');
      setSocket(newSocket);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error in MechanicLayout:', error);
    });

    newSocket.on('new_complaint_assigned', (data: Notification) => {
      setNotifications((prev) => {
        if (prev.some((n) => n._id === data._id)) return prev;
        return [{ ...data, type: 'complaint' }, ...prev];
      });
      setUnreadCount((prev) => prev + 1);
      // setGlobalUnreadCount((prev) => prev + 1);
      localStorage.setItem('mechanicUnreadCount', (globalUnreadCount + 1).toString());
      const toastId = `complaint_${data._id}`;
      if (!toast.isActive(toastId)) {
        toast.info(
          <div style={{
            padding: '12px 16px',
            borderLeft: '4px solid #0d6efd',
            backgroundColor: '#ffffff',
            borderRadius: '6px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
          }}>
            <div style={{ fontSize: '14px', color: '#333', marginBottom: '4px' }}>
              📋 New Complaint Assigned
            </div>
            <div style={{ fontSize: '13px', color: '#555' }}>
              {data.message}
            </div>
          </div>,
          {
            toastId,
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: 'light',
          }
        );
      }
    });

    newSocket.on('new_message', (data: Notification) => {
      if (data.senderRole !== 'coordinator' || location.pathname === '/mechanic/chat') return;
      const newNotification: Notification = {
        _id: data._id || `message-${Date.now()}`,
        title: data.title || 'New Message',
        message: data.message || 'You have a new message',
        createdAt: data.createdAt || new Date().toISOString(),
        read: false,
        type: 'chat',
        senderId: data.senderId,
        senderName: data.senderName,
        senderRole: data.senderRole,
        conversationId: data.conversationId,
      };
      setNotifications((prev) => {
        if (prev.some((n) => n._id === newNotification._id)) return prev;
        return [newNotification, ...prev];
      });
      setUnreadCount((prev) => prev + 1);
      setGlobalUnreadCount((prev) => prev + 1);
      localStorage.setItem('mechanicUnreadCount', (globalUnreadCount + 1).toString());
      const toastId = `message_${newNotification._id}`;
      if (!toast.isActive(toastId)) {
        toast.info(
          <div style={{
            padding: '12px 16px',
            borderLeft: '4px solid #0d6efd',
            backgroundColor: '#ffffff',
            borderRadius: '6px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
          }}>
            <div style={{ fontSize: '14px', color: '#333', marginBottom: '4px' }}>
              📩 New Message
            </div>
            <div style={{ fontSize: '13px', color: '#555' }}>
              From: <strong>{newNotification.senderName} (Coordinator)</strong>
              <br />
              {newNotification.message}
            </div>
          </div>,
          {
            toastId,
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: 'light',
          }
        );
      }
    });

    newSocket.on('chat_notifications_read', () => {
      setUnreadCount((prev) => Math.max(0, prev - 1));
      setGlobalUnreadCount((prev) => Math.max(0, prev - 1));
      localStorage.setItem('mechanicUnreadCount', Math.max(0, globalUnreadCount - 1).toString());
      fetchNotifications();
    });

    newSocket.on('all_chat_notifications_read', () => {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      setGlobalUnreadCount(0);
      localStorage.setItem('mechanicUnreadCount', '0');
      fetchNotifications();
    });

    return () => {
      newSocket.off('new_complaint_assigned');
      newSocket.off('new_message');
      newSocket.off('chat_notifications_read');
      newSocket.off('all_chat_notifications_read');
      newSocket.disconnect();
    };
  }, [userId, token, location.pathname, fetchNotifications, globalUnreadCount]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

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
      <MechanicSidebar activePage={getActivePage()} unreadCount={globalUnreadCount} />
      <div className="md:ml-64 min-h-screen">
        <MechanicHeader
          mechanicName={mechanicName}
          isCheckedIn={isCheckedIn}
          onCheckIn={() => setIsCheckedIn(true)}
          onCheckOut={() => setIsCheckedIn(false)}
          onNotificationClick={() => setShowNotifications(!showNotifications)}
          notificationCount={globalUnreadCount}
          socket={socket}
        />
        <div className="p-6">
          <Outlet context={{ socket }} />
        </div>
      </div>
      {showNotifications && (
        <NotificationPanel
          onClose={() => setShowNotifications(false)}
          recipientId={mechanicId}
          notifications={notifications}
          onNewNotification={(notification) => {
            setNotifications((prev) => {
              if (prev.some((n) => n._id === notification._id)) return prev;
              return [notification, ...prev];
            });
            // Do not increment counts here; handled in socket events
          }}
          onMarkAsRead={async (notificationId) => {
            await fetch(
              `${import.meta.env.VITE_API_BASE_URL}/notification/notifications/${notificationId}/mark-read`,
              {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                credentials: 'include',
              }
            );
            setNotifications((prev) =>
              prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
            setGlobalUnreadCount((prev) => Math.max(0, prev - 1));
            socket?.emit('chat_notifications_read', { userId, notificationId });
          }}
          onMarkAllAsRead={async () => {
            await fetch(
              `${import.meta.env.VITE_API_BASE_URL}/notification/notifications/mark-all-chat-read`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ userId: mechanicId }),
                credentials: 'include',
              }
            );
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
            setUnreadCount(0);
            setGlobalUnreadCount(0);
            socket?.emit('all_chat_notifications_read', { userId });
          }}
          socket={socket}
        />
      )}
      <ToastContainer limit={1} />
    </div>
  );
};

export default MechanicLayout;