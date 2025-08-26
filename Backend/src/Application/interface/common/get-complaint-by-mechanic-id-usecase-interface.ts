import { IComplaintRepoReturn } from "../../../domain/dtos/complaint-usecase/create-complaint-usecase-interface";

export default interface IGetComplaintsAssignedToMechanicUseCase {
  execute(mechanicId: string): Promise<IComplaintRepoReturn[]>;
}
