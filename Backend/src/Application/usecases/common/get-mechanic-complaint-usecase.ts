import { inject, injectable } from "inversify";
import IComplaintRepository from "../../../domain/Repository/i-complaint-repository";
import { TYPES } from "../../../types";
import { IGetComplaintMechanicUsecase } from "../../../domain/dtos/complaint-usecase/get-mechanic-complaint-usecase-interface";
import IGetMechanicComplaintUseCase from "../../interface/common/get-mechanic-complaint-usecase-interface";



@injectable()
export class GetMechanicComplaint implements IGetMechanicComplaintUseCase {
  constructor(
    @inject(TYPES.IComplaintRepository)  private complaintRepo: IComplaintRepository
  ) {}

  async execute(mechanicId: string): Promise<IGetComplaintMechanicUsecase[]> {
    if (!mechanicId) {
      throw new Error("Mechanic ID is required");
    }

    return await this.complaintRepo.getComplaintsByMechanic(mechanicId);
  }
}