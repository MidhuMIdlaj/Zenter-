import { ServerError } from "../../../domain/error/employeeErrors";
import EmployeeRepository from "../../../domain/Repository/EmployeeRepository";
import { sendVideoCallInvitation } from "../../../service/emailService";
import { NotificationService } from "../../../service/NotificationService";

export class SendVideoCallInvitationsUseCase {
  constructor(private employeeRepo: EmployeeRepository) {}

  async execute(initiatorId: string, employeeCallLink: string): Promise<{ success: boolean }> {
    try {
      // 1. Get initiator details
      const initiator = await this.employeeRepo.findById(initiatorId);
      if (!initiator) {
        throw new ServerError("Initiator not found");
      }
      // 2. Get all active mechanics and coordinators
      const mechanics = await this.employeeRepo.findAllMechanics();
      const coordinators = await this.employeeRepo.findAllCoordinators();
      // 3. Filter active employees
      const activeEmployees = [...mechanics, ...coordinators].filter(
        emp => emp.status === 'active' && !emp.isDeleted
      );
        console.log("1")
      await Promise.all(
       activeEmployees.map(emp => 
         NotificationService.createVideoCallNotification(
           [emp.id], 
           initiatorId,
           employeeCallLink,
           initiator.employeeName,
           emp.position
         )
       )
     );
        console.log("2")

      // 4. Send invitations
      await Promise.all(
        activeEmployees.map(emp => 
          sendVideoCallInvitation(
            emp.emailId,
            emp.employeeName,
            initiator.employeeName,
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