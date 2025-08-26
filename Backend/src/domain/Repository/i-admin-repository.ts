import { IFindAdminByIdResponse } from '../dtos/Admin-usecase/find-admin-by-id-usecase-interface';
import { IGetAllAdminUsecase } from '../dtos/Admin-usecase/get-all-admin-usecase-interface';
import { IUpdateProfileUsecase } from '../dtos/Admin-usecase/update-admin-profile-usecase-interface';
import { Admin } from '../entities/Admin';

export interface IAdminRepository {
  findByEmail(email: string): Promise<Admin | null>;
  storeOTP(email: string, otp: string): Promise<void>;
  verifyOTP(email: string, otp: string): Promise<boolean>;
  updatePassword(email: string, hashedPassword: string): Promise<void>;
   updateProfile(
    adminId: string, 
    updates: {
      firstName?: string;
      lastName?: string;
      phoneNumber?: string;
    }
  ): Promise<IUpdateProfileUsecase>;
  findAllAdmins(): Promise<Admin[]>;
  findById(adminId: string): Promise<IFindAdminByIdResponse | null>;
  findByAdminName(id: string): Promise<string | null>;
  getAllAdmins(page?: number, limit?: number): Promise<{ admins: IGetAllAdminUsecase[]; total: number }>;
}