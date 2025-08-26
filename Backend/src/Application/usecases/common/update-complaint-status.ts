import { inject, injectable } from "inversify";
import IComplaintRepository from "../../../domain/Repository/i-complaint-repository";
import { NotFoundError, ValidationError } from "../../../domain/error/complaintError";
import { TYPES } from "../../../types";
import { IComplaintRepoReturn } from "../../../domain/dtos/complaint-usecase/create-complaint-usecase-interface";
import { IUpdateComplaintStatusUseCase } from "../../interface/common/update-complaint-status-usecase-interface";

@injectable()
export default class UpdateComplaintStatusUseCase implements IUpdateComplaintStatusUseCase {
  
  constructor(
    @inject(TYPES.IComplaintRepository) private complaintRepo: IComplaintRepository
  ) {}

  async execute(
    complaintId: string, 
    status: 'submitted' | 'in_progress' | 'resolved' | 'rejected',
    updatedBy: string,
  ):Promise<IComplaintRepoReturn> {
    if (!complaintId) {
      throw new ValidationError('Complaint ID is required');
    }

    if (!['submitted', 'in_progress', 'resolved', 'rejected'].includes(status)) {
      throw new ValidationError('Invalid status value');
    }

    if (!updatedBy) {
      throw new ValidationError('Updater ID is required');
    }

    const updatedComplaint = await this.complaintRepo.updateComplaintStatus(
      complaintId,
      status,
      updatedBy,
    );

    if (!updatedComplaint) {
      throw new NotFoundError('Complaint not found');
    }

    return updatedComplaint;
  }
}