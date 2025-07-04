import IEmployeeRepository from "../../../domain/Repository/EmployeeRepository";
import  Employee  from "../../../domain/entities/Employee";

export class GetAvailableMechanics {
  constructor(private readonly employeeRepository: IEmployeeRepository) {}

  async execute(): Promise<Employee[]> {
    return this.employeeRepository.findAvailableMechanics();
  }
}