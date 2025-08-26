// usecase/edit-employee.usecase.ts
import { inject, injectable } from "inversify";
import IEmployeeRepository from "../../../../domain/Repository/i-employee-repository";
import { TYPES } from "../../../../types";
import { IEditEmployeeUsecase } from "../../../../domain/dtos/Employee-usecase/edit-employee-usecase-interface";
import { IEditEmployee } from "../../../interface/admin/employee/edit-employee-usecase-interface";

@injectable()
export class EditEmployeeUseCase implements IEditEmployee {
  constructor(
    @inject(TYPES.IEmployeeRepository)
    private employeeRepo: IEmployeeRepository
  ) {}

  async execute(
    employeeId: string,
    updatedData: Partial<IEditEmployeeUsecase>
  ): Promise<IEditEmployeeUsecase | null> {
    return await this.employeeRepo.updateEmployee(employeeId, updatedData);
  }
}
