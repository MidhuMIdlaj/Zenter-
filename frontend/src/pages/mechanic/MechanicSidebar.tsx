// src/components/mechanic/MechanicSidebar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Home, PenTool as Tool, History, Settings, LogOut, MessageSquare } from 'lucide-react';
import { selectEmployeeAuthData } from '../../store/selectors';
import { clearEmployeeAuth } from '../../store/EmployeeAuthSlice';
import ConfirmationDialog from '../../components/reusableComponent/ConfirmationDialog';
import { io, Socket } from 'socket.io-client';
import { markAllChatNotificationsRead, NotificationService } from '../../api/NotificationService/NotificationService';
import { motion } from 'framer-motion';

interface MechanicSidebarProps {
  activePage: string; 
}

const MechanicSidebar: React.FC<MechanicSidebarProps> = ({ activePage }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { employeeData } = useSelector(selectEmployeeAuthData);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [socket, setSocket] = useState<Socket | null>(null);
  
  const token = employeeData?.token;
  const userId = employeeData?.id;

   const showToast = (notification : any) => {
    if (location.pathname === "/mechanic/chat" && notification.type === "chat") return;

    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm transform transition-all duration-300 translate-x-full';
    
    // Customize toast for video call notifications
    let content = '';
    if (notification.type === 'video_call') {
      content = `
        <div class="flex items-start space-x-3">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm14 1H4v8l4-2 4 2 4-2V6z"></path>
              </svg>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900">${notification.title}</p>
            <p class="text-sm text-gray-500">${notification.message}</p>
            <a href="${notification.callLink}" class="text-sm text-blue-600 hover:underline mt-1 inline-block">Join Call</a>
          </div>
          <button class="flex-shrink-0 text-gray-400 hover:text-gray-600" onclick="this.parentElement.parentElement.remove()">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
          </button>
        </div>
      `;
    } else {
      content = `
        <div class="flex items-start space-x-3">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
              </svg>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900">${notification.title}</p>
            <p class="text-sm text-gray-500 truncate">${notification.message}</p>
          </div>
          <button class="flex-shrink-0 text-gray-400 hover:text-gray-600" onclick="this.parentElement.parentElement.remove()">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
          </button>
        </div>
      `;
    }

    toast.innerHTML = content;
    document.body.appendChild(toast);

    // Handle click on the link
    const link = toast.querySelector('a');
    if (link) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        navigate(notification.callLink.replace('http://localhost:5173', '')); // Navigate with react-router-dom
        toast.remove();
      });
    }

    setTimeout(() => {
      toast.classList.remove('translate-x-full');
    }, 100);

    setTimeout(() => {
      toast.classList.add('translate-x-full');
      setTimeout(() => {
        if (toast.parentElement) {
          toast.remove();
        }
      }, 300);
    }, 10000);
  };
  
    useEffect(() => {
      const storedCount = localStorage.getItem('coordinatorUnreadChat');
      if (storedCount) setUnreadMessages(parseInt(storedCount));
    }, []);
  
  const isActive = (page: any) => {
    return activePage === page ? 
      'bg-blue-700 text-white' : 
      'text-gray-300 hover:bg-blue-700/50 hover:text-white';
  };
  
  // Initialize unread messages count
  useEffect(() => {
    const fetchInitialCount = async () => {
      try {
        if (!userId) return;
        
        const storedCount = localStorage.getItem('mechanicUnreadChat');
        if (storedCount) {
          setUnreadMessages(parseInt(storedCount));
        }
        
        const response = await NotificationService.getUnreadChatNotifications(userId, 'mechanic');
        if (response.success) {
          setUnreadMessages(response.notifications.length);
          localStorage.setItem('mechanicUnreadChat', response.notifications.length.toString());
        }
      } catch (error) {
        console.error("Error initializing mechanic chat count:", error);
      }
    };
    fetchInitialCount();
  }, [userId]);

  // Initialize socket connection
  useEffect(() => {
    if (!token || !userId) return;

    const newSocket = io('http://localhost:5000', {
    transports: ['websocket'],
    auth: { token },
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('Mechanic sidebar socket connected');
      newSocket.emit('join_user_room', userId);
      newSocket.emit('join_role_room', 'mechanic');
    });

    newSocket.on('connect_error', (error: any) => {
      console.error('Mechanic sidebar socket error:', error);
    });

    // Handle new chat notifications
    newSocket.on('new_chat_notification', (notification) => {
      if (location.pathname !== '/mechanic/chat') {
        const newCount = unreadMessages + 1;
        setUnreadMessages(newCount);
        localStorage.setItem('mechanicUnreadChat', newCount.toString());
      }
    });

     newSocket.on('new_message', (notification) => {
      if (location.pathname !== '/mechanic/chat') {
        const newCount = unreadMessages + 1;
        setUnreadMessages(newCount);
        localStorage.setItem('coordinatorUnreadChat', newCount.toString());
        
        // Add vibration
        if ('vibrate' in navigator) navigator.vibrate(200);
        
        showToast({
          title: "New Chat Message",
          message: notification?.message || `${notification.senderRole} sent a new message`,
          type: "chat",
          conversationId: notification?.conversationId
        });
      }
    });

    // Handle all chat notifications being marked as read
    newSocket.on('all_chat_notifications_read', () => {
      setUnreadMessages(0);
      localStorage.setItem('mechanicUnreadChat', '0');
    });

    newSocket.on('new_video_call_notification', (notification) => {
      console.log(notification, "1234")
      
     if (notification.recipientType === 'mechanic') {
      if ('vibrate' in navigator) navigator.vibrate(200);
      
      showToast({
          title: 'Video Call Invitation',
          message: notification.message,
          type: 'video_call',
          callLink: notification.callLink,
        });
      const audio = new Audio('/notification-sound.mp3');
      audio.play().catch(e => console.log('Audio play failed:', e));
    }
   });

    newSocket.on('error', (error) => {
    console.error('Socket error:', error);
  });

    setSocket(newSocket);

    return () => {
      newSocket.off('new_chat_notification');
      newSocket.off('new_message');
      newSocket.off('all_chat_notifications_read');
      newSocket.off('new_video_call_notification');
      newSocket.off('error');
      newSocket.disconnect();
    };
  }, [token, userId, location.pathname]);

  // Reset count when on chat page
  useEffect(() => {
    if (location.pathname === '/mechanic/chat') {
      setUnreadMessages(0);
      localStorage.setItem('mechanicUnreadChat', '0');
    }
  }, [location.pathname]);


  const handleLogout = () => {
    dispatch(clearEmployeeAuth());
    navigate("/employee-login");
    setShowLogoutDialog(false);
  };
  
  const getInitials = () => {
    if (!employeeData) return 'ME';
    return `${employeeData.employeeName ? employeeData.employeeName[0] : ''}${employeeData.employeeName ? employeeData.employeeName[0] : ''}`;
  };

  return (
    <div className="fixed h-full w-64 bg-blue-800 shadow-lg z-10 transition-all">
      <div className="p-5 border-b border-blue-700">
        <div className="flex items-center space-x-3">
          <Tool size={28} className="text-white" />
          <h1 className="text-xl font-bold text-white">Zenster</h1>
        </div>
      </div>
      
      <div className="p-4">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-wider text-blue-400 mb-2">Main Menu</p>
          <nav className="space-y-1">
            <Link 
              to="/mechanic/dashboard" 
              className={`flex items-center px-4 py-3 rounded-lg transition-all ${isActive('dashboard')}`}
            >
              <Home size={20} className="mr-3" />
              <span>Dashboard</span>
            </Link>
            
            <Link 
              to="/mechanic/tasks" 
              className={`flex items-center px-4 py-3 rounded-lg transition-all ${isActive('tasks')}`}
            >
              <Tool size={20} className="mr-3" />
              <span>My Tasks</span>
            </Link>
            
            <Link 
              to="/mechanic/chat" 
              className={`flex items-center px-4 py-3 rounded-lg transition-all ${isActive('complaints')}`}            >
              <div className="relative mr-3">
                <MessageSquare size={20} />
              </div>
              <span>Chat with coordinator</span>
            </Link>
          </nav>
        </div>
        
        <div>
          <p className="text-xs uppercase tracking-wider text-blue-400 mb-2">Account</p>
          <nav className="space-y-1">
            <button 
              onClick={() => setShowLogoutDialog(true)}
              className="w-full flex items-center px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600/70 hover:text-white transition-all"
            >
              <LogOut size={20} className="mr-3" />
              <span>Sign Out</span>
            </button>
          </nav>
        </div>
      </div>
      <button onClick={()=> navigate('mechanic/profile')}>
      <div className="absolute bottom-0 w-full p-4 border-t border-blue-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="text-white font-medium">{getInitials()}</span>
          </div>
          <div>
            <p className="text-white font-medium">{`${employeeData?.employeeName || ''} ${employeeData?.employeeName || ''}`}</p>
            <p className="text-blue-300 text-sm">Mechanic</p>
          </div>
        </div>
      </div>
      </button>
      <ConfirmationDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out of your account?"
        type="danger"
        confirmText="Logout"
        cancelText="Cancel"
      />
    </div>
  );
};

export default MechanicSidebar;