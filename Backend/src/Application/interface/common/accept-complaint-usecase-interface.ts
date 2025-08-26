
import { IAcceptComplaintUsecase } from "../../../domain/dtos/complaint-usecase/accept-complaint-usecase-interface";

export interface IAcceptComplaintUseCase {
  execute(complaintId: string, mechanicId: string): Promise<IAcceptComplaintUsecase>;
}
