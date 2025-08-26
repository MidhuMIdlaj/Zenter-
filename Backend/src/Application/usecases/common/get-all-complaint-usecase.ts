import { inject, injectable } from "inversify";
import IComplaintRepository from "../../../domain/Repository/i-complaint-repository";
import { TYPES } from "../../../types";
import { IComplaintRepoReturn } from "../../../domain/dtos/complaint-usecase/create-complaint-usecase-interface";
import IGetAllComplaintsUseCase from "../../interface/common/get-all-complaint-usecase-interface";

@injectable()
export default class GetAllComplaintsUseCase implements IGetAllComplaintsUseCase {
  constructor(
    @inject(TYPES.IComplaintRepository) private complaintRepo: IComplaintRepository
  ) {}

  async execute(): Promise<IComplaintRepoReturn[]> {
    return this.complaintRepo.getAllComplaints();
  }
}