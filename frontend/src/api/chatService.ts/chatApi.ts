import axiosInstance from '../axiosInstance';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/chat`;
 

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
sendMessage: async (messageData: any, files: File[] = []) => {
  try {
    console.log("Sending message with data:", messageData);
    const formData = new FormData();
    
    // Append fields directly
    formData.append('senderId', messageData.senderId);
    formData.append('receiverId', messageData.receiverId);
    formData.append('text', messageData.text || '');
    formData.append('conversationId', messageData.conversationId);
    formData.append('senderRole', messageData.senderRole);
    formData.append('receiverRole', messageData.receiverRole);
    
    // Append messageType if present
    formData.append('messageType', messageData.messageType || (files.length > 0 ? 'file' : 'text'));

    // Append files
    files.forEach((file) => {
      formData.append('attachments', file); // Match multer field name
    });

    console.log("FormData contents:", { senderId: messageData.senderId, receiverId: messageData.receiverId, text: messageData.text, conversationId: messageData.conversationId, messageType: messageData.messageType, files });

    const response = await axiosInstance.post(`${API_BASE_URL}/messages`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
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