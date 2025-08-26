import { inject, injectable } from "inversify";
import IEmployeeRepository from "../../../../domain/Repository/i-employee-repository";
import { TYPES } from "../../../../types";
import { IEditEmployeeUsecase } from "../../../../domain/dtos/Employee-usecase/edit-employee-usecase-interface";
import { IUpdateEmployeeProfileUseCase } from "../../../interface/admin/employee/update-employee-profile-usecase-interface";

export interface UpdateEmployeeProfileData {
  employeeName: string;
  contactNumber: string;
  address: string;
  age: number;
}

@injectable()
export default class UpdateEmployeeProfileUseCase implements IUpdateEmployeeProfileUseCase {
  constructor(
    @inject(TYPES.IEmployeeRepository) private employeeRepo : IEmployeeRepository
   ){}

  async execute(
    employeeId: string,
    updateData: UpdateEmployeeProfileData
  ): Promise<IEditEmployeeUsecase | null> {
    return this.employeeRepo.updateEmployee(employeeId, updateData);
  }
}