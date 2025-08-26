import { IGetAvailableMechanicUsecase } from "../../../domain/dtos/complaint-usecase/get-available-mechanic-usecase-interface";

export default interface IGetAvailableMechanicsUseCase {
  execute(): Promise<IGetAvailableMechanicUsecase[]>;
}
