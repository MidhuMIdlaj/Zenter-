import { inject, injectable } from "inversify";
import IComplaintRepository from "../../../domain/Repository/i-complaint-repository";
import { TYPES } from "../../../types";
import { IDeleteComplaintUsecase } from "../../../domain/dtos/complaint-usecase/complaint-delete-usecase-interface";
import IDeleteComplaintUseCase from "../../interface/common/delete-complaint-usecase-interface";

@injectable()
export class DeleteComplaintUseCase implements IDeleteComplaintUseCase{
  constructor(
    @inject(TYPES.IComplaintRepository) private complaintRepo : IComplaintRepository
  ){}

  async execute(id: string):Promise<IDeleteComplaintUsecase> {
    return await this.complaintRepo.deleteComplaint(id);
  }
}
