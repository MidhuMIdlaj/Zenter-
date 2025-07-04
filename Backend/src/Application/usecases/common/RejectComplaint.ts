import { ComplaintModel } from "../../../infrastructure/db/ComplaintModel";
import { AdminModel } from "../../../infrastructure/db/models/Admin/AdminModel";
import Employee from "../../../infrastructure/db/models/EmployeeModel";
import { sendComplaintReassignmentEmail, sendUniversalSMS } from "../../../utils/nodemailer";
import agenda from "../../../utils/scheduler";

// Modified findBestMechanic to exclude specific mechanic
export const findBestMechanicExcluding = async (
  productType: string, 
  priority: string, 
  excludeMechanicId: string,
  complaintId?: string
) => {
  try {
    const normalizedType = productType.toLowerCase().trim();
    const normalizedPriority = priority.toLowerCase();
    
    const priorityMap: { [key: string]: number } = {
      'low': 1,
      'medium': 2,
      'high': 3,
      'urgent': 4
    };

    // Find exact field match mechanics who are available and not the excluded one
    const exactAvailableMechanics = await Employee.find({
      _id: { $ne: excludeMechanicId },
      position: 'mechanic',
      isDeleted: false,
      status: 'active',
      workingStatus: 'Available',
      fieldOfMechanic: { $regex: new RegExp(`^${normalizedType}$`, 'i') }
    }).sort({ experience: -1 });

    if (exactAvailableMechanics.length > 0) {
      return exactAvailableMechanics[0];
    }

    // Find busy field mechanics (excluding the rejecting one)
    const busyFieldMechanics = await Employee.find({
      _id: { $ne: excludeMechanicId },
      position: 'mechanic',
      isDeleted: false,
      status: 'active',
      fieldOfMechanic: { $regex: new RegExp(`^${normalizedType}$`, 'i') }
    });

    const prioritizedBusyMechanic = await Promise.all(
      busyFieldMechanics.map(async (mechanic) => {
        const activeComplaints = await ComplaintModel.find({
          'assignedMechanics.mechanicId': mechanic._id,
          'assignedMechanics.status': { $in: ['pending', 'in-progress'] },
          workingStatus: { $ne: 'resolved' }
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
      return prioritizedBusyMechanic[0].mechanic;
    }

    const generalAvailable = await Employee.findOne({
      _id: { $ne: excludeMechanicId },
      position: 'mechanic',
      isDeleted: false,
      status: 'active',
      workingStatus: 'Available'
    }).sort({ experience: -1 });

    return generalAvailable;

  } catch (error) {
    console.error('Mechanic assignment error:', error);
    return null;
  }
};

export const rejectComplaint = async (
  id: string,
  mechanicId: string,
  reason: string
) => {
  try {
    const complaint = await ComplaintModel.findById(id).lean();
    if (!complaint) {
      throw new Error('Complaint not found');
    }
    
    const mechanicAssignment = complaint.assignedMechanics.find(
      m => m.mechanicId.toString() === mechanicId
    );
    
    if (!mechanicAssignment) {
      throw new Error(`Mechanic ${mechanicId} not assigned to this complaint`);
    }

    if (mechanicAssignment.status !== 'pending') {
      return {
        success: false,
        message: `Complaint already ${mechanicAssignment.status} by this mechanic`,
        currentStatus: mechanicAssignment.status,
        complaint: complaint
      };
    }

    // Update complaint with rejection status
    const updatedComplaintWithRejection = await ComplaintModel.findOneAndUpdate(
      { 
        _id: id,
        "assignedMechanics.mechanicId": mechanicId,
        "assignedMechanics.status": "pending"
      },
      {
        $set: {
          "assignedMechanics.$.status": "rejected",
          "assignedMechanics.$.reason": reason,
          "assignedMechanics.$.rejectedAt": new Date(),
          workingStatus: "rejected",
          "status.status": "rejected",
          "status.updatedAt": new Date(),
          "status.updatedBy": mechanicId,
          rejectedAt: new Date()
        }
      },
      { new: true }
    );

    if (!updatedComplaintWithRejection) {
      throw new Error('Failed to update complaint status');
    }

    // Free up the old mechanic
    const oldMechanic = await Employee.findById(mechanicId).lean().exec();
    if (!oldMechanic) {
      throw new Error('Mechanic not found');
    }
    await Employee.findByIdAndUpdate(
      mechanicId,
      { $set: { workingStatus: "Available" } }
    );
     
    const newMechanic = await findBestMechanicExcluding(
      complaint.productName || '', 
      complaint.priority || 'medium',
      mechanicId,
      complaint._id.toString()
    );

    // Get assigned by email
    let assignedByEmail = '';
    const assignedAdmin = await AdminModel.findById(complaint.createdBy).lean().exec();
    const assignedCoordinator = await Employee.findById(complaint.createdBy).lean().exec();
    assignedByEmail = assignedAdmin?.email || assignedCoordinator?.emailId || '';

    if (newMechanic && newMechanic._id.toString() !== mechanicId) {
      const newAssignment = {
        mechanicId: newMechanic._id,
        assignedAt: new Date(),
        status: 'pending',
        assignedBy: complaint.createdBy
      };

      const updatedComplaint = await ComplaintModel.findByIdAndUpdate(
        id,
        {
          $push: { assignedMechanics: newAssignment },
          $set: {
            workingStatus: "pending",
            "status.status": "pending",
            "status.updatedAt": new Date(),
            "status.updatedBy": complaint.createdBy
          }
        },
        { new: true }
      );

      await sendComplaintReassignmentEmail(
        assignedByEmail, 
        {
          complaintId: complaint._id.toString(),
          productName: complaint.productName || '',
          complaintDetails: complaint.description || '',
          oldMechanic: {
            id: oldMechanic._id.toString(),
            name: oldMechanic.employeeName || 'Unknown Mechanic'
          },
          newMechanic: {
            id: newMechanic._id.toString(),
            name: newMechanic.employeeName || 'Unknown Mechanic'
          },
          rejectionReason: reason, 
          coordinatorName: assignedByEmail 
        }
      );

      return {
        success: true,
        message: 'Complaint rejected and reassigned successfully',
        complaint: updatedComplaint
      };
    } else {
      await agenda.schedule("in 24 hour", "reassignComplaint", {
        complaintId: id,
        excludeMechanicId: mechanicId,
      });
      
      await sendComplaintReassignmentEmail(
        assignedByEmail, 
        {
          complaintId: complaint._id.toString(),
          productName: complaint.productName || '',
          complaintDetails: complaint.description || '',
          oldMechanic: {
            id: oldMechanic._id.toString(),
            name: oldMechanic.employeeName || 'Unknown Mechanic'
          },
          newMechanic: {
            id: '',
            name: 'Will be reassigned after 1 hour'
          },
          rejectionReason: reason, 
          coordinatorName: assignedByEmail 
        }
      );

      return {
        success: true,
        message: 'Complaint rejected. Reassignment scheduled in 1 hour.',
        complaint: updatedComplaintWithRejection
      };
    }
  } catch (error: any) {
    console.error('Rejection error:', {
      complaintId: id,
      mechanicId,
      error: error.message,
      stack: error.stack
    });
    throw {
      success: false,
      message: error.message,
      errorDetails: error
    };
  }
};