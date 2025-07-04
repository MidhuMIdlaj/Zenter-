import ComplaintRepository from "../../../domain/Repository/ComplaintRepository";
import { NotFoundError, ValidationError } from "../../../domain/error/complaintError";

export default class UpdateComplaintStatusUseCase {
  constructor(private complaintRepo: ComplaintRepository) {}
  async execute(
    complaintId: string, 
    status: 'submitted' | 'in_progress' | 'resolved' | 'rejected',
    updatedBy: string,
  ) {
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