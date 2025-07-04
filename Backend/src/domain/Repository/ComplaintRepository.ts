import Complaint from "../entities/Complaint";

export default interface ComplaintRepository {
  createComplaint(
    customerName: string,
    customerEmail: string,
    customerPhone: string,
    description: string,
    assignedMechanicId: string,
    createdBy: string,
    priority: 'low' | 'medium' | 'high',
    notes?: string,
    productName?: string,
    address?: string,
    guaranteeDate?: Date,
    warrantyDate?: Date,
  ): Promise<Complaint>;

  getAllComplaints(): Promise<Complaint[]>;
  getComplaintById(complaintId: string): Promise<Complaint | null>;
  updateComplaintStatus(complaintId: string, status: string, updatedBy: string): Promise<Complaint | null>;
  completeTask(taskId: string, mechanicId: string, description: string, photoPaths: string[]): Promise<Complaint | null>;
  assignComplaint(complaintId: string, mechanicId: string): Promise<Complaint | null>;
  searchComplaints(query: string): Promise<Complaint[]>;
}