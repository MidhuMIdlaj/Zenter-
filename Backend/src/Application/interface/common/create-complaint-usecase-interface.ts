import { IComplaintRepoReturn } from "../../../domain/dtos/complaint-usecase/create-complaint-usecase-interface";

export interface ICreateComplaintUseCase {
  execute(data: {
    customerName?: string;
    customerEmail?: string;
    contactNumber?: string;
    description: string;
    selectedProductId?: string;
    assignedMechanicId?: string;
    createdBy: string;
    priority?: 'low' | 'medium' | 'high';
    notes?: string;
    address?: string;
  }): Promise<{ success: boolean; data?: IComplaintRepoReturn; error?: string }>;
}
