import { Admin } from '../entities/Admin';

export interface AdminRepository {
  findByEmail(email: string): Promise<Admin | null>;
  storeOTP(email: string, otp: string): Promise<void>;
  verifyOTP(email: string, otp: string): Promise<boolean>;
  updatePassword(email: string, hashedPassword: string): Promise<void>;
}
