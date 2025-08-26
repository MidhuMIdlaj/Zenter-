import { inject, injectable } from "inversify";
import Employee from "../../../../domain/entities/Employee";
import IEmployeeRepository from "../../../../domain/Repository/i-employee-repository";
import { TYPES } from "../../../../types";
import { IFindAllCoordinatorAndMechanic } from "../../../../domain/dtos/Employee-usecase/find-all-coordinator-usecase";
import { IFindAllMechanicsUseCase } from "../../../interface/admin/employee/find-all-mechanic-usecase-interface";

@injectable()
export class FindAllMechanicsUseCase implements IFindAllMechanicsUseCase {
  constructor(
    @inject(TYPES.IEmployeeRepository) private employeeRepo : IEmployeeRepository
){}

  async execute(): Promise<IFindAllCoordinatorAndMechanic[]> {
    return await this.employeeRepo.findAllMechanics();
  }
}
