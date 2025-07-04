// Application/usecases/admin/addEmployee.ts
import EmployeeRepository from "../../../../domain/Repository/EmployeeRepository";
import Employee from "../../../../domain/entities/Employee";
import { ValidationError, ServerError } from "../../../../domain/error/employeeErrors";


export class AddEmployeeUseCase {
  constructor(private employeeRepo: EmployeeRepository) {}
  async execute(
    employeeName: string,
    emailId: string,
    joinDate: string | Date,
    contactNumber: string,
    address: string,
    currentSalary: number,
    age: number,
    position: 'coordinator' | 'mechanic',
    fieldOfMechanic?: string,
    previousJob?: string,
    experience?: number,
  ): Promise<Employee | null> {
    if (!employeeName || !employeeName.trim()) {
      throw new ValidationError("Employee name is required");
    }
    
    if (!emailId || !emailId.trim()) {
      throw new ValidationError("Email is required");
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailId)) {
      throw new ValidationError("Invalid email format");
    }
    
    // Parse and validate join date
    const parsedJoinDate = joinDate instanceof Date ? joinDate : new Date(joinDate);
    if (isNaN(parsedJoinDate.getTime())) {
      throw new ValidationError("Invalid join date format");
    }
    
    // Check if join date is in the future
    if (parsedJoinDate > new Date()) {
      throw new ValidationError("Join date cannot be in the future");
    }
    
    // Validate salary
    if (isNaN(currentSalary) || currentSalary <= 0) {
      throw new ValidationError("Salary must be a positive number");
    }
    
    // Validate age
    if (isNaN(age) || age < 18 || age > 80) {
      throw new ValidationError("Age must be between 18 and 80");
    }
    
    // Validate position
    if (position !== 'coordinator' && position !== 'mechanic') {
      throw new ValidationError("Position must be either 'coordinator' or 'mechanic'");
    }
    
    // Validate experience if provided
    if (experience !== undefined && (isNaN(experience) || experience < 0)) {
      throw new ValidationError("Experience must be a non-negative number");
    }

    try {
      const existingEmployee = await this.employeeRepo.findByEmail(emailId);
      if (existingEmployee) {
        throw new ValidationError("An employee with this email already exists");
      }

      return await this.employeeRepo.createEmployee(
        employeeName,
        emailId,
        parsedJoinDate,
        contactNumber,
        address,
        currentSalary,
        age,
        position,
        fieldOfMechanic ??"",
        previousJob || "",
        experience ?? 0, 
      );
    } catch (error : any) {
      // Re-throw if it's already an AppError
      if (error.name === 'ValidationError' || error.name === 'DuplicateResourceError') {
        throw error;
      }
      console.error("Error in AddEmployeeUseCase:", error);
      throw new ServerError("Failed to add employee");
    }
  }
}