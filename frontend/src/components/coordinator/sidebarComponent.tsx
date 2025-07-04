import { useEffect, useState } from 'react';
import { Bell, MessageSquare, Home, Users, Settings, CreditCard, LogOut, Megaphone, User, Mail, Phone } from 'lucide-react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectEmployeeAuthData } from '../../store/selectors';
import { io, Socket } from 'socket.io-client';
import { NotificationService } from '../../api/NotificationService/NotificationService';

interface SidebarProps {
  activeTab: string;
  handleLogout: () => void;
}

export default function Sidebar({ handleLogout }: SidebarProps) {
  const [expanded, setExpanded] = useState(true);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [socket, setSocket] = useState<Socket | null>(null);
  const location = useLocation();
  const navigate = useNavigate(); // Add navigate hook
  const { employeeData } = useSelector(selectEmployeeAuthData);
  const token = employeeData?.token;
  const userId = employeeData?.id;

  const showToast = (notification: {
    title: string;
    message: string;
    type: string;
    conversationId?: string;
    callLink?: string;
  }) => {
    if (location.pathname === '/employee-chat' && notification.type === 'chat') return;

    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm transform transition-all duration-300 translate-x-full';

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
            <p class="text-sm font-medium text-gray-900">Video Call Invitation</p>
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
    if (link && notification.callLink) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        if(notification.callLink){
          navigate(notification.callLink.replace('http://localhost:5173', '')); // Navigate with react-router-dom
        }
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
    }, 5000);
  };

  useEffect(() => {
    const storedCount = localStorage.getItem('coordinatorUnreadChat');
    if (storedCount) setUnreadMessages(parseInt(storedCount));
  }, []);

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

    const fetchUnreadChatCount = async () => {
      try {
        const response = await NotificationService.getUnreadChatNotifications(userId, 'coordinator');
        if (response.success) {
          setUnreadMessages(response.notifications.length);
          localStorage.setItem('coordinatorUnreadChat', response.notifications.length.toString());
        }
      } catch (error) {
        console.error('[Sidebar] Error fetching unread chat count:', error);
      }
    };

    newSocket.on('connect', () => {
      console.log('[Sidebar] Coordinator sidebar socket connected');
      newSocket.emit('join_user_room', userId);
      newSocket.emit('join_role_room', 'coordinator'); // Add role-based room
      fetchUnreadChatCount();
    });

    newSocket.on('connect_error', (error: any) => {
      console.error('[Sidebar] Coordinator sidebar socket error:', error);
    });

    newSocket.on('new_message', (notification) => {
      if (location.pathname !== '/employee-chat') {
        const newCount = unreadMessages + 1;
        setUnreadMessages(newCount);
        localStorage.setItem('coordinatorUnreadChat', newCount.toString());
        if ('vibrate' in navigator) navigator.vibrate(200);
        showToast({
          title: 'New Chat Message',
          message: notification?.message || `${notification.senderRole} sent a new message`,
          type: 'chat',
          conversationId: notification?.conversationId,
        });
      }
    });

    newSocket.on('all_chat_notifications_read', () => {
      setUnreadMessages(0);
      localStorage.setItem('coordinatorUnreadChat', '0');
    });

    newSocket.on('new_video_call_notification', (notification) => {
      console.log('[Sidebar] Video call notification:', notification);
      if (notification.recipientType === 'coordinator') {
        if ('vibrate' in navigator) navigator.vibrate(200);
        showToast({
          title: 'Video Call Invitation',
          message: notification.message,
          type: 'video_call',
          callLink: notification.callLink,
        });
        const audio = new Audio('/notification-sound.mp3');
        audio.play().catch(e => console.log('[Sidebar] Audio play failed:', e));
      }
    });

    newSocket.on('error', (error) => {
      console.error('[Sidebar] Socket error:', error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.off('new_message');
      newSocket.off('all_chat_notifications_read');
      newSocket.off('new_video_call_notification');
      newSocket.off('error');
      newSocket.disconnect();
    };
  }, [token, userId, location.pathname, unreadMessages]);

  useEffect(() => {
    if (location.pathname === '/employee-chat') {
      setUnreadMessages(0);
      localStorage.setItem('coordinatorUnreadChat', '0');
      if (socket) {
        socket.emit('mark_all_chat_notifications_read', { userId });
      }
    }
  }, [location.pathname, socket, userId]);


  const tabs = [
    { name: 'Dashboard', icon: <Home className="w-5 h-5" />, path: '/coordinator/dashboard' },
    { name: 'User Management', icon: <Users className="w-5 h-5" />, path: '/user-management' },
    { name: 'Complaint Management', icon: <Megaphone className="w-5 h-5" />, path: '/complaint-management' },
    { 
      name: 'Chat', 
      icon: (
        <div className="relative">
          <MessageSquare className="w-5 h-5" />
          {unreadMessages > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
              {unreadMessages > 9 ? '9+' : unreadMessages}
            </span>
          )}
        </div>
      ), 
      path: '/employee-chat' 
    },
  ];

  
  const getInitials = () => {
    if (!employeeData?.employeeName) return 'CO';
    return employeeData.employeeName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase();
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className={`bg-indigo-900 text-white h-screen transition-all duration-300 ease-in-out ${expanded ? 'w-64' : 'w-20'} fixed left-0 top-0 z-50 flex flex-col`}>
      <div className="p-4 flex items-center justify-between">
        {expanded && <h1 className="font-bold text-xl">Coordinator Panel</h1>}
        <button 
          onClick={() => setExpanded(!expanded)} 
          className="bg-indigo-800 rounded-full p-2 hover:bg-indigo-700 transition-all"
        >
          {expanded ? "«" : "»"}
        </button>
      </div>

      <div className="mt-8 flex-grow">
        {tabs.map((tab) => (
          <NavLink
            key={tab.name}
            to={tab.path}
            className={`flex items-center w-full px-4 py-3 transition-all duration-200 hover:bg-indigo-800 ${
              isActive(tab.path) ? 'bg-indigo-800 border-l-4 border-white' : ''
            }`}
          >
            <span className="mr-3">{tab.icon}</span>
            {expanded && <span>{tab.name}</span>}
          </NavLink>
        ))}
      </div>

      {/* Profile Section at Bottom */}
      <div className="p-4 border-t border-indigo-800">
        <button 
          onClick={() => navigate('/employee/profile')}
          className="flex items-center w-full px-4 py-3 transition-all duration-200 hover:bg-indigo-800 rounded-lg"
        >
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center mr-3">
            {expanded ? (
              <span className="font-medium text-sm">{getInitials()}</span>
            ) : (
              <User className="w-4 h-4" />
            )}
          </div>
          {expanded && (
            <div className="text-left">
              <p className="font-medium truncate">
                {employeeData?.employeeName || 'Coordinator'}
              </p>
              <p className="text-xs text-indigo-300">View Profile</p>
            </div>
          )}
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 transition-all duration-200 hover:bg-indigo-800 rounded-lg mt-2"
        >
          <LogOut className="w-5 h-5 mr-3" />
          {expanded && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}