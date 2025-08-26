import { IEditEmployeeUsecase } from "../../../../domain/dtos/Employee-usecase/edit-employee-usecase-interface";

export interface IEditEmployee {
  execute(employeeId: string, updatedData: Partial<IEditEmployeeUsecase>): Promise<IEditEmployeeUsecase | null>;
}
