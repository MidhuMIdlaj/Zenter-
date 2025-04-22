// =====================
// 📁 controller/EmployeeController.ts
// =====================
import { Request, Response } from "express";
import EmployeeRepoImpl  from "../../../infrastructure/repositories/EmployeeRepoImpl";
import LoginEmployeeUseCase from "../../../Application/usecases/employee/LoginEmployee";
import ResetPasswordRequestUseCase from "../../../Application/usecases/employee/ResetPasswordRequest";
import ResetPasswordUseCase from "../../../Application/usecases/employee/ResetPassword";

export default class EmployeeController {
  private employeeRepo = new EmployeeRepoImpl();
  private loginEmployeeUseCase = new LoginEmployeeUseCase(this.employeeRepo);
  private resetPasswordRequestUseCase = new ResetPasswordRequestUseCase(this.employeeRepo);
  private resetPasswordUseCase = new ResetPasswordUseCase(this.employeeRepo);

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const {token, position} = await this.loginEmployeeUseCase.execute(email, password);
      res.status(200).json({ token, position });
    } catch (err: any) {
      res.status(401).json({ message: err.message });
    }
  };

  requestResetPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      console.log("Requesting password reset for email:", email);
      await this.resetPasswordRequestUseCase.execute(email);
      res.status(200).json({ message: "OTP sent to email." });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };

  resendOTP = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      console.log("Resending OTP for email:", email);
      await this.resetPasswordRequestUseCase.execute(email);
      res.status(200).json({ message: "New OTP sent to email." });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };

  resetPassword = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      console.log("Resetting password for email:", password);
      await this.resetPasswordUseCase.execute(email, password);
      res.status(200).json({ message: "Password reset successfully." });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };
}