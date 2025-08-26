import bcrypt from 'bcrypt';
import {IAdminRepository} from "../../../domain/Repository/i-admin-repository";
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../types';
import { IResetPasswordUseCase } from '../../interface/admin/admin/reset-password-usecase-interface';

@injectable()
export default class ResetPasswordAdminUseCase implements IResetPasswordUseCase {
  constructor(
      @inject(TYPES.IAdminRepository) private adminRepo : IAdminRepository
    ){}

  async execute(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.adminRepo.updatePassword(email, hashedPassword);
  }
}