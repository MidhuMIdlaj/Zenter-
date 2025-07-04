// src/controllers/videoCall/VideoCallController.ts
import { Request, Response, NextFunction } from 'express';
import { SendVideoCallInvitationsUseCase } from '../../../Application/usecases/VIDEOcALL/SendVideoCallInvitationsUseCase';
import EmployeeRepoImpl from '../../../infrastructure/repositories/EmployeeRepoImpl';
import { ServerError, ValidationError } from '../../../domain/error/employeeErrors';
import { ioInstance } from '../../../app';

export class VideoCallController {
  private sendInvitationsUseCase: SendVideoCallInvitationsUseCase;
  private employeeRepo: EmployeeRepoImpl;

  constructor() {
    this.employeeRepo = new EmployeeRepoImpl();
    this.sendInvitationsUseCase = new SendVideoCallInvitationsUseCase(this.employeeRepo);
  }

  sendInvitations = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { callLink } = req.body;
      const initiatorId = req.user?.userId;

      if (!callLink) {
        throw new ValidationError("Call link is required");
      }

      if (!initiatorId) {
        throw new ValidationError("Initiator ID is required");
      }

      // Get all active mechanics and coordinators
      const mechanics = await this.employeeRepo.findAllMechanics();
      const coordinators = await this.employeeRepo.findAllCoordinators();
      
      // Filter active employees
      const activeEmployees = [...mechanics, ...coordinators].filter(
        emp => emp.status === 'active' && !emp.isDeleted
      );

      const result = await this.sendInvitationsUseCase.execute(
        initiatorId, 
        callLink,
      );

      // Send real-time notifications
      if (ioInstance) {
        activeEmployees.forEach(recipient => {
          ioInstance!.to(`user_${recipient.id}`).emit('new_video_call', {
            callLink,
            initiatorId,
            timestamp: new Date().toISOString()
          });
        });
      }

      res.status(200).json({
        success: true,
        message: "Video call invitations sent successfully",
        data: result
      });
    } catch (error) {
      next(error);
    }
  };
}