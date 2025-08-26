import { Complaint, ComplaintFormData, Mechanic, RejectReason, WorkProof } from "../../types/complaint";
import axiosInstance from "../axiosInstance";
export type ComplaintPriority = 'low' | 'medium' | 'high';
export type ComplaintStatusType = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface ComplaintStatus {
  status: 'pending' | 'processing' | 'accept' | 'in-progress' | 'resolved' | 'cancelled' | 'completed' | 'rejected';
  updatedAt: string;
  updatedBy: string;
}

export interface StatusType {
  status: string;
  updatedAt?: Date;
  updatedBy?: string;
  isDeleted?: boolean;
}


const API_URL =  `${import.meta.env.VITE_API_BASE_URL}/common`;
;

export const findEmailForInitialCreation = async (email: string) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/initialCreate`, { email });
    
    return {
      success: response.data.success,
      exists: response.data.exists,
      customerData: response.data.data || null, 
      message: response.data.message
    };
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  } 
};

export const getComplaintsByCoordinator = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/by-coordinator`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    console.log(response.data, 'response.data')
    return response.data.complaints || []
  } catch (error) {
    console.error('Error fetching coordinator complaints:', error);
    throw error;
  }
};


 
export const fetchAvailableMechanics = async (): Promise<Mechanic[]> => {
  const response = await axiosInstance.get(`${API_URL}/available-mechanics`);
  return response.data;
};

export const validateAdminCoordinatorEmail = async (email: string): Promise<any> => {
  const response = await axiosInstance.post(`${API_URL}/validate-email`, { email }, {withCredentials : true});
  return response.data;
};


export const createComplaint = async (complaintData: ComplaintFormData) => {
  console.log(complaintData, 'complaintData in createComplaint')
  const response = await axiosInstance.post(`${API_URL}/createComplaint`, complaintData);
  return response.data.data;
};

 export const getAllComplaint = async () => {
  const response = await axiosInstance.get(`${API_URL}/getAllComplaint`);
  return response.data.complaints;
};

export const fetchCustomerEmails = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/customer-emails`);
    return response.data.customers || [];
  } catch (error) {
    console.error("Failed to fetch customer emails:", error);
    return [];
  }
};

export const fetchCoordinatorEmails = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/coordinator-emails`);
    return response.data.coordinators || [];
  } catch (error) {
    console.error("Failed to fetch coordinator emails:", error);
    return [];
  }
};



export const getMechanicComplaints = async (mechanicId: string | undefined): Promise<Complaint[]> => {
  try {
    const response = await axiosInstance.get(`${API_URL}/getMechanicComplaint/${mechanicId}`);
    return response.data.map((complaint: any) => ({
      ...complaint,
      contactNumber: complaint.contactNumber || '', 
    }));
  } catch (error) {
    console.error('Error fetching mechanic complaints:', error);
    throw error;
  }
};
// Accept a complaint assignment
export const acceptComplaint = async (complaintId: string, mechanicId: string): Promise<Complaint> => {
  console.log(complaintId, "12312")
  const response = await axiosInstance.post(`${API_URL}/acceptComplaint/${complaintId}`, { mechanicId });
  return {
    ...response.data,
    workingStatus: response.data.workingStatus === 'accept' ? 'accepted' : 
                  response.data.workingStatus === 'reject' ? 'rejected' :
                  response.data.workingStatus
  };
};


export const rejectComplaint = async (
  complaintId: string, 
  mechanicId: string, 
  reason: string
): Promise<RejectReason> => {
  const response = await axiosInstance.post(`${API_URL}/rejectComplaint/${complaintId}`, { 
    mechanicId, 
    reason 
  });
  
  const complaint = response.data.complaint ? {
    ...response.data.complaint,
    workingStatus: 'rejected' as const
  } : undefined;
  
  return response.data;
};


interface CompleteTaskParams {
  taskId: string;
  mechanicId: string;
  description: string;
  paymentStatus: string;
  paymentMethod?: string | null;
  amount: number;
  photos: File[];
}

export const completeTask = async (
  taskId: string,
  mechanicId: string,
  description: string,
  paymentStatus : string,
  paymentMethod : string,
  amount : number,
  photos: File[]
) => {
  try {
    const formData = new FormData();
    formData.append('taskId', taskId);
    formData.append('mechanicId', mechanicId);
    formData.append('description', description);
    formData.append('paymentStatus', paymentStatus);
    formData.append('amount', amount.toString());

    if (paymentMethod) {
      formData.append('paymentMethod', paymentMethod);
    }

    photos.forEach(photo => {
      formData.append('photos', photo);
    });
    const response = await axiosInstance.post(`${API_URL}/completeTask`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error completing task:', error);
    throw error;
  }
};

export const updateComplaintStatus = async (
  complaintId: string,
  newStatus: 'processing' | 'rejected' | 'completed',
  mechanicId: string,
) => {
  try {
    console.log(complaintId, newStatus, mechanicId, 'updateComplaintStatus')
    const response = await axiosInstance.put(`${API_URL}/updateComplaint/${complaintId}`, {
      status: newStatus,
      mechanicId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Upload work proof (images and notes)
export const uploadWorkProof = async (
  complaintId: string, 
  mechanicId: string, 
  images: File[], 
  notes: string
): Promise<WorkProof> => {
  try {
    const formData = new FormData();
    formData.append('complaintId', complaintId);
    formData.append('mechanicId', mechanicId);
    formData.append('notes', notes);
    
    images.forEach((image, index) => {
      formData.append(`image${index}`, image);
    });
    const response = await axiosInstance.post(`${API_URL}/complaints/work-proof`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error uploading work proof:', error);
    throw error;
  }
};

export const getWorkProof = async (complaintId: string): Promise<WorkProof> => {
  try {
    const response = await axiosInstance.get(`${API_URL}/complaints/${complaintId}/work-proof`);
    return response.data;
  } catch (error) {
    console.error('Error fetching work proof:', error);
    throw error;
  }
};


export const deleteComplaint = async (complaintId: string): Promise<any> => {
  try {
    const response = await axiosInstance.put(`${API_URL}/deleteComplaint/${complaintId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting complaint:', error);
    throw error;
  }
}


export const updateComplaint = async (
  complaintId: string,
  complaintData: ComplaintFormData
): Promise<any> => {
  try {
    const response = await axiosInstance.put(`${API_URL}/updateComplaint/${complaintId}`, complaintData);
    return response.data;
  } catch (error) {
    console.error('Error updating complaint:', error);
    throw error;
  }
};