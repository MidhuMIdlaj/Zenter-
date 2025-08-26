import { inject, injectable } from "inversify";
import {IAdminRepository} from "../../../domain/Repository/i-admin-repository";
import { IEmailService } from "../../../domain/Repository/i-email-repository";
import { TYPES } from "../../../types";
import { IResetPasswordRequestUseCase } from "../../interface/admin/admin/reset-password-request-usecase-interface";


@injectable()
export default class ResetPasswordRequestAdminUseCase implements IResetPasswordRequestUseCase {
   constructor(
    @inject(TYPES.IAdminRepository) private adminRepo : IAdminRepository,
    @inject(TYPES.IEmailService) private emailService : IEmailService
  ) {}

  async execute(email: string) {
    const admin = await this.adminRepo.findByEmail(email);
    if (!admin) throw new Error("Admin not found");
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.adminRepo.storeOTP(email, otp);
    await this.emailService.sendResetOTP(email, otp);
    return { otp };
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    return await this.adminRepo.verifyOTP(email, otp);
  }
}