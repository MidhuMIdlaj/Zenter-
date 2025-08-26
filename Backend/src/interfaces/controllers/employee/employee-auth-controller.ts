import { Request, Response } from "express";
import LoginEmployeeUseCase from "../../../Application/usecases/employee/login-employee-usecase";
import ResetPasswordRequestUseCase from "../../../Application/usecases/employee/reset-password-request-usecase";
import ResetPasswordUseCase from "../../../Application/usecases/employee/reset-password-usecase";
import { generateAccessToken, generateRefreshToken } from "../../../middleware/auth-middleware";
import { StatusCode } from "../../../shared/enums/statusCode";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types";
import ILoginEmployeeUseCase from "../../../Application/interface/employee/login-employee-usecase-interface";
import { IResetPasswordRequestEmployeeUseCase } from "../../../Application/interface/employee/reset-password-request-usecase-inetrface";
import { IResetPasswordEmployeeUseCase } from "../../../Application/interface/employee/reset-password-usecase-interface";
  
@injectable()
export default class EmployeeAuthController {
  constructor(
    @inject(TYPES.loginEmployeeUsecases) private loginEmployeeUseCase : ILoginEmployeeUseCase,
    @inject(TYPES.employeeResetPasswordRequestUsecases) private resetPasswordRequestUseCase : IResetPasswordRequestEmployeeUseCase,
    @inject(TYPES.employeeResetPasswordUsecases) private resetPasswordUseCase : IResetPasswordEmployeeUseCase
  ){}
  
  login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const employee = await this.loginEmployeeUseCase.execute(email, password);

    // 2. Generate tokens
    const accessToken = generateAccessToken({
      userId: employee.id,
      role: employee.position,
      email: employee.employeeName,
    });

    const refreshToken = generateRefreshToken({
      userId: employee.id,
      role : employee.position,
      email : employee.employeeName,
    });

     res.cookie('accessToken', accessToken,{
      httpOnly: false,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 
    });


    res.cookie('refreshToken', refreshToken, {
      httpOnly: false,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 
    });

    res.status(StatusCode.OK).json({
      token: accessToken, 
      position: employee.position,
      id: employee.id,
      employeeName: employee.employeeName,
      isDeleted : employee.isDeleted,
      role: employee.position,
    });

  } catch (err: unknown) {
  let message = 'Authentication failed';
  if (err instanceof Error) {
    message = err.message;
  }
  res.status(StatusCode.UNAUTHORIZED).json({ message });
 }
};

  requestResetPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      await this.resetPasswordRequestUseCase.execute(email);
      res.status(StatusCode.OK).json({ message: "OTP sent to email." });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      res.status(StatusCode.BAD_REQUEST).json({ message });
    }
  };

   verifyOTP = async (req: Request, res: Response) => {
      try {
        const { email, otp } = req.body;
        const isValid = await this.resetPasswordRequestUseCase.verifyOtp(email, otp);
        if (isValid) {
          res.status(StatusCode.OK).json({ message: "OTP verified successfully." });
        } else {
          res.status(StatusCode.BAD_REQUEST).json({ message: "Invalid OTP" });
        }
      }catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      res.status(StatusCode.BAD_REQUEST).json({ message });
    }
    };

  resendOTP = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      await this.resetPasswordRequestUseCase.execute(email);
      res.status(StatusCode.OK).json({ message: "New OTP sent to email." });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      res.status(StatusCode.BAD_REQUEST).json({ message });
    }
  };

  resetPassword = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      await this.resetPasswordUseCase.execute(email, password);
      res.status(StatusCode.OK).json({ message: "Password reset successfully." });
    }catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      res.status(StatusCode.BAD_REQUEST).json({ message });
    }
  };
}