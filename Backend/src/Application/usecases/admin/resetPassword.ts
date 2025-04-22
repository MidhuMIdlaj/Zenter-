import bcrypt from 'bcrypt';
import {AdminRepository} from "../../../domain/interfaces/AdminRepository";

export default class ResetPasswordUseCase {
  constructor(private adminRepo: AdminRepository) {}

  async execute(email: string, password: string) {
    console.log("ResetPassword use case called with email:", email);
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password:", hashedPassword);
    await this.adminRepo.updatePassword(email, hashedPassword);
  }
}