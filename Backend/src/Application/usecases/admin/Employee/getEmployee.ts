import EmployeeRepository from "../../../../domain/Repository/EmployeeRepository";

export class GetAllEmployeesUseCase {
  constructor(private employeeRepo: EmployeeRepository) {}

  async execute() {
    return await this.employeeRepo.getAllEmployees();
  }
}
