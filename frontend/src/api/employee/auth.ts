import axios, { AxiosResponse } from "axios";
import { EmployeeFormData, ResetPasswordEmailFormData } from "../../types/dashboard";


interface  responseData {
  message: string;
  token: string;
  emailId : string;
  position :  string;
}

export const EmployeeLoginApi = async (
    email: string,
    password: string
  ): Promise<AxiosResponse<EmployeeFormData>> => {
    try {
      const response = await axios.post<EmployeeFormData>(
        "http://localhost:5000/api/employee/loginEmployee",
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

export const ResetPasswordEmailApi = async (
    email: string,
): Promise<AxiosResponse<ResetPasswordEmailFormData>> => {
    try {
      const response = await axios.post<ResetPasswordEmailFormData>(
        "http://localhost:5000/api/employee/requestResetPassword",
        { email},
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

  export const VerifyOtpApi = async (
    email: string,
    otp : string,
): Promise<AxiosResponse<ResetPasswordEmailFormData>> => {
    try {
      const response = await axios.post<ResetPasswordEmailFormData>(
        "http://localhost:5000/api/employee/ResendOtp",
        { email , otp},
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

  export const ResetPasswordApi = async (
    email: string,
    password : string,
): Promise<AxiosResponse<ResetPasswordEmailFormData>> => {
    try {
      const response = await axios.post<ResetPasswordEmailFormData>(
        "http://localhost:5000/api/employee/resetPassword",
        { email , password},
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