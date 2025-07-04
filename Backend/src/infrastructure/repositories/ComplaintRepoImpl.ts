import ComplaintRepository from '../../domain/Repository/ComplaintRepository';
import {ComplaintModel} from "../db/ComplaintModel"
import Complaint from '../../domain/entities/Complaint';
import { ServerError } from '../../domain/error/complaintError';
import EmployeeModel from '../../infrastructure/db/models/EmployeeModel'
import ServiceRequest from '../../domain/entities/Complaint';

export default class ComplaintRepoImpl implements ComplaintRepository {
  async createComplaint(
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
  ): Promise<Complaint> {
    try {
      const complaint = await ComplaintModel.create({
        customerEmail,
        customerName,
        customerPhone,
        description,
        assignedMechanicId,
        createdBy,
        priority,
        notes,
        productName,
        address,
        guaranteeDate,
        warrantyDate,
        status: {
          status: 'pending',
          updatedAt: new Date(),
          updatedBy: createdBy
        }
      });
      return this.mapToComplaint(complaint);
    } catch (error) {
      console.error('Error creating complaint:', error);
      throw new ServerError('Failed to create complaint');
    }
  }


 async getAllComplaints(): Promise<Complaint[]> {
  try {
    const complaints = await ComplaintModel.find({ isDeleted: { $ne: true } })
      .populate('assignedMechanics.mechanicId') 
      .lean() 
      .sort({ createdAt: -1 });
      console.log('Fetched complaints:', complaints);
    return complaints.map((complaint: any) => this.mapToComplaint(complaint));
  } catch (error) {
    console.error('Error fetching complaints:', error);
    throw new ServerError('Failed to fetch complaints');
  }
}
  

  async getComplaintById(complaintId: string): Promise<Complaint | null> {
    try {
      const complaint = await ComplaintModel.findById(complaintId);
      return complaint ? this.mapToComplaint(complaint) : null;
    } catch (error) {
      console.error('Error fetching complaint:', error);
      throw new ServerError('Failed to fetch complaint');
    }
  }

  async getComplaintsByMechanicId(
    coordinator: string
  ): Promise<Complaint[]> {
    try {
      const complaints = await ComplaintModel.find({
        createdBy: coordinator,
        isDeleted: { $ne: true }
      }).sort({ createdAt: -1 });
      return complaints.map((complaint: any) => this.mapToComplaint(complaint));
    } catch (error) {
      console.error('Error fetching complaints by mechanic ID:', error);
      throw new ServerError('Failed to fetch complaints by mechanic ID');
    }
  }

  async updateComplaintStatus(
  complaintId: string,
  status: string,
  updatedBy: string
): Promise<Complaint | null> {
  try {
    await ComplaintModel.updateOne(
      {
        _id: complaintId,
        'assignedMechanics.mechanicId': updatedBy
      },
      {
        $set: {
          'assignedMechanics.$.status': status,
          'workingStatus': status,
          'status.status': status,
          'status.updatedAt': new Date(),
          'status.updatedBy': updatedBy,
          updatedAt: new Date()
        }
      }
    );

    const complaint = await ComplaintModel.findById(complaintId);

    await EmployeeModel.updateOne({
      _id: updatedBy,
    }, {
      $set: {
        workingStatus:'Available'
      }
    });
    
    return complaint ? this.mapToComplaint(complaint) : null;
  } catch (error) {
    console.error('Error updating complaint status:', error);
    throw new ServerError('Failed to update complaint status');
  }
}


 async completeTask(
    taskId: string,
    mechanicId: string,
    description: string,
    photoNames: string[]
  ): Promise<Complaint | null> {
    try {
      const updatedComplaint = await ComplaintModel.findOneAndUpdate(
        {
          _id: taskId,
          'assignedMechanics.mechanicId': mechanicId
        },
        {
          $set: {
            'assignedMechanics.$.status': 'completed',
            'workingStatus': 'completed',
            'status.status': 'completed',
            'status.updatedAt': new Date(),
            'status.updatedBy': mechanicId,
            'completionDetails.description': description,
            'completionDetails.photos': photoNames,
            'completionDetails.completedAt': new Date(),
            'completionDetails.completedBy': mechanicId,
            'updatedAt': new Date()

          }
        },
        { new: true }
      );

      if (!updatedComplaint) {
        throw new ServerError('Task not found or mechanic not assigned to this task');
      }

      await EmployeeModel.updateOne(
        { _id: mechanicId },
        { $set: { workingStatus: 'Available' } }
      );

      return this.mapToComplaint(updatedComplaint);
    } catch (error) {
      console.error('Error completing task:', error);
      throw new ServerError('Failed to complete task');
    }
  }


  async assignComplaint(
    complaintId: string,
    mechanicId: string
  ): Promise<Complaint | null> {
    try {
      const complaint = await ComplaintModel.findByIdAndUpdate(
        complaintId,
        {
          assignedMechanicId: mechanicId,
          updatedAt: new Date()
        },
        { new: true }
      );
      return complaint ? this.mapToComplaint(complaint) : null;
    } catch (error) {
      console.error('Error assigning complaint:', error);
      throw new ServerError('Failed to assign complaint');
    }
  }

  async searchComplaints(query: string): Promise<Complaint[]> {
    try {
      const complaints = await ComplaintModel.find({
        $or: [
          { customerName: { $regex: query, $options: 'i' } },
          { customerEmail: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } }
        ]
      }).sort({ createdAt: -1 });
      return complaints.map((complaint: any) => this.mapToComplaint(complaint));
    } catch (error) {
      console.error('Error searching complaints:', error);
      throw new ServerError('Failed to search complaints');
    }
  }

  private mapToComplaint(doc: any): ServiceRequest {
  return new ServiceRequest(
    doc._id.toString(),
    doc.complaintNumber,
    doc.customerEmail,
    doc.customerPhone, 
    doc.description,
    doc.assignedMechanics 
      ? doc.assignedMechanics.map((assignment: any) => ({
          mechanicId: assignment.mechanicId?._id || assignment.mechanicId,
          status: assignment.status,
          reason: assignment.reason || null
        }))
      : [], 
    doc.createdBy,
    doc.status?.status || 'active',
    doc.priority || 'medium',
    doc.customerName,
    doc.notes || '',
    doc.productName || '',
    doc.address || '',
    doc.productModel || '',
    doc.guaranteeDate,
    doc.warrantyDate,
    doc.CreatedByRole || 'customer',
    doc.createdAt || new Date(),
    doc.updatedAt || new Date(),
    doc.workingStatus || 'pending',
    doc.rejectionReason,
    doc.isDeleted === 'true' ? true : false,
    doc.completionDetails 
      ? {
          description: doc.completionDetails.description || '',
          photos: doc.completionDetails.photos || [],
          completedAt: doc.completionDetails.completedAt,
          completedBy: doc.completionDetails.completedBy || ''
        }
      : undefined
  );
}
}