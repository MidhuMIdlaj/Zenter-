import { IChangeStatusUsecase } from "../../../domain/dtos/complaint-usecase/change-status-usecase-interface";


export interface IChangeStatusUseCase {
  execute(
    complaintId: string,
    newStatus: string,
    mechanicId: string
  ): Promise<IChangeStatusUsecase>;
}
