import bcrypt from "bcrypt";
import  EmployeeRepository  from "../../../domain/interfaces/EmployeeRepository";

export default class ResetPasswordUseCase {
  constructor(private employeeRepo: EmployeeRepository) {}

  async execute(email: string, password: string) {
    console.log("ResetPassword use case called with email:", password);
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password:", hashedPassword);
    await this.employeeRepo.updatePassword(email, hashedPassword
    );
  }
}
