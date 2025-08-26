import { IComplaintRepoReturn } from "../../../domain/dtos/complaint-usecase/create-complaint-usecase-interface";

export interface IUpdateComplaintStatusUseCase {
  execute(
    complaintId: string,
    status: 'submitted' | 'in_progress' | 'resolved' | 'rejected',
    updatedBy: string
  ): Promise<IComplaintRepoReturn>;
}
