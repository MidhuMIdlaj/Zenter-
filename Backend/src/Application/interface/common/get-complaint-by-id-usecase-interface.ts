import { IComplaintRepoReturn } from "../../../domain/dtos/complaint-usecase/create-complaint-usecase-interface";

export default interface IGetComplaintByIdUseCase {
  execute(complaintId: string): Promise<IComplaintRepoReturn>;
}
