import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { ChevronLeft, Send, Search, Phone, Video, MoreVertical, Paperclip, Smile, Clock, CheckCheck, User, Wrench, Users } from 'lucide-react';
import { fetchEmployees, getAllAdmin } from '../../api/admin/Employee';
import { useSelector } from 'react-redux';
import { selectEmployeeAuthData } from '../../store/selectors';
import { ChatService } from '../../api/chatService.ts/chatApi';

// Define types for our data structures
interface User {
  id: number | string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  isOnline?: boolean;
  unreadCount?: number;
  employeeId: string;
  location?: string;
  status: 'available' | 'busy' | 'offline';
  role: 'mechanic' | 'admin';
  email?: string;
  phone?: string;
  skills?: string[]; 
  department?: string; 
  joinDate?: string;
}

interface ChatMessage {
  id: number | string;
  senderId: string;
  receiverId: string;
  text: string;
  time: string;
  isDelivered?: boolean;
  isRead?: boolean;
  messageType?: 'text' | 'task' | 'urgent';
  conversationId: string;
  senderRole : string;
  receiverRole : string;
}

const ChatWithMechanics: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'busy' | 'offline'>('all');
  const [filterRole, setFilterRole] = useState<'all' | 'mechanic' | 'admin'>('all');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [socketConnected, setSocketConnected] = useState<boolean>(false);
  const [unreadConversations, setUnreadConversations] = useState<Record<string, number>>({});
  const socketRef = useRef<Socket | null>(null);
  const { employeeData } = useSelector(selectEmployeeAuthData);
  const userId = employeeData?.id;
  const token = employeeData?.token;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch admins and mechanics
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const employeeResponse = await fetchEmployees(page, 10);
        const allEmployees = employeeResponse.data.employees || [];
        
        // Fetch admins separately
        const adminResponse = await getAllAdmin(page, 10);
        const allAdmins = adminResponse.data?.admins || [];
        console.log(allAdmins, "all admins");
        // Process mechanics
        const mechanics = allEmployees
          .filter((employee: any) => employee.position?.toLowerCase() === 'mechanic')
          .map((employee: any) => ({
            id: employee.id || Math.random() * 1000,
            name: employee.employeeName || 'Unknown Mechanic',
            avatar: employee.avatar || employee.employeeName?.slice(0, 2).toUpperCase() || '??',
            lastMessage: employee.lastMessage || 'No messages yet',
            time: employee.time
              ? new Date(employee.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isOnline: employee.status === 'available' || employee.status === 'busy',
            unreadCount: employee.unreadCount || 0,
            employeeId: employee.id || `MEC_${employee._id}`,
            location: employee.address || 'Unknown Location',
            status: employee.status || 'offline',
            role: 'mechanic',
          }));

        // Process admins
            const admins = allAdmins.map((admin: any) => ({
              id: admin._id || Math.random() * 1000,
              name: admin.email || 'Unknown Admin',
              avatar: admin.avatar || admin.email?.slice(0, 2).toUpperCase() || '??',
              lastMessage: admin.lastMessage || 'No messages yet',
              time: admin.updatedAt
                ? new Date(admin.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isOnline: admin.status === 'available' || admin.status === 'busy',
              unreadCount: admin.unreadCount || 0,
              employeeId: admin._id,
              location: admin.location || 'Admin Office',
              status: admin.status || 'offline',
              role: 'admin',
            }));

        // Combine and update users
        const combinedUsers = [...mechanics, ...admins];
        setUsers((prev) => (page === 1 ? combinedUsers : [...prev, ...combinedUsers]));
        setHasMore(allEmployees.length === 10 || allAdmins.length === 10);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [page]);

  // Initialize Socket.IO connection with authentication
  useEffect(() => {
    if (!userId || !token) return;

    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    socketRef.current = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
      auth: { token },
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on('message_delivered', ({ messageId }) => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId ? { ...msg, isDelivered: true } : msg
        )
      );
    });

    socketRef.current.on('message_read', ({ messageId }) => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId ? { ...msg, isRead: true } : msg
        )
      );
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connected successfully');
      setSocketConnected(true);
      socketRef.current?.emit('join_user_room', userId);
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setSocketConnected(false);
    });

    socketRef.current.on('disconnect', () => {
      console.log('Socket disconnected');
      setSocketConnected(false);
    });

    socketRef.current.on('new_message', (message: ChatMessage) => {
     const conversationId = message.conversationId;
    const isCurrentConversation = selectedUser && 
      conversationId === [userId, selectedUser.employeeId].sort().join('_');
    
    if (!isCurrentConversation) {
      setUnreadConversations(prev => ({
        ...prev,
        [conversationId]: (prev[conversationId] || 0) + 1
      }));
    }
      console.log('Received new message:', message);
      const formattedMessage = {
        ...message,
        time: new Date(message.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      
      setMessages(prev => [...prev, formattedMessage]);

      // if (selectedUser && message.senderId === selectedUser.employeeId) {
      //   ChatService.markMessagesAsRead(
      //     [userId, selectedUser.employeeId].sort().join('_'),
      //     userId
      //   );
      // }
    });

    socketRef.current.on('messages_read', ({ conversationId }) => {
      setMessages(prev =>
        prev.map(msg =>
          msg.conversationId === conversationId && !msg.isRead 
            ? { ...msg, isRead: true } 
            : msg
        )
      );
    });

    socketRef.current.on('receive_typing', ({ conversationId, userId: typingUserId }) => {
      if (
        selectedUser &&
        conversationId === [userId, selectedUser.employeeId].sort().join('_') &&
        typingUserId !== userId
      ) {
        setIsTyping(true);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
      }
    });

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [userId, token, selectedUser]);

  // Fetch chat history when a user is selected
  useEffect(() => {
  if (selectedUser && userId) {
    const loadChatHistory = async () => {
      try {
        const history = await ChatService.getChatHistory(userId, selectedUser.employeeId);
        const formattedMessages = history.map((msg: any) => ({
          ...msg,
          time: new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }));
        
        setMessages(formattedMessages);

        if (socketRef.current) {
          socketRef.current.emit('mark_messages_read', {
            conversationId: [userId, selectedUser.employeeId].sort().join('_'),
            userId: userId
          });
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    };
    
    loadChatHistory();
  }
}, [selectedUser, userId]);

  // Scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle infinite scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser || !userId) return;

    const messageText = newMessage.trim();
    const conversationId = [userId, selectedUser.employeeId].sort().join('_');
    
    
    const tempMessage: ChatMessage = {
      id: Date.now(),
      senderId: userId,
      receiverId: selectedUser.employeeId,
      text: messageText,
      time: new Date().toISOString(),
      isDelivered: false,
      isRead: false,
      messageType: messageText.toLowerCase().includes('urgent') 
        ? 'urgent' 
        : messageText.toLowerCase().includes('task') 
          ? 'task' 
          : 'text',
      conversationId,
      senderRole : "coordinator",
      receiverRole : selectedUser.role.toLocaleLowerCase()
    };

    try {
      setNewMessage('');
      setMessages(prev => [...prev, {
      ...tempMessage,
       time: new Date(tempMessage.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
       }]);

      const savedMessage = await ChatService.sendMessage(tempMessage);
      
       if (socketRef.current) {
      socketRef.current.emit("send_message", savedMessage, (deliveryConfirmation: any) => {
        if (deliveryConfirmation?.success) {
          setMessages(prev =>
            prev.map(msg =>
              msg.id === tempMessage.id 
                ? { ...msg, id: savedMessage.id, isDelivered: true }
                : msg
            )
          );
        }
      });
    }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
      setNewMessage(messageText);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    
    if (socketRef.current && socketConnected && selectedUser) {
      socketRef.current.emit('typing', {
        conversationId: [userId, selectedUser.employeeId].sort().join('_'),
        userId,
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    const matchesRole =  user.role 
    return matchesSearch && matchesStatus && matchesRole;
  });
  console.log(filteredUsers , "eryeyey")

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getMessageTypeStyle = (messageType?: string) => {
    switch (messageType) {
      case 'urgent': return 'border-l-4 border-red-500 bg-red-50';
      case 'task': return 'border-l-4 border-blue-500 bg-blue-50';
      default: return '';
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-100 rounded-2xl shadow-xl overflow-hidden h-[calc(100vh-12rem)]">
      {/* Connection Status Indicator */}
      <div className={`fixed top-4 right-4 z-50 px-3 py-1 rounded-full text-sm font-medium ${
        socketConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {socketConnected ? '🟢 Connected' : '🔴 Disconnected'}
      </div>

      {!selectedUser ? (
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="bg-white/80 backdrop-blur-sm border-b border-indigo-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Chat with Team
              </h2>
              <div className="flex items-center space-x-2">
                <div className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm font-medium">
                  {filteredUsers.filter(u => u.isOnline).length} Online
                </div>
                <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                  {filteredUsers.filter(u => u.status === 'available').length} Available
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search users or employee ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="busy">Busy</option>
                <option value="offline">Offline</option>
              </select>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as any)}
                className="px-4 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                <option value="mechanic">Mechanics</option>
                <option value="admin">Admins</option>
              </select>
            </div>
          </div>

          {/* Users List */}
          <div 
            className="flex-1 overflow-y-auto p-4 space-y-3" 
            onScroll={handleScroll}
          >
            {loading && page === 1 ? (
              <div className="flex justify-center items-center h-20">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center text-gray-500 py-10">No users found</div>
            ) : (
              filteredUsers.map(user => (
                <div
                  key={user.id }
                  className="group relative bg-white/70 backdrop-blur-sm hover:bg-white/90 rounded-xl p-4 cursor-pointer transform hover:scale-[1.02] transition-all duration-200 shadow-sm hover:shadow-md border border-white/50"
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="flex items-center">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <span className="text-white font-semibold text-lg">{user.avatar}</span>
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(user.status)} rounded-full border-2 border-white`}></div>
                    </div>
                    <div className="flex-1 ml-4 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-800 truncate">{user.name}</h3>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            {user.role === 'mechanic' ? (
                              <Wrench size={12} className="mr-1" />
                            ) : (
                              <Users size={12} className="mr-1" />
                            )}
                            <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full mr-2">
                              {user.role === 'mechanic' ? 'Mechanic' : 'Admin'}
                            </span>
                            <span>{user.employeeId}</span>
                            {user.location && (
                              <>
                                <span className="mx-2">•</span>
                                <span>{user.location}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">{user.time}</span>
                          {user.unreadCount! > 0 && (
                            <div className="bg-indigo-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-medium">
                              {user.unreadCount}
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 truncate mt-1">{user.lastMessage}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
            {loading && page > 1 && (
              <div className="flex justify-center items-center h-20">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col">
          {/* Chat Header */}
          <div className="bg-white/90 backdrop-blur-sm border-b border-indigo-100 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="mr-3 p-2 rounded-full hover:bg-indigo-100 transition-colors"
                >
                  <ChevronLeft size={20} className="text-gray-600" />
                </button>
                <div className="flex items-center">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white font-medium">{selectedUser.avatar}</span>
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(selectedUser.status)} rounded-full border-2 border-white`}></div>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-800">{selectedUser.name}</h3>
                    <div className="flex items-center text-xs text-gray-500">
                      <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full mr-2">
                        {selectedUser.role === 'mechanic' ? 'Mechanic' : 'Admin'}
                      </span>
                      <span>{selectedUser.employeeId}</span>
                      <span className="mx-2">•</span>
                      <span className="capitalize">{selectedUser.status}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 rounded-full hover:bg-indigo-100 transition-colors">
                  <Phone size={18} className="text-gray-600" />
                </button>
                <button className="p-2 rounded-full hover:bg-indigo-100 transition-colors">
                  <Video size={18} className="text-gray-600" />
                </button>
                <button className="p-2 rounded-full hover:bg-indigo-100 transition-colors">
                  <MoreVertical size={18} className="text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-indigo-50/50 to-purple-50/30">
            {messages.map((message, index) => (
              <div
                key={`${message.id}-${index}`}
                className={`flex ${message.senderId === userId ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                    message.senderId === userId
                      ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-tr-md'
                      : `bg-white text-gray-800 rounded-tl-md border border-gray-100 ${getMessageTypeStyle(message.messageType)}`
                  }`}
                >
                  <p className="break-words">{message.text}</p>
                  <div
                    className={`flex items-center justify-between mt-2 text-xs ${
                      message.senderId === userId ? 'text-indigo-100' : 'text-gray-500'
                    }`}
                  >
                    <span>{message.time}</span>
                        {message.senderId === userId && (
                          <div className="flex items-center ml-2 space-x-0.5">
                            {!message.isDelivered ? (
                              <>
                                <CheckCheck size={14} className="text-red-500" />
                                <CheckCheck size={14} className="text-red-500 -ml-1" />
                              </>
                            ) : message.isRead ? (
                              <>
                                <CheckCheck size={14} className="text-green-500" />
                                <CheckCheck size={14} className="text-green-500 -ml-1" />
                              </>
                            ) : (
                              <>
                                <CheckCheck size={14} className="text-gray-500" />
                                <CheckCheck size={14} className="text-gray-500 -ml-1" />
                              </>
                            )}
                          </div>
                        )}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-gray-100">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="bg-white/90 backdrop-blur-sm border-t border-indigo-100 p-4">
            <div className="flex items-center space-x-3">
              <button className="p-2 rounded-full hover:bg-indigo-100 transition-colors">
                <Paperclip size={20} className="text-gray-500" />
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newMessage}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder={socketConnected ? "Type your message..." : "Connecting..."}
                  disabled={!socketConnected}
                  className="w-full px-4 py-3 bg-gray-50 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all disabled:opacity-50"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 transition-colors">
                  <Smile size={18} className="text-gray-500" />
                </button>
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || !socketConnected}
                className="p-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-full hover:from-indigo-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all shadow-lg"
              >
                <Send size={18} />
              </button>
            </div>
            <div className="flex space-x-2 mt-3">
              <button
                onClick={() => setNewMessage('Please update task status')}
                className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs hover:bg-indigo-200 transition-colors"
              >
                Task Update
              </button>
              <button
                onClick={() => setNewMessage('URGENT: ')}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs hover:bg-red-200 transition-colors"
              >
                Urgent
              </button>
              <button
                onClick={() => setNewMessage('Great work! ')}
                className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs hover:bg-green-200 transition-colors"
              >
                Praise
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ChatWithMechanics;