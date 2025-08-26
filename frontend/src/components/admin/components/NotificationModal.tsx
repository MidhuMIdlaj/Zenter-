// import React, { useEffect, useState } from 'react';
import { X, MessageCircle } from 'lucide-react';

interface Notification {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  type: string;
  senderId?: string;
  senderName?: string;
  conversationId?: string;
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (notificationId: string, conversationId?: string) => void;
  onMarkAllAsRead: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4">
          {notifications.length === 0 ? (
            <p className="text-gray-500 text-center">No notifications</p>
          ) : (
            <>
              <button
                onClick={onMarkAllAsRead}
                className="mb-4 text-sm text-blue-500 hover:text-blue-700"
              >
                Mark all as read
              </button>
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-3 mb-2 rounded-md ${
                    notification.read ? 'bg-gray-50' : 'bg-blue-50'
                  } hover:bg-gray-100 cursor-pointer`}
                  onClick={() =>
                    notification.type === 'chat_message' &&
                    notification.conversationId &&
                    onMarkAsRead(notification._id, notification.conversationId)
                  }
                >
                  <div className="flex items-start">
                    <MessageCircle size={16} className="mr-2 mt-1 text-blue-500" />
                    <div className="flex-1">
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-sm text-gray-600">{notification.senderName}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                      {notification.senderName && (
                        <p className="text-xs text-gray-500">
                          From: {notification.senderName}
                        </p>
                      )}
                    </div>
                    {!notification.read && (
                      <span className="h-2 w-2 bg-blue-500 rounded-full mt-2" />
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;