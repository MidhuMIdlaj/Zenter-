import { ServerError } from "../../../domain/error/employeeErrors";
import IEmployeeRepository from "../../../domain/Repository/i-employee-repository";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types";
import { INotificationRepository } from "../../../domain/Repository/i-notification-repository";
import { IEmailService } from "../../../domain/Repository/i-email-repository";
import { IAdminRepository } from "../../../domain/Repository/i-admin-repository";
import { ISendVideoCallInvitationsUseCase } from "../../interface/videocall/send-videocall-invitasion-usecase-interface";


@injectable()
export class SendVideoCallInvitationsUseCase implements ISendVideoCallInvitationsUseCase {
  constructor(
    @inject(TYPES.IEmployeeRepository)  private employeeRepo: IEmployeeRepository,
    @inject(TYPES.IAdminRepository) private adminRepo : IAdminRepository,
    @inject(TYPES.INotificationRepository) private notificationRepo : INotificationRepository,
    @inject(TYPES.IEmailService) private emailService : IEmailService
  ) {}

  async execute(initiatorId: string, employeeCallLink: string): Promise<{ success: boolean }> {
    try {
      const initiator = await this.adminRepo.findById(initiatorId);
      if (!initiator) {
        throw new ServerError("Initiator not found");
      }
      const mechanics = await this.employeeRepo.findAllMechanics();
      const coordinators = await this.employeeRepo.findAllCoordinators();
      const activeEmployees = [...mechanics, ...coordinators].filter(
        emp => emp.status === 'active' && !emp.isDeleted
      );
      await Promise.all(
       activeEmployees.map(emp => 
         this.notificationRepo.createVideoCallNotification(
           [emp.id],
           initiatorId,
           employeeCallLink,
           initiator.email,
           emp.position
         )
       )
     );

      await Promise.all(
        activeEmployees.map(emp => 
          this.emailService.sendVideoCallInvitation(
            emp.emailId,
            emp.employeeName,
            initiator.email,
            employeeCallLink
          )
        )
      );
      return { success: true };
    } catch (error) {
      console.error("Error in SendVideoCallInvitationsUseCase:", error);
      throw error instanceof ServerError ? error : 
        new ServerError("Failed to send invitations");
    }
  }
}