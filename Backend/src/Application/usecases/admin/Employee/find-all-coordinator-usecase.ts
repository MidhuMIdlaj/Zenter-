import { inject, injectable } from "inversify";
import IEmployeeRepository from "../../../../domain/Repository/i-employee-repository";
import { TYPES } from "../../../../types";
import { IFindAllCoordinatorAndMechanic } from "../../../../domain/dtos/Employee-usecase/find-all-coordinator-usecase";
import { IFindAllCoordinatorsUseCase } from "../../../interface/admin/employee/find-all-coordinator-usecase-interface";

@injectable()
export class FindAllCoordinatorsUseCase implements IFindAllCoordinatorsUseCase {
 constructor(
    @inject(TYPES.IEmployeeRepository) private employeeRepo : IEmployeeRepository
  ){}

  async execute(): Promise<IFindAllCoordinatorAndMechanic[]>{
    return await this.employeeRepo.findAllCoordinators();
  }
}
