
import EmployeeRepository from "../../../../domain/Repository/EmployeeRepository";
export class UpdateEmployeeStatusUseCase {
    constructor(private employeeRepo: EmployeeRepository) {}
  
    async execute(employeeId: string, status: "active" | "inactive") {
      if (!["active", "inactive"].includes(status)) {
        throw new Error("Invalid status");
      }
      await this.employeeRepo.updateStatus(employeeId, status);
    }
}