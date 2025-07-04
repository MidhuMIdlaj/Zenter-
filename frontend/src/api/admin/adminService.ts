import axiosInstance from "../axiosInstance";

const API_BASE_URL = "http://localhost:5000/api/admin";

export const AdminProfileService = {
  getProfile: async (adminId: string) => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/profile`,{
        headers :{
            adminId : adminId
        }
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch profile');
    }
  },

  updateProfile: async (adminId: string, updates: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
  }) => {
    try {
      const response = await axiosInstance.put(
        `${API_BASE_URL}/updateProfile`,
        updates,
        {
          headers: {
            adminId : adminId
          }
        }
      );

      return response.data.data.admin;
    } catch (error) {
      throw new Error('Failed to update profile');
    }
  }
};