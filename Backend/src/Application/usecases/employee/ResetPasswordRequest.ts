import  EmployeeRepository  from "../../../domain/interfaces/EmployeeRepository";
import { sendResetOTP } from "../../../utils/nodemailer";

export default class ResetPasswordRequestUseCase {
  constructor(private employeeRepo: EmployeeRepository) {}

   async execute(email: string) {
    const employee = await this.employeeRepo.findByEmail(email);
    if (!employee) throw new Error("Employee not found");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.employeeRepo.storeOTP(email, otp);
    await sendResetOTP(email, otp);
    return { otp };
  }
}
