// src/services/videoCallService.ts
import axiosInstance from '../axiosInstance';
export const VideoCallService = {
  sendInvitations: async (callLink: string) => {
    try {
      const response = await axiosInstance.post('http://localhost:5000/api/video-call/send-invitations', {
        callLink
      });
      return response.data;
    } catch (error: any) {
      console.error('Error sending video call invitations:', error);
      throw new Error(error.response?.data?.message || 'Failed to send invitations');
    }
  }
};