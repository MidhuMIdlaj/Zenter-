// src/Application/usecases/admin/Employee/updateEmployeeProfile.ts
import Employee from "../../../../domain/entities/Employee";
import EmployeeRepository from "../../../../domain/Repository/EmployeeRepository";

interface UpdateEmployeeProfileData {
  employeeName: string;
  contactNumber: string;
  address: string;
  age: number;
}

export default class UpdateEmployeeProfileUseCase {
  constructor(private employeeRepository: EmployeeRepository) {}

  async execute(
    employeeId: string,
    updateData: UpdateEmployeeProfileData
  ): Promise<Employee | null> {
    return this.employeeRepository.updateEmployee(employeeId, updateData);
  }
}