import { ComplaintModel } from '../../../infrastructure/db/ComplaintModel';
import { Document } from 'mongoose';
import EmployeeModel  from  '../../../infrastructure/db/models/EmployeeModel'
import NotificationModel  from  '../../../infrastructure/db/models/Noification'
import ClientModel from '../../../infrastructure/db/models/Admin/ClientModel';
import { AdminModel } from '../../../infrastructure/db/models/Admin/AdminModel';
import { getSocketInstance } from '../../../app';
import { NotificationService } from '../../../service/NotificationService';

const priorityMap: Record<string, number> = {
  high: 3,
  medium: 2,
  low: 1
};

export const findBestMechanic = async (productType: string, priority: string , complaintId? : string) => {
  try {
    const normalizedType = productType.toLowerCase().trim();

    const exactAvailableMechanics = await EmployeeModel.find({
      position: 'mechanic',
      isDeleted: false,
      status: 'active',
      workingStatus: 'Available',
      fieldOfMechanic: { $regex: new RegExp(`^${normalizedType}$`, 'i') }
    }).sort({ experience: -1 });

    if (exactAvailableMechanics.length > 0) {
      return exactAvailableMechanics[0];
    }

    const busyFieldMechanics = await EmployeeModel.find({
      position: 'mechanic',
      isDeleted: false,
      status: 'active',
      fieldOfMechanic: { $regex: new RegExp(`^${normalizedType}$`, 'i') }
    });

    const prioritizedBusyMechanic = await Promise.all(
      busyFieldMechanics.map(async (mechanic) => {
        const activeComplaints = await ComplaintModel.find({
          assignedMechanic: mechanic._id,
          status: { $ne: 'Resolved' } 
        });

        const totalPriority = activeComplaints.reduce((sum, comp) => {
          const prio = comp.priority?.toLowerCase?.() || 'low';
          return sum + (priorityMap[prio] || 1);
        }, 0);
        return { mechanic, totalPriority };
      })
    );

    prioritizedBusyMechanic.sort(
      (a, b) => 
        a.totalPriority - b.totalPriority ||
        ((b.mechanic.experience ?? 0) - (a.mechanic.experience ?? 0))
    );

    if (prioritizedBusyMechanic.length > 0) {
      console.log('Returning least-burdened busy mechanic:', prioritizedBusyMechanic[0].mechanic._id);
      return prioritizedBusyMechanic[0].mechanic;
    }
    const generalAvailable = await EmployeeModel.findOne({
      position: 'mechanic',
      isDeleted: false,
      status: 'active',
      workingStatus: 'Available'
    }).sort({ experience: -1 });

    if (generalAvailable) {
      console.log('Fallback: Any available mechanic:', generalAvailable._id);
      return generalAvailable;
    }

    console.log('No mechanics found matching any criteria');
    return null;

  } catch (error) {
    console.error('Mechanic assignment error:', error);
    return null;
  }
};



export const CreateComplaintUseCase = async (data: any): Promise<{ 
  success: boolean; 
  data?: Document; 
  error?: string 
  }> => {
    console.log("Creating complaint with data:", data);
  try {
    let productDetails = null;
    let clientDetails = null;
    console.log("Data received:", data.selectedProductId);
    if (data.selectedProductId) {
      clientDetails = await ClientModel.findOne({
        'products._id': data.selectedProductId,
        isDeleted: false
      });
      console.log("Client details found:", clientDetails);
      if (!clientDetails) {
        return { success: false, error: 'Client with this product not found' };
      }

      productDetails = clientDetails.products.find(
        (product: any) => product._id.toString() === data.selectedProductId
      );

      if (!productDetails) {
        return { success: false, error: 'Selected product not found' };
      }
    }

    let assignedMechanicId = null;
    let assignedMechanic = null;
    
    if (!data.assignedMechanicId && productDetails) {
      assignedMechanic = await findBestMechanic(
        productDetails.productName || '', 
        data.priority || 'medium'
      );

      if (!assignedMechanic) {
        console.log("No mechanic available for assignment");
        assignedMechanicId = null;
      } else {
        assignedMechanicId = assignedMechanic._id;
        console.log(`Mechanic ${assignedMechanicId} assigned to complaint`);
      }
    }

    const complaintData: any = {
      customerName: data.customerName || clientDetails?.clientName || 'Unknown',
      customerEmail: data.customerEmail || clientDetails?.email || '',
      customerPhone: data.contactNumber || clientDetails?.contactNumber || '',
      description: data.description,
      createdBy: data.createdBy,
      priority: data.priority || 'medium',
      notes: data.notes || '',
      status: {
        status: data.status || 'pending',
        updatedAt: new Date(),
        updatedBy: data.createdBy
      },
      assignedMechanics: assignedMechanicId ? [{
        mechanicId: assignedMechanicId,
        status: 'pending',
        assignedAt: new Date(),
        assignedBy: data.createdBy,
        reason: null
      }] : [], 
      ...(productDetails && {
        productName: productDetails.productName,
        productModel: productDetails.model,
        address: clientDetails?.address || data.address,
        guaranteeDate: productDetails.guaranteeDate ? new Date(productDetails.guaranteeDate) : undefined,
        warrantyDate: productDetails.warrantyDate ? new Date(productDetails.warrantyDate) : undefined
      })
    };


    const complaint = new ComplaintModel(complaintData);
    const savedComplaint = await complaint.save();
    
    // In CreateComplaintUseCase
     if (assignedMechanicId) {
     console.log('🔔 Starting notification process for mechanic:', assignedMechanicId);
     const notificationResult = await NotificationService.sendNewComplaintNotification(
     assignedMechanicId.toString(),
      savedComplaint.toObject(),
      data.createdBy
     );
  console.log('🔔 Notification result:', notificationResult);
}
    return { success: true, data: savedComplaint };

  } catch (error: any) {
    console.error('Error creating complaint:', error);
    return { success: false, error: error.message || 'Internal server error' };
  }
};



export const getCustomerEmails = async () => {
  const customers = await ClientModel.find(
    { isDeleted: false },
    { email: 1, name: 1, _id: 0 }
  );
  
  return customers.map(customer => ({
    email: customer.email,
    name: customer.clientName
  }));
};

export const getCoordinatorEmails = async () => {
  const coordinators = await EmployeeModel.find(
    { 
      position: "coordinator",
      isDeleted: false,        
      status: "active"         
    },
    { emailId: 1, employeeName: 1, _id: 1 }
  );
  const admins = await AdminModel.find({}, { email: 1, _id: 1 });
  const coordinatorEmails = coordinators.map(emp => ({
    id : emp._id,
    email: emp.emailId,
    name: emp.employeeName || "Coordinator"
  }));

  const adminEmails = admins.map(admin => ({
    id  : admin._id,
    email: admin.email,
    name: "Admin"
  }));
  return [...coordinatorEmails, ...adminEmails];
};
 