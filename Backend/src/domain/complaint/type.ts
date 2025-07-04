
export type ComplaintStatus = 'pending' | 'accepted' | 'rejected' | 'in-progress' | 'resolved';
export type ComplaintPriority = 'low' | 'medium' | 'high';

export type FilterParams = {
  status?: ComplaintStatus;
  priority?: ComplaintPriority;
  employeeId?: string;  
  createdBy?: string;   
  assignedTo?: string;  
  startDate?: Date;
  endDate?: Date;
  resolvedAt?: Date | null;
  workProofExists?: boolean;
};

export interface IComplaint {
  id: string;
  title: string;
  description: string;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  assignedTo?: string;
  resolvedAt?: Date;
  workProof?: string[];
  notes?: string;
  rejectionReason?: string;
}