import { IGetEmployeeProfileUsecase } from "../../../../domain/dtos/Employee-usecase/get-employee-profile-usecase-interface";

export default interface IGetEmployeeProfileUseCase {
  execute(employeeId: string): Promise<IGetEmployeeProfileUsecase | null>;
}
