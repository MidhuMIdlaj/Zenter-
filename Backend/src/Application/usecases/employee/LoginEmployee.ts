import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import EmployeeRepository from '../../../infrastructure/repositories/EmployeeRepoImpl';
import { log } from 'console';

export default class LoginEmployeeUseCase {
  constructor(private employeeRepo: EmployeeRepository) {}

  async execute(email: string, password: string | null): Promise<{token : string, position: string}> {  
    const employee = await this.employeeRepo.findByEmail(email);
    console.log("Employee found:", employee);
    if (!employee) throw new Error("Employee not found");
    if (password === null) {
      throw new Error("Password has not been set. Please set your password.");
    }

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) throw new Error("Invalid credentials");
     console.log("Password matched:", isMatch);
    const token = jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: "5m" });
    return{
      position: employee.position,
      token: token,
    }
  }
}
 