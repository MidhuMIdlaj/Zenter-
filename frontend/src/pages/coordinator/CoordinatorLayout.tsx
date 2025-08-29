import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../../components/coordinator/sidebarComponent';
import Header from '../../components/coordinator/HeaderComponent';
import MobileNav from '../../components/coordinator/mobileNav';
import { selectEmployeeAuthData } from '../../store/selectors';
import { clearEmployeeAuth } from '../../store/EmployeeAuthSlice';
import { useState, useEffect, useCallback } from 'react';
import ConfirmationDialog from '../../components/reusableComponent/ConfirmationDialog';
import { io, Socket } from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotificationModal from './notificationModal';
import { NotificationService, getUnreadChatCount, markAllChatNotificationsRead } from '../../api/NotificationService/NotificationService';

interface Notification {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  type: string;
  senderId?: string;
  senderName?: string;
  senderRole?: string;
  conversationId?: string;
}

const CoordinatorLayout = () => {
  const { employeeData } = useSelector(selectEmployeeAuthData);
  const userName = employeeData?.employeeName || 'Coordinator';
  const userRole = employeeData?.position || 'Coordinator';
  const userId = employeeData?.id;
  const token = employeeData?.token;
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const [lastNotificationTime, setLastNotificationTime] = useState<number>(0);

  // Single source of truth for unread count
  const [unreadCount, setUnreadCount] = useState(() => {
    const savedCount = localStorage.getItem('coordinatorUnreadChat');
    return savedCount ? parseInt(savedCount, 10) : 0;
  });

  const debounce = <T extends (...args: any[]) => any>(func: T, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>): Promise<ReturnType<T>> => {
      clearTimeout(timeout);
      return new Promise((resolve) => {
        timeout = setTimeout(() => resolve(func(...args)), wait);
      });
    };
  };

  const fetchNotifications = useCallback(
    debounce(async () => {
      if (!userId || isFetching) return;
      setIsFetching(true);
      try {
        const response = await NotificationService.getNotificationsForUser(userId);
        if (response.success && response.notifications) {
          setNotifications(prev => {
            const existingKeys = new Set(
              prev.map(n => 
                `${n.conversationId}-${n.senderId}-${n.message}-${new Date(n.createdAt).getTime()}`
              )
            );
            
            const newNotifications = response.notifications
              .filter((n: Notification) => {
                const key = `${n.conversationId}-${n.senderId}-${n.message}-${new Date(n.createdAt).getTime()}`;
                return !existingKeys.has(key);
              })
              .map((n: Notification) => ({
                ...n,
                title: 'New Message' // Normalize title
              }));

            if (newNotifications.length === 0) return prev;
            
            return [...newNotifications, ...prev]
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          });

          const serverUnreadCount = response.notifications
            .filter((n: Notification) => !n.read)
            .length;
          setUnreadCount(serverUnreadCount);
          localStorage.setItem('coordinatorUnreadChat', serverUnreadCount.toString());
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setIsFetching(false);
      }
    }, 500),
    [userId]
  );

  const fetchUnreadCount = useCallback(
    debounce(async () => {
      if (!userId || !userRole || isFetching) return;
      setIsFetching(true);
      try {
        const count = await getUnreadChatCount(userId, userRole);
        setUnreadCount(count);
        localStorage.setItem('coordinatorUnreadChat', count.toString());
      } catch (error) {
        console.error('Failed to fetch unread count:', error);
      } finally {
        setIsFetching(false);
      }
    }, 500),
    [userId, userRole]
  );

  const handleMarkAsRead = async (notificationId: string, conversationId?: string) => {
    try {
      // Optimistic UI update
      setNotifications(prev => 
        prev.map(n => n._id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => {
        const newCount = Math.max(0, prev - 1);
        localStorage.setItem('coordinatorUnreadChat', newCount.toString());
        return newCount;
      });

      const response = conversationId 
        ? await NotificationService.markChatNotificationAsRead(notificationId, conversationId)
        : await NotificationService.markNotificationAsRead(notificationId);
      
      if (!response.success) {
        // Rollback if API fails
        setNotifications(prev => 
          prev.map(n => n._id === notificationId ? { ...n, read: false } : n)
        );
        setUnreadCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      // Rollback on error
      setNotifications(prev => 
        prev.map(n => n._id === notificationId ? { ...n, read: false } : n)
      );
      setUnreadCount(prev => prev + 1);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!userId) return;
    try {
      // Optimistic UI update
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      localStorage.setItem('coordinatorUnreadChat', '0');

      const response = await markAllChatNotificationsRead(userId);
      if (!response.success) {
        // Rollback if API fails
        setNotifications(prev => prev.map(n => ({ ...n, read: false })));
        setUnreadCount(prev => {
          const newCount = prev + notifications.filter(n => !n.read).length;
          return newCount;
        });
      }
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      // Rollback on error
      setNotifications(prev => prev.map(n => ({ ...n, read: false })));
      setUnreadCount(prev => {
        const newCount = prev + notifications.filter(n => !n.read).length;
        return newCount;
      });
    }
  };

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
      newSocket.emit('join_role_room', 'coordinator');
      setSocket(newSocket);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    newSocket.on('new_message', (notification: Notification) => {
      if (notification.senderRole !== 'admin' || location.pathname === '/employee-chat') {
        return;
      }

      const normalizedNotification = {
        _id: notification._id || `temp-${Date.now()}`,
        title: 'New Message',
        message: notification.message || 'You have a new message',
        createdAt: notification.createdAt || new Date().toISOString(),
        read: false,
        type: 'chat',
        senderId: notification.senderId,
        senderName: notification.senderName || 'Admin',
        senderRole: notification.senderRole || 'admin',
        conversationId: notification.conversationId,
      };

      setNotifications(prev => {
        const duplicateKey = `${normalizedNotification.conversationId}-${normalizedNotification.senderId}-${normalizedNotification.message}-${new Date(normalizedNotification.createdAt).getTime()}`;
        
        const isDuplicate = prev.some(n => 
          `${n.conversationId}-${n.senderId}-${n.message}-${new Date(n.createdAt).getTime()}` === duplicateKey
        );

        if (isDuplicate) {
          console.log('Duplicate notification detected, skipping');
          return prev;
        }

        console.log('Adding new notification:', normalizedNotification);
        return [normalizedNotification, ...prev];
      });

      setUnreadCount(prev => {
        const newCount = prev + 1;
        localStorage.setItem('coordinatorUnreadChat', newCount.toString());
        return newCount;
      });

      const now = Date.now();
      if (now - lastNotificationTime > 3000) {
        setLastNotificationTime(now);
        const toastId = `msg-${normalizedNotification._id}`;
        
        toast.info(
          <div 
            className="p-3 border-l-4 border-blue-500 bg-white rounded shadow-sm cursor-pointer"
            onClick={() => {
              if (normalizedNotification.conversationId) {
                navigate('/employee-chat', {
                  state: {
                    conversationId: normalizedNotification.conversationId,
                    senderId: normalizedNotification.senderId,
                  },
                });
              }
              toast.dismiss(toastId);
            }}
          >
            <div className="text-sm font-medium text-gray-800 mb-1">
              📩 {normalizedNotification.title}
            </div>
            <div className="text-xs text-gray-600">
              <strong>{normalizedNotification.senderName}</strong>: {normalizedNotification.message}
            </div>
          </div>,
          {
            toastId,
            position: 'top-right',
            autoClose: 5000,
            closeOnClick: false,
            draggable: true,
            onClick: () => {
              if (normalizedNotification.conversationId) {
                navigate('/employee-chat', {
                  state: {
                    conversationId: normalizedNotification.conversationId,
                    senderId: normalizedNotification.senderId,
                  },
                });
              }
              toast.dismiss(toastId);
            }
          }
        );
      }
    });

    newSocket.on('chat_notifications_read', () => {
      setUnreadCount(prev => Math.max(0, prev - 1));
      fetchNotifications();
    });

    newSocket.on('all_chat_notifications_read', () => {
      setUnreadCount(0);
      localStorage.setItem('coordinatorUnreadChat', '0');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      fetchNotifications();
    });

    newSocket.on('new_video_call_notification', (notification: any) => {
      if (notification.recipientType === 'coordinator') {
        const toastId = `video-${notification._id}`;
        toast.info(
          <div className="p-3 border-l-4 border-blue-500 bg-white rounded shadow-sm">
            <div className="text-sm font-medium text-gray-800 mb-1">
              📹 Video Call Invitation
            </div>
            <div className="text-xs text-gray-600">
              {notification.message}
            </div>
            {notification.callLink && (
              <a 
                href={notification.callLink} 
                className="inline-block mt-2 text-xs text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Join Call
              </a>
            )}
          </div>,
          {
            toastId,
            position: 'top-right',
            autoClose: 10000,
            closeOnClick: false,
          }
        );
      }
    });

    return () => {
      newSocket.off('new_message');
      newSocket.off('chat_notifications_read');
      newSocket.off('all_chat_notifications_read');
      newSocket.off('new_video_call_notification');
      newSocket.disconnect();
    };
  }, [userId, token, location.pathname, lastNotificationTime, navigate, fetchNotifications]);

  useEffect(() => {
    fetchUnreadCount();
    fetchNotifications();
  }, [fetchUnreadCount, fetchNotifications]);

  useEffect(() => {
    if (isModalOpen) {
      fetchNotifications();
    }
  }, [isModalOpen, fetchNotifications]);

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Dashboard';
    if (path.includes('/user-management')) return 'User Management';
    if (path.includes('/complaint-management')) return 'Complaint Management';
    if (path.includes('/notification')) return 'Notification';
    if (path.includes('/spare-parts')) return 'Spare and Parts';
    if (path.includes('/billing')) return 'Billing Page';
    if (path.includes('/employee-chat')) return 'Chat';
    return 'Dashboard';
  };

  const handleLogout = async () => {
    try {
      await dispatch(clearEmployeeAuth());
      navigate('/employee-login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setShowLogoutConfirm(false);
    }
  };

  const openLogoutConfirm = () => {
    setShowLogoutConfirm(true);
  };

  const closeLogoutConfirm = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
       <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        limit={3}
      />
      
      <Sidebar
        activeTab={getActiveTab()}
        handleLogout={openLogoutConfirm}
        unreadCount={unreadCount}
        socket={socket}
      />
      
      <div className="transition-all duration-300 ml-0 lg:ml-64">
        <div className="p-4 lg:p-8">
          <Header
            userName={userName}
            userRole={userRole}
            checkedIn={checkedIn}
            setCheckedIn={setCheckedIn}
            notifications={unreadCount}
            onNotificationClick={() => {
              setIsModalOpen(true);
              fetchNotifications();
            }}
            socket={socket}
          />
          <Outlet context={{ socket }} />
        </div>
      </div>

      <MobileNav activeTab={getActiveTab()} setActiveTab={() => {}} />
      
      <NotificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
      />
      
      <ConfirmationDialog
        isOpen={showLogoutConfirm}
        onClose={closeLogoutConfirm}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to logout from your account? You will be redirected to the login page."
        type="danger"
        confirmText="Yes, Logout"
        cancelText="Stay Logged In"
        showCloseButton={true}
      />
    </div>
  );
};

export default CoordinatorLayout;