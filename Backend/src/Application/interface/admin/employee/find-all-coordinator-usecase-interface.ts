import { IFindAllCoordinatorAndMechanic } from "../../../../domain/dtos/Employee-usecase/find-all-coordinator-usecase";

export interface IFindAllCoordinatorsUseCase {
  execute(): Promise<IFindAllCoordinatorAndMechanic[]>;
}
