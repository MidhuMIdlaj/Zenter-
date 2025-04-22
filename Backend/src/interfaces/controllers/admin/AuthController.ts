import { Request, Response } from "express";
import { AdminRepoImpl } from "../../../infrastructure/repositories/AdminRepImpl";
import LoginAdminUseCase from "../../../Application/usecases/admin/adminAuth";
import ResetPasswordRequestUseCase from "../../../Application/usecases/admin/resetPasswordRequest"
import ResetPasswordUseCase from "../../../Application/usecases/admin/resetPassword";

export default class AdminController {
  private adminRepo = new AdminRepoImpl();
  private loginAdminUseCase = new LoginAdminUseCase(this.adminRepo);
  private resetPasswordRequestUseCase = new ResetPasswordRequestUseCase(this.adminRepo);
  private resetPasswordUseCase = new ResetPasswordUseCase(this.adminRepo);

  adminLogin = async (req: Request, res: Response) => {
    try {
      console.log("Admin login controller called", req.body);
      const { email, password } = req.body;
      console.log({ email, password });
      const token = await this.loginAdminUseCase.execute(email, password);
      console.log("Token generated:", token);
      res.status(200).json({ token, email });
    } catch (err: any) {
      res.status(401).json({ message: err.message });
    }
  };

  requestForgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      console.log("Requesting password reset for admin email:", email);
      await this.resetPasswordRequestUseCase.execute(email);
      res.status(200).json({ message: "OTP sent to email." });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };

  resendOTP = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      console.log("Resending OTP for admin email:", email);
      await this.resetPasswordRequestUseCase.execute(email);
      res.status(200).json({ message: "New OTP sent to email." });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };

  verifyOTP = async (req: Request, res: Response) => {
    try {
      const { email, otp } = req.body;
      console.log("Verifying OTP for admin email:", email);
      const isValid = await this.resetPasswordRequestUseCase.verifyOtp(email, otp);
      if (isValid) {
        res.status(200).json({ message: "OTP verified successfully." });
      } else {
        res.status(400).json({ message: "Invalid OTP" });
      }
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };

  resetPassword = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      console.log("Resetting password for admin email:", email);
      await this.resetPasswordUseCase.execute(email, password);
      res.status(200).json({ message: "Password reset successfully." });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };
}