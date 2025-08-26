// src/api/EmployeeAPI.ts
import axiosInstance from "../axiosInstance";


const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/admin`;


export const EmployeeAPI = {
  async getEmployeeProfile(id: string) {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/${id}`);
      console.log(response , "1324")
      return response.data.data;
    } catch (error) {
      console.error('Error fetching employee profile:', error);
      throw error;
    }
  },

  async updateEmployeeProfile(id: string, updateData: {
    employeeName: string;
    contactNumber: string;
    address: string;
    age: number;
  }) {
    try {
      const response = await axiosInstance.patch(`${API_BASE_URL}/${id}/profile`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating employee profile:', error);
      throw error;
    }
  }
};