import bcrypt from "bcrypt";
import  IEmployeeRepository  from "../../../domain/Repository/i-employee-repository";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types";
import { IResetPasswordEmployeeUseCase } from "../../interface/employee/reset-password-usecase-interface";


@injectable()
export default class ResetPasswordEmployeeUseCase implements IResetPasswordEmployeeUseCase {
  constructor(
    @inject(TYPES.IEmployeeRepository) private employeeRepo: IEmployeeRepository
  ) {}

  async execute(email: string, password: string):Promise<void> {
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.employeeRepo.updatePassword(email, hashedPassword
    );
  }
}
