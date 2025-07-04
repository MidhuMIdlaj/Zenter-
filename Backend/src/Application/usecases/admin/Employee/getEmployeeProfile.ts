// src/Application/usecases/admin/Employee/getEmployeeProfile.ts
import Employee from "../../../../domain/entities/Employee";
import EmployeeRepository from "../../../../domain/Repository/EmployeeRepository";

export default class GetEmployeeProfileUseCase {
  constructor(private employeeRepository: EmployeeRepository) {}

  async execute(employeeId: string): Promise<Employee | null> {
    return this.employeeRepository.findByEmployeeId(employeeId);
  }
}