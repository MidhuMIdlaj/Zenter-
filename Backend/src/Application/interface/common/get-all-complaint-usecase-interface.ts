import { IComplaintRepoReturn } from "../../../domain/dtos/complaint-usecase/create-complaint-usecase-interface";

export default interface IGetAllComplaintsUseCase {
  execute(): Promise<IComplaintRepoReturn[]>;
}
