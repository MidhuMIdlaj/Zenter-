import ComplaintRepository from "../../../domain/Repository/ComplaintRepository";
import { NotFoundError } from "../../../domain/error/complaintError";

export default class GetComplaintByIdUseCase {
  constructor(private complaintRepo: ComplaintRepository) {}

  async execute(complaintId: string) {
    const complaint = await this.complaintRepo.getComplaintById(complaintId);
    
    if (!complaint) {
      throw new NotFoundError('Complaint not found');
    }
    
    return complaint;
  }
}