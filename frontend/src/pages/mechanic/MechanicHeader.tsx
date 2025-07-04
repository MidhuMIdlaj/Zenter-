import React, { useState } from 'react';
import { Bell, Clock, User, Menu } from 'lucide-react';

interface HeaderProps {
  mechanicName: string;
  isCheckedIn: boolean;
  onCheckIn: () => void;
  onCheckOut: () => void;
  onNotificationClick: () => void;
  notificationCount: number;
}

const Header: React.FC<HeaderProps> = ({
  isCheckedIn = false,
  onCheckIn,
  onCheckOut,
  onNotificationClick,
  notificationCount = 0
}) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <Menu size={24} />
            </button>
          </div>
          
          {/* Left side - Title */}
          <div className="flex items-center">
            <h2 className="text-xl font-semibold text-gray-800 hidden md:block">Mechanic Dashboard</h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={isCheckedIn ? onCheckOut : onCheckIn}
              className={`flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                isCheckedIn 
                  ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Clock size={16} className="mr-1.5" />
              {isCheckedIn ? 'Checked In' : 'Check In'}
            </button>
            
            <button 
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
              onClick={onNotificationClick}
            >
              <Bell size={20} className="text-gray-600" />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </button>
            
            {/* User profile */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:inline-block">
                {/* {mechanicName} */}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-t border-gray-200 py-2">
          <div className="px-4 space-y-1">
            <a href="#" className="block py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded px-3">
              Dashboard
            </a>
            <a href="#" className="block py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded px-3">
              Tasks
            </a>
            <a href="#" className="block py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded px-3">
              Complaints
            </a>
            <a href="#" className="block py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded px-3">
              Settings
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;