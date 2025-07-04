import { NextFunction, Request, Response } from 'express';
import ComplaintRepoImpl from '../../../infrastructure/repositories/ComplaintRepoImpl';
import UserRepoImpl from '../../../infrastructure/repositories/UserRepoImpl';
import EmployeeRepoImpl from '../../../infrastructure/repositories/EmployeeRepoImpl';
import { GetAvailableMechanics } from '../../../Application/usecases/common/getAvailableMechanic';
import { AdminRepoImpl } from '../../../infrastructure/repositories/AdminRepImpl';
import { ValidateAdminCoordinator } from '../../../Application/usecases/common/validateAdminOrCoordinator';
import GetAllComplaintsUseCase from '../../../Application/usecases/common/GetAllComplaint';
import { CreateComplaintUseCase, getCoordinatorEmails, getCustomerEmails } from '../../../Application/usecases/common/CreateComplaint';
import { getMechanicComplaint } from '../../../Application/usecases/common/getMechanicComplaint';
import { acceptComplaint } from '../../../Application/usecases/common/acceptComplaint';
import { ChangeStatus } from '../../../Application/usecases/common/changeStatus';
import { DeleteComplaint } from '../../../Application/usecases/common/DeleteComplaint';
import { rejectComplaint } from '../../../Application/usecases/common/RejectComplaint';
import Employee from '../../../infrastructure/db/models/EmployeeModel';
import { StatusCode } from '../../../shared/enums/statusCode';
import { uploadFileToS3 } from '../../../utils/s3-credential';


export default class ComplaintController {
  private complaintRepo = new ComplaintRepoImpl();
  private customerRepo = new UserRepoImpl();
  private employeeRepo = new EmployeeRepoImpl();
  private getAvailableMechanicsUseCase = new GetAvailableMechanics(this.employeeRepo);
  private adminRepo = new AdminRepoImpl();
  private GetAllComplaintsUseCase = new GetAllComplaintsUseCase(this.complaintRepo)
  private coordinatorRepo = new EmployeeRepoImpl();
  private validateAdminCoordinator = new ValidateAdminCoordinator(
    this.adminRepo,
    this.coordinatorRepo
  );
  createClientComplaint = async (req: Request, res: Response) => {
    console.log('📥 New complaint request:', req.body);
    try {
      const result = await CreateComplaintUseCase(req.body);
      if (result.success) {
        res.status(201).json(result.data);
      } else {
        res.status(400).json({ error: result.error });
      }
    } catch (error) {
      console.error('🚑 Server error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  findCustomerByEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = req.body;
      if (!email) {
        res.status(400).json({
          success: false,
          message: "Email is required"
        });
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({
          success: false,
          message: "Invalid email format"
        });
        return;
      }

      const customer = await this.customerRepo.findByEmail(email);
      if (!customer) {
        res.status(200).json({
          success: true,
          exists: false,
          message: "Customer not found",
          data: null
        });
        return;
      }
      
      const responseData = {
        productName: customer.products?.[0]?.productName || null, // Access first product's name
        model: customer.products?.[0]?.model || null,             // Access first product's model
        status: customer.status,
        warrantyDate: customer.products?.[0]?.warrantyDate || null,
        guaranteeDate: customer.products?.[0]?.guaranteeDate || null,
        id: customer.id,
        name: customer.clientName,
        email: customer.email,
        address: customer.address,
        products: customer.products || []
      };

      res.status(200).json({
        success: true,
        exists: true,
        message: "Customer found",
        data: responseData
      });
    } catch (err) {
      next(err);
    }
  };

  getAvailableMechanicsHandler = async (req: Request, res: Response) => {
    try {
      const mechanics = await this.getAvailableMechanicsUseCase.execute();
      const mechanicsDto = mechanics.map(mech => ({
        mechanicId: mech.id,
        name: mech.employeeName,
        specialization: mech.experience ? `${mech.experience} years experience` : 'Mechanic',
        contactNumber: mech.contactNumber,
        email: mech.emailId,
        workingStatus : mech.workingStatus
      }));

      res.status(200).json(mechanicsDto);
    } catch (error: any) {
      console.error("Error fetching available mechanics:", error);
      res.status(500).json({ 
        success: false,
        message: "Error fetching available mechanics",
        error: error.message 
      });
    }
  }

  validateAdminCoordinatorEmail = async (req: Request, res: Response) => {
    try {

     const { email } = req.body;
      
      if (!email) {
         res.status(400).json({
          success: false,
          message: "Email is required"
        })
        return
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
         res.status(400).json({
          success: false,
          message: "Invalid email format"
        })
        return
      }

      const result = await this.validateAdminCoordinator.execute(email);
      if (!result.isValid) {
         res.status(200).json({
          success: true,
          isValid: false,
          message: "Email does not belong to an admin or coordinator",
          user: null,
        })
         return
      }
      
       res.status(200).json({
        success: true,
        isValid: true,
        userType: result.userType,
        message: `Valid ${result.userType} email`,
        user: result.user,
        id : result.id
      })
      return
      
    } catch (err: any) {
       res.status(500).json({
        success: false,
        message: err.message
      })
      return
    }
  };

  getAllComplaints = async (req: Request, res : Response)=>{
    try {
      const complaints = await this.GetAllComplaintsUseCase.execute()
      console.log(complaints, "getAllComplaints")
      res.status(200).json({ success: true, complaints });
    } catch (error) {
      console.log("error from get Complaint :", error)
    }
  }

  getMechanicComplaint = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const complaints = await getMechanicComplaint(id);
      res.status(200).json(complaints);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch complaints" });
    }
  }

  
 acceptComplaint = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; 
    const { mechanicId } = req.body;
    
    if (!mechanicId) {
      res.status(400).json({ error: 'Mechanic ID is required' })
      return
    }
    const mechanic = await Employee.findById(mechanicId);
    if (!mechanic) {
      res.status(404).json({ error: 'Mechanic not found' });
      return;
    }

    if (mechanic.workingStatus !== 'Available') {
      res.status(400).json({ 
        error: 'Cannot accept new tasks. Mechanic is currently occupied with another task.',
        mechanicStatus: mechanic.workingStatus 
      });
      return;
    }

    const result = await acceptComplaint(id, mechanicId);
    
    if (!result.success) {
      res.status(400).json({ error: result.message });
      return;
    }

    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error in acceptComplaint:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to accept complaint' 
    });
  }
}

   getCustomerEmails = async (_req: Request, res: Response) => {
    try {
      const customers = await getCustomerEmails();
      res.status(200).json({ 
        success: true,
        customers 
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        success: false,
        error: "Failed to fetch customer emails" 
      });
    }
  }

  getComplaintsByCoordinator  = async(req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(400).json({ error: 'User ID is required' });
        return;
      }
      const complaints = await this.complaintRepo.getComplaintsByMechanicId(userId);
      if (!complaints || complaints.length === 0) {
        res.status(404).json({ error: 'No complaints found for this coordinator' });
        return;
      }
      res.status(200).json({
        success: true,
        complaints
      });
    } catch (error) {
      console.error('Error fetching complaints by coordinator:', error);
      res.status(500).json({ 
        error: 'Failed to fetch complaints by coordinator' 
      });
    }
  }

  getCoordinatorEmails = async (_req: Request, res: Response) => {
    try {
      const coordinators = await getCoordinatorEmails();
      res.status(200).json({ 
        success: true,
        coordinators 
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        success: false,
        error: "Failed to fetch coordinator emails" 
      });
    }
  }

  rejectComplaint = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { mechanicId, reason } = req.body;
      if (!mechanicId) {
         res.status(400).json({ error: 'Mechanic ID is required' })
        return
      }
      
      if (!reason || reason.trim() === '') {
         res.status(400).json({ error: 'Rejection reason is required' })
         return
      }
  
      const updatedComplaint = await rejectComplaint(id, mechanicId, reason);
      res.status(StatusCode.OK).json(updatedComplaint);
    } catch (error: any) {
      console.error('Error in rejectComplaint:', error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        error: error.message || 'Failed to reject complaint'
      });
    }
  }

  ChangeStatus = async (req: Request, res: Response) => {
    try {
      const { id } = req.params; 
      const { newStatus, updatedBy } = req.body;
      if (!newStatus) {
         res.status(StatusCode.BAD_REQUEST).json({ error: 'Status is required in payload' })
         return
      }
      const result = await ChangeStatus(id, newStatus, updatedBy);
      if (result.matchedCount === 0) {
         res.status(StatusCode.NOT_FOUND).json({ error: 'Complaint not found or not assigned to this mechanic' })
         return
      }
      res.status(StatusCode.OK).json({
        success: true,
        message: 'Status updated successfully',
        data: result
      });
      
    } catch (error: any) {
      console.error('Error in ChangeStatus:', error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ 
        error: error.message || 'Failed to update complaint status' 
      });
    }
}

   DeleteComplaint = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await DeleteComplaint(id);
      if (result.matchedCount === 0) {
          res.status(StatusCode.NOT_FOUND).json({ error: 'Complaint not found' });
          return;
      }
      res.status(StatusCode.OK).json({
          success: true,
          message: 'Complaint deleted successfully',
          data: result
      });
      
  } catch (error: any) {
      console.error('Error in deleteComplaint:', error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ 
          error: error.message || 'Failed to delete complaint' 
      });
  }
  }

  updateComplaint = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const {status , mechanicId} = req.body;
      if (!id) {
      console.log(id, status, mechanicId, "updateComplaint")
        res.status(StatusCode.BAD_REQUEST).json({ error: 'Complaint ID is required' });
        return;
      }
      const updatedComplaint = await this.complaintRepo.updateComplaintStatus(id, status, mechanicId);
      if (!updatedComplaint) {
        res.status(StatusCode.NOT_FOUND).json({ error: 'Complaint not found' });
        return;
      }
      res.status(StatusCode.OK).json({
        success: true,
        message: 'Complaint updated successfully',
        data: updatedComplaint
      });       
       
    } catch (error) {
      console.error('Error in updateComplaint:', error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ 
        error: (error instanceof Error ? error.message : 'Failed to update complaint')
      });
    }
  }

completeTask = async (req: Request, res: Response) => {
  try {
    const { taskId, mechanicId, description } = req.body;
    const files = req.files as Express.Multer.File[];
    console.log("📸 Files received for task completion:", files);
    if (!taskId || !mechanicId || !description) {
       res.status(StatusCode.BAD_REQUEST).json({ 
        error: 'Task ID, mechanic ID, and description are required' 
      });
      return
    }

    let photoUrls: string[] = [];

    for (const file of files || []) {
      const url = await uploadFileToS3(file);
      photoUrls.push(url);
    }

    console.log("✅ Uploaded photo URLs:", photoUrls);

    const completedTask = await this.complaintRepo.completeTask(
      taskId,
      mechanicId,
      description,
      photoUrls  
    );

    if (!completedTask) {
       res.status(StatusCode.NOT_FOUND).json({ error: 'Task not found' });
       return
    }

    res.status(StatusCode.OK).json({
      success: true,
      message: 'Task completed successfully',
      data: completedTask
    });

  } catch (error) {
    console.error('Error in completeTask:', error);
    res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ 
      error: (error instanceof Error ? error.message : 'Failed to complete task')
    });
  }
 };
}