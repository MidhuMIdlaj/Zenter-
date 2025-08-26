import { inject, injectable } from "inversify";
import  IEmployeeRepository  from "../../../domain/Repository/i-employee-repository";
import { TYPES } from "../../../types";
import { IEmailService } from "../../../domain/Repository/i-email-repository";
import { IResetPasswordRequestEmployeeUseCase } from "../../interface/employee/reset-password-request-usecase-inetrface";


@injectable()
export default class ResetPasswordRequestEmployeeUseCase implements IResetPasswordRequestEmployeeUseCase{
  constructor(
    @inject(TYPES.IEmployeeRepository) private employeeRepo: IEmployeeRepository,
    @inject(TYPES.IEmailService) private emailService : IEmailService
  ) {}

   async execute(email: string): Promise<{ otp: string }> {
    const employee = await this.employeeRepo.findByEmail(email);
    if (!employee) throw new Error("Employee not found");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.employeeRepo.storeOTP(email, otp);
    await this.emailService.sendResetOTP(email, otp);
    return { otp };
  }

   async verifyOtp(email: string, otp: string): Promise<boolean> {
    return await this.employeeRepo.verifyOTP(email, otp);
  }
}
