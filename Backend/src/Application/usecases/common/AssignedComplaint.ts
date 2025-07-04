import ComplaintRepository from "../../../domain/Repository/ComplaintRepository";
import { NotFoundError, ValidationError } from "../../../domain/error/complaintError";

export default class AssignComplaintUseCase {
  constructor(private complaintRepo: ComplaintRepository) {}

  async execute(complaintId: string, employeeId: string) {
    if (!complaintId) {
      throw new ValidationError('Complaint ID is required');
    }

    if (!employeeId) {
      throw new ValidationError('Employee ID is required');
    }

    const updatedComplaint = await this.complaintRepo.assignComplaint(
      complaintId,
      employeeId
    );

    if (!updatedComplaint) {
      throw new NotFoundError('Complaint not found');
    }

    return updatedComplaint;
  }
}