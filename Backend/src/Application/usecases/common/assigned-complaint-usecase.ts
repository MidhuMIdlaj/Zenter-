import { inject, injectable } from "inversify";
import IComplaintRepository from "../../../domain/Repository/i-complaint-repository";
import { NotFoundError, ValidationError } from "../../../domain/error/complaintError";
import { TYPES } from "../../../types";

@injectable()
export default class AssignComplaintUseCase {
  constructor(
    @inject(TYPES.IComplaintRepository) private complaintRepo: IComplaintRepository
  ) {}

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