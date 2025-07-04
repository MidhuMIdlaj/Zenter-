import { ComplaintModel } from "../../../infrastructure/db/ComplaintModel";
import EmployeeModel from "../../../infrastructure/db/models/EmployeeModel";
import { sendSMS } from "../../../utils/sendSMS";

export const acceptComplaint = async (id: string, mechanicId: string) => {
  try {
    const complaint = await ComplaintModel.findById(id);
    if (!complaint) throw new Error('Complaint not found');

    const mechanicAssignment = complaint.assignedMechanics.find(
      m => m.mechanicId.toString() === mechanicId
    );
    
    if (!mechanicAssignment) {
      throw new Error('Mechanic not assigned to this complaint');
    }

    if (mechanicAssignment.status !== 'pending') {
      throw new Error(`Complaint already ${mechanicAssignment.status}`);
    }

    const updatedComplaint = await ComplaintModel.findOneAndUpdate(
      { 
        _id: id,
        "assignedMechanics.mechanicId": mechanicId,
        "assignedMechanics.status": "pending"
      },
      {
        $set: {
          "assignedMechanics.$.status": "accept",
          acceptedAt: new Date(),
          workingStatus: "processing", 
          "status.status": "processing", 
          "status.updatedAt": new Date(),
          "status.updatedBy": mechanicId
        }
      },
      { new: true }
    );

    if (!updatedComplaint) {
      throw new Error('Failed to update complaint status');
    }

    const updatedMechanic = await EmployeeModel.findByIdAndUpdate(
      mechanicId,
      { $set: { workingStatus: "Occupied" } },
      { new: true }
    );

    try {
      if (complaint.customerPhone) {
        const message = `Hello! Your complaint #${complaint._id} has been accepted by our mechanic. Work will begin shortly. We'll keep you updated on the progress. Thank you for choosing our service!`;
        
        await sendSMS(complaint.customerPhone, message);
        console.log('SMS sent successfully to customer:', complaint.customerPhone);
      } else {
        console.warn('Customer phone number not available for complaint:', id);
      }
    } catch (smsError: any) {
      // Log SMS error but don't fail the entire operation
      console.error('Failed to send SMS notification:', {
        error: smsError.message,
        customerPhone: complaint.customerPhone,
        complaintId: id
      });
    }

    return {
      success: true,
      message: 'Complaint accepted successfully',
      complaint: updatedComplaint,
      mechanic: updatedMechanic
    };

  } catch (error: any) {
    console.error('Error in acceptComplaint:', {
      error: error.message,
      complaintId: id,
      mechanicId,
      timestamp: new Date().toISOString()
    });
    return {
      success: false,
      message: error.message,
      error: error.message
    };
  }
};