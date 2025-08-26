import { IEditEmployeeUsecase } from "../../../../domain/dtos/Employee-usecase/edit-employee-usecase-interface";
import { UpdateEmployeeProfileData } from "../../../usecases/admin/Employee/update-employee-profile-usecase";

export interface IUpdateEmployeeProfileUseCase {
  execute(
    employeeId: string,
    updateData: UpdateEmployeeProfileData
  ): Promise<IEditEmployeeUsecase | null>;
}