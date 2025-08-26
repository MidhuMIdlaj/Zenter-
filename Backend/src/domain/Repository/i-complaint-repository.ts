import { Document } from "mongoose";
import { IAcceptComplaintUsecase } from "../dtos/complaint-usecase/accept-complaint-usecase-interface";
import { IChangeStatusUsecase } from "../dtos/complaint-usecase/change-status-usecase-interface";
import { IDeleteComplaintUsecase } from "../dtos/complaint-usecase/complaint-delete-usecase-interface";
import { ICompleteTaskUsecase } from "../dtos/complaint-usecase/complete-task-usecase-interface";
import { IComplaintRepoReturn } from "../dtos/complaint-usecase/create-complaint-usecase-interface";
import { IGetComplaintMechanicUsecase } from "../dtos/complaint-usecase/get-mechanic-complaint-usecase-interface";
import Complaint from "../entities/Complaint";
import { IComplaint } from "../complaint/type";
import { ComplaintDocument } from "../../infrastructure/db/complaint.model";

export default interface IComplaintRepository {
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
  ): Promise<IComplaintRepoReturn>;
  acceptComplaint(complaintId: string, mechanicId: string): Promise<IAcceptComplaintUsecase>;
  getComplaintsByMechanic(mechanicId: string): Promise<IGetComplaintMechanicUsecase[]>;
  getAllComplaints(): Promise<IComplaintRepoReturn[]>;
  getComplaintById(complaintId: string): Promise<IComplaintRepoReturn | null>;
  updateComplaintStatus(complaintId: string, status: string, updatedBy: string): Promise<IComplaintRepoReturn | null>;
  completeTask(taskId: string, mechanicId: string, description: string, photoPaths: string[] ,  paymentStatus?: string,amount?: number, paymentMethod?: string): Promise<ICompleteTaskUsecase | null>;
  assignComplaint(complaintId: string, mechanicId: string): Promise<IComplaintRepoReturn | null>;
  searchComplaints(query: string): Promise<IComplaintRepoReturn[]>;
  getComplaintsByMechanicId(mechanicId: string): Promise<IComplaintRepoReturn[]>;
  rejectAssignment(complaintId: string, mechanicId: string, reason: string): Promise<IComplaintRepoReturn | null>;
  reassignComplaint(complaintId: string, newMechanicId: string, assignedBy: string): Promise<ComplaintDocument | null>;
   updateStatusByMechanic(
    complaintId: string,
    status: string,
    mechanicId: string
  ): Promise<IChangeStatusUsecase>;
  deleteComplaint(id: string): Promise<IDeleteComplaintUsecase>;
}