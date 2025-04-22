// api/admin/Employee.ts
import axios from "axios";
import { EmployeeFormData } from "../../types/dashboard";

export const EmployeeApi = async (data: EmployeeFormData): Promise<any> => {
  try {
    const response = await axios.post("http://localhost:5000/api/admin/createEmployee", data);
    return response.data;
  } catch (error) {
    console.error("Client API error", error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const errorMessage = error.response.data.message || "Failed to add employee";
        throw new Error(errorMessage);
      } 
      else if (error.request) {
        throw new Error("Server not responding. Please check your internet connection.");
      } 
      else {
        throw new Error("Error setting up the request: " + error.message);
      }
    }
      throw new Error(error instanceof Error ? error.message : "An unknown error occurred");
  }
};