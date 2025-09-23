import { Home, Users, MessageSquare, Bell, Send } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadCount?: number;
}

export default function MobileNav({ activeTab, setActiveTab, unreadCount = 0 }: MobileNavProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { 
      name: 'Dashboard', 
      icon: <Home className="w-6 h-6" />, 
      path: '/coordinator/dashboard' 
    },
    { 
      name: 'User Management', 
      icon: <Users className="w-6 h-6" />, 
      path: '/user-management' 
    },
    { 
      name: 'Complaint Management', 
      icon: <MessageSquare className="w-6 h-6" />, 
      path: '/complaint-management' 
    },
    { 
      name: 'Chat', 
      icon: <Send className="w-6 h-6" />, 
      path: '/employee-chat',
      badge: unreadCount
    },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleNavigation = (tab: any) => {
    setActiveTab(tab.name);
    navigate(tab.path);
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50">
      <div className="flex justify-around items-center py-2 px-1">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 touch-manipulation min-h-[60px] min-w-[60px] relative ${
              isActive(tab.path) 
                ? 'bg-indigo-500 text-white shadow-lg' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => handleNavigation(tab)}
            aria-label={tab.name}
          >
            <div className="relative">
              {tab.icon}
              {/* Chat Badge */}
              {tab.badge && tab.badge > 0 && tab.name === 'Chat' && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs font-medium">
                  {tab.badge > 9 ? '9+' : tab.badge}
                </span>
              )}
            </div>
            <span className="text-xs mt-1 font-medium truncate max-w-[70px]">
              {tab.name === 'User Management' ? 'Users' : 
               tab.name === 'Complaint Management' ? 'Complaints' : 
               tab.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}