import { useEffect, useState } from 'react';
import { MessageSquare, Home, Users, Megaphone, User, LogOut } from 'lucide-react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectEmployeeAuthData } from '../../store/selectors';

interface SidebarProps {
  activeTab: string;
  handleLogout: () => void;
  unreadCount: number;
  socket?: any;
}

export default function Sidebar({ activeTab, handleLogout, unreadCount, socket }: SidebarProps) {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { employeeData } = useSelector(selectEmployeeAuthData);
  const userId = employeeData?.id;

  useEffect(() => {
    if (location.pathname === '/employee-chat' && userId && socket) {
      localStorage.setItem('coordinatorUnreadChat', '0');
      socket.emit('mark_all_chat_notifications_read', { userId });
    }
  }, [location.pathname, userId, socket]);

  const tabs = [
    { name: 'Dashboard', icon: <Home className="w-5 h-5" />, path: '/coordinator/dashboard' },
    { name: 'User Management', icon: <Users className="w-5 h-5" />, path: '/user-management' },
    { name: 'Complaint Management', icon: <Megaphone className="w-5 h-5" />, path: '/complaint-management' },
    { name: 'Chat', icon: <MessageSquare className="w-5 h-5" />, path: '/employee-chat' },
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