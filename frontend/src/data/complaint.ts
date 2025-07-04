export interface Mechanic {
  mechanicId: string;
  name: string;
  specialization: string;
  status: 'available' | 'busy';
}

export interface ComplaintFormData {
  complaintId?: string;
  customerEmail: string;
  contactNumber: string;
  description: string;
  assignedMechanicId: string;
  createdBy: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  createdAt?: string;
  updatedAt?: string;
  resolvedAt?: string;
  customerName?: string;
  notes?: string;
  isDeleted?: boolean;
}

export interface ComplaintResponse extends ComplaintFormData {
  complaintId: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}