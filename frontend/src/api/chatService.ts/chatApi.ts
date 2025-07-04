import axiosInstance from '../axiosInstance';

const API_BASE_URL = 'http://localhost:5000/api/chat'; 

export const ChatService = {
  // Get chat history between two users
  getChatHistory: async (userId: string, receiverId: string) => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/history/${userId}/${receiverId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching chat history:', error);
      throw error;
    }
  },

  // Send a new message
  sendMessage: async (messageData: any) => {
    try {
      const response = await axiosInstance.post(`${API_BASE_URL}/messages`, messageData);
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Mark messages as read
  markMessagesAsRead: async (conversationId: string, userId: string) => {
    try {
      const response = await axiosInstance.put(`${API_BASE_URL}/messages/read`, {
        conversationId,
        userId,
      });
      return response.data;
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  },

  // Get all conversations for a user
  getConversations: async (userId: string) => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/conversations/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  },
};