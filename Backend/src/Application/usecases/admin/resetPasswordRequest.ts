import {AdminRepository} from "../../../domain/interfaces/AdminRepository";
import { sendResetOTP } from "../../../utils/nodemailer";

export default class ResetPasswordRequestUseCase {
  constructor(private adminRepo: AdminRepository) {}

  async execute(email: string) {
    const admin = await this.adminRepo.findByEmail(email);
    if (!admin) throw new Error("Admin not found");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.adminRepo.storeOTP(email, otp);
    await sendResetOTP(email, otp,);
    return { otp };
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    return await this.adminRepo.verifyOTP(email, otp);
  }
}