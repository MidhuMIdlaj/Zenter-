import { AdminModel } from "../db/models/Admin/AdminModel"; // make sure path is correct
import { AdminRepository } from "../../domain/interfaces/AdminRepository";
import { Admin } from "../../domain/entities/Admin";
import redisClient from "../../app";

export class AdminRepoImpl implements AdminRepository {
  async findByEmail(email: string): Promise<Admin | null> {
    console.log(email, "chekcck")
    const admin = await AdminModel.findOne({email})
    console.log("admin",admin)
    return admin as Admin | null;
  }
  async storeOTP(email: string, otp: string) {
    await redisClient.set(`adminOtp:${email}`, otp);
  }
  
  async verifyOTP(email: string, otp: string) {
    console.log("Verifying OTP for admin email:", email, "OTP:", otp);
    const storedOtp = await redisClient.get(`adminOtp:${email}`);
    if (!storedOtp) throw new Error("OTP expired or not found");
    return storedOtp === otp;
  }

  async updatePassword(email: string, hashedPassword: string) {
    console.log("Updating password for admin email:", email);
    const res = await AdminModel.updateOne(
      { email: email },
      { password: hashedPassword }
    );
    console.log(res);
  }
}
