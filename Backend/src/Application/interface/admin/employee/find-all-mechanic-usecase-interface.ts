import { IFindAllCoordinatorAndMechanic } from "../../../../domain/dtos/Employee-usecase/find-all-coordinator-usecase";

export interface IFindAllMechanicsUseCase {
  execute(): Promise<IFindAllCoordinatorAndMechanic[]>;
}
