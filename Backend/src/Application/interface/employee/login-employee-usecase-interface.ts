import { ILoginEmployeeResult } from "../../../domain/dtos/Employee-usecase/login-employee-usecase-interface";

export default interface ILoginEmployeeUseCase {
  execute(email: string, password: string | null): Promise<ILoginEmployeeResult>;
}
