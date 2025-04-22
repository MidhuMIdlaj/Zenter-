import axios, { AxiosResponse } from "axios";
// import createAxiosInstance from "../axiosInstance";
import { Admin } from "../../types/dashboard";


interface ForgotPasswordFormData {
  email: string;
  otp?: string;
  password?: string;
}

export const AdminLoginApi = async (
    email: string,
    password: string
  ): Promise<AxiosResponse<Admin>> => {
    try {
      const response = await axios.post<Admin>(
        "http://localhost:5000/api/admin/login",
        { email, password },
        { withCredentials: true }
      );
      return response;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response;
      }
      throw new Error("Oops something went wrong");
    }
  };
  

  export const ForgotPasswordEmailApi = async (
    email: string,
  ): Promise<AxiosResponse<ForgotPasswordFormData>> => {
    try {
      const response = await axios.post<ForgotPasswordFormData>(
        "http://localhost:5000/api/admin/requestForgotPassword",
        { email },
        { withCredentials: true }
      );
      return response;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response;
      }
      throw new Error("Oops something went wrong");
    }
  };
  
  export const VerifyAdminOtpApi = async (
    email: string,
    otp: string,
  ): Promise<AxiosResponse<ForgotPasswordFormData>> => {
    try {
      const response = await axios.post<ForgotPasswordFormData>(
        "http://localhost:5000/api/admin/verifyOtp",
        { email, otp },
        { withCredentials: true }
      );
      return response;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response;
      }
      throw new Error("Oops something went wrong");
    }
  };
  
  export const ResetAdminPasswordApi = async (
    email: string,
    password: string,
  ): Promise<AxiosResponse<ForgotPasswordFormData>> => {
    try {
      const response = await axios.post<ForgotPasswordFormData>(
        "http://localhost:5000/api/admin/resetPassword",
        { email, password },
        { withCredentials: true }
      );
      return response;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response;
      }
      throw new Error("Oops something went wrong");
    }
  };
  