import EmployeeModel from "../../infrastructure/db/models/EmployeeModel";
import Employee from "../../domain/entities/Employee";
import EmployeeRepository from "../../domain/interfaces/EmployeeRepository";
import redisClient from "../../app";
import { DuplicateResourceError, ServerError } from "../../domain/error/employeeErrors";
export default class EmployeeRepoImpl implements EmployeeRepository {
  async createEmployee(
    employeeName: string,
    emailId: string,
    joinDate: Date,
    contactNumber: string,
    address: string,
    currentSalary: number,
    age: number,
    position: 'coordinator' | 'mechanic',
    previousJob: string = "",
    experience: number = 0
  ): Promise<Employee | null> {
    try {
      // Assuming you have a MongoDB employee model
      const employee = await EmployeeModel.create({
        employeeName,
        emailId,
        joinDate,
        contactNumber,
        address,
        currentSalary,
        age,
        position,
        previousJob,
        experience
      });
      
      return employee;
    } catch (error: any) {
      if (error.name === 'MongoError' && error.code === 11000) {
        throw new DuplicateResourceError("An employee with this email already exists");
      }
      
      // Log the database error for debugging
      console.error("Database Error:", error);
      throw new ServerError("Failed to create employee in database");
    }
  }

  async findByEmail(emailId: string) {
    console.log("Finding employee by email:", emailId);
    return await EmployeeModel.findOne({ emailId });
  }

  async storeOTP(email: string, otp: string) {
    await redisClient.set(`otp:${email}`, otp,);
  }
  
  async verifyOTP(email: string, otp: string) {
    console.log("Verifying OTP for email:", email, "OTP:", otp);
    const storedOtp = await redisClient.get(`otp:${email}`);
    if (!storedOtp) throw new Error("OTP expired or not found");
    return storedOtp === otp;
  }

  async updatePassword(email: string, hashedPassword: string) {
    console.log("Updating password for email:", email);
    const res = await EmployeeModel.updateOne(
      { emailId: email},{  password: hashedPassword }
    );
    console.log(res);
  }
}