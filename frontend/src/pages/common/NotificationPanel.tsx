import React, { useState, useEffect } from 'react';
import { X, Bell, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NotificationMessage } from '../../types/complaint';

interface NotificationPanelProps {
  onClose: () => void;
  recipientId: string;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose, recipientId }) => {
  const [notifications, setNotifications] = useState<NotificationMessage[]>([
    // Sample notifications (in a real app, these would come from an API)
    {
      id: '1',
      type: 'new_complaint',
      title: 'New Complaint Assigned',
      message: 'You have been assigned a new complaint #12345 from customer John Doe',
      complaintId: '12345',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
      read: false,
      recipientId
    },
    {
      id: '2',
      type: 'status_update',
      title: 'Status Updated',
      message: 'Complaint #54321 has been marked as in-progress',
      complaintId: '54321',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      read: true,
      recipientId
    },
    {
      id: '3',
      type: 'assignment',
      title: 'Assignment Changed',
      message: 'You have been reassigned complaint #98765 from Alex Johnson',
      complaintId: '98765',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      read: false,
      recipientId
    }
  ]);
  
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };
  
  const getRelativeTime = (timestamp: string | Date) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInMs = now.getTime() - date.getTime();
    const diffInSecs = Math.floor(diffInMs / 1000);
    const diffInMins = Math.floor(diffInSecs / 60);
    const diffInHours = Math.floor(diffInMins / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInSecs < 60) {
      return 'Just now';
    } else if (diffInMins < 60) {
      return `${diffInMins} min${diffInMins > 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };
  
  // When clicking on notification, mark it as read
  const handleNotificationClick = (id: string) => {
    markAsRead(id);
    // In a real app, you would navigate to the specific complaint
  };
  
  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <motion.div 
      className="fixed inset-y-0 right-0 w-80 bg-white shadow-lg z-40"
      initial={{ x: 320 }}
      animate={{ x: 0 }}
      exit={{ x: 320 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center">
          <Bell size={20} className="text-blue-500 mr-2" />
          <h2 className="text-lg font-semibold">Notifications</h2>
          {unreadCount > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-600 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        <button 
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <X size={20} className="text-gray-500" />
        </button>
      </div>
      
      {/* Notification Controls */}
      <div className="flex justify-between items-center px-4 py-2 bg-gray-50">
        <span className="text-sm text-gray-500">
          {notifications.length} {notifications.length === 1 ? 'notification' : 'notifications'}
        </span>
        
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Mark all as read
          </button>
        )}
      </div>
      
      {/* Notifications List */}
      <div className="overflow-y-auto max-h-[calc(100vh-120px)]">
        <AnimatePresence>
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Bell size={48} className="text-gray-300 mb-4" />
              <p className="text-gray-500">No notifications</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <motion.div 
                key={notification.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleNotificationClick(notification.id)}
              >
                <div className="flex items-start">
                  <div className={`p-2 rounded-full mr-3 ${
                    notification.type === 'new_complaint' 
                      ? 'bg-blue-100' 
                      : notification.type === 'status_update'
                      ? 'bg-green-100'
                      : 'bg-amber-100'
                  }`}>
                    {notification.type === 'new_complaint' ? (
                      <Bell size={16} className="text-blue-500" />
                    ) : notification.type === 'status_update' ? (
                      <CheckCircle size={16} className="text-green-500" />
                    ) : (
                      <Bell size={16} className="text-amber-500" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className={`text-sm font-medium ${!notification.read ? 'text-blue-600' : 'text-gray-800'}`}>
                        {notification.title}
                      </p>
                      <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                        {getRelativeTime(notification.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.message}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default NotificationPanel;