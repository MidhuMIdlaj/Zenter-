import { IGetComplaintMechanicUsecase } from "../../../domain/dtos/complaint-usecase/get-mechanic-complaint-usecase-interface";

export default interface IGetMechanicComplaintUseCase {
  execute(mechanicId: string): Promise<IGetComplaintMechanicUsecase[]>;
}
