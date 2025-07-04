import EmployeeRepository from "../../../../domain/Repository/EmployeeRepository";
import Employee from "../../../../domain/entities/Employee";
import EmployeeModel from "../../../../infrastructure/db/models/EmployeeModel"

export class EditEmployeeUseCase {
  constructor(private employeeRepo: EmployeeRepository) {}

  async execute(employeeId: string, updatedData: Partial<Employee>): Promise<Employee | null> {
    return await this.employeeRepo.updateEmployee(employeeId, updatedData);
  }

  async softDeleteUser(employeeId: string): Promise<Employee | null> {
     const client = await EmployeeModel.findByIdAndUpdate(
           employeeId,
          { isDeleted: true },
          { new: true }
        );
        return client as Employee | null;
  }
}
