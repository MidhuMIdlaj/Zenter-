import { inject, injectable } from "inversify";
import IComplaintRepository from "../../../domain/Repository/i-complaint-repository";
import { NotFoundError } from "../../../domain/error/complaintError";
import { TYPES } from "../../../types";
import { IComplaintRepoReturn } from "../../../domain/dtos/complaint-usecase/create-complaint-usecase-interface";
import IGetComplaintByIdUseCase from "../../interface/common/get-complaint-by-id-usecase-interface";


@injectable()
export default class GetComplaintByIdUseCase implements IGetComplaintByIdUseCase {
  constructor(
    @inject(TYPES.IComplaintRepository) private complaintRepo: IComplaintRepository
  ) {}

  async execute(complaintId: string):Promise<IComplaintRepoReturn> {
    const complaint = await this.complaintRepo.getComplaintById(complaintId);
    
    if (!complaint) {
      throw new NotFoundError('Complaint not found');
    }
    
    return complaint;
  }
}