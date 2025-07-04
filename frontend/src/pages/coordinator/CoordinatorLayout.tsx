import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../../components/coordinator/sidebarComponent';
import Header from '../../components/coordinator/HeaderComponent';
import MobileNav from '../../components/coordinator/mobileNav';
import { selectEmployeeAuthData } from '../../store/selectors';
import { clearEmployeeAuth } from '../../store/EmployeeAuthSlice';
import { useState, useEffect } from 'react';
import ConfirmationDialog from '../../components/reusableComponent/ConfirmationDialog';
import { io } from 'socket.io-client';

const CoordinatorLayout = () => {
  const { employeeData } = useSelector(selectEmployeeAuthData);
  const userName = employeeData?.employeeName || 'Coordinator';
  const userRole = employeeData?.position || 'Coordinator';
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [globalUnreadCount, setGlobalUnreadCount] = useState(0);
  const token = employeeData?.token;
  const userId = employeeData?.id;

  useEffect(() => {
    if (!userId || !token) return;

    const socket = io('http://localhost:5000', {
      transports: ['websocket'],
      auth: { token },
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      socket.emit("join_user_room", userId);
      socket.emit('join_role_room', 'coordinator');
    });

    socket.on("new_chat_notification", () => {
      if (location.pathname !== '/employee-chat') {
        setGlobalUnreadCount((prev) => prev + 1);
      }
    });

    socket.on('new_message', (notification) => {
      if (location.pathname !== '/employee-chat') {
        setGlobalUnreadCount((prev) => prev + 1);
      }
    });

    socket.on("chat_notifications_read", () => {
      setGlobalUnreadCount(0);
    });

    socket.on('new_video_call_notification', (notification) => {
      console.log('[CoordinatorLayout] Video call notification:', notification);
      if (notification.recipientType === 'coordinator') {
        if ('vibrate' in navigator) navigator.vibrate(200);
        const audio = new Audio('/notification-sound.mp3');
        audio.play().catch(e => console.log('[CoordinatorLayout] Audio play failed:', e));
      }
    });

    return () => {
      socket.off('new_chat_notification');
      socket.off('new_message');
      socket.off('chat_notifications_read');
      socket.off('new_video_call_notification');
      socket.off('connect_error');
      socket.off('error');
      socket.disconnect();
    };
  }, [userId, token]);

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
      console.error("Logout failed:", error);
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
      <Sidebar activeTab={getActiveTab()} handleLogout={openLogoutConfirm} />
      <div className="transition-all duration-300 ml-0 lg:ml-64">
        <div className="p-4 lg:p-8">
          <Header 
            userName={userName}
            userRole={userRole}
            checkedIn={false}
            setCheckedIn={() => {}}
          />
          {globalUnreadCount > 0 && (
            <div className="fixed top-4 right-4 z-50 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
              {globalUnreadCount > 9 ? '9+' : globalUnreadCount}
            </div>
          )}
          <Outlet />
        </div>
      </div>

      <MobileNav 
        activeTab={getActiveTab()} 
        setActiveTab={function (): void {
          throw new Error('Function not implemented.');
        }} 
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