import ComplaintRepository from "../../../domain/Repository/ComplaintRepository";

export default class GetAllComplaintsUseCase {
  constructor(private complaintRepo: ComplaintRepository) {}

  async execute() {
    return this.complaintRepo.getAllComplaints();
  }
}