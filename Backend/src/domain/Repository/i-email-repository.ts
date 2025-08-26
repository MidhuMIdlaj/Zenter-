import { IComplaintReassignmentEmailData } from "../dtos/Email-service-usecase/complaint-reassignment-email-data.";

export interface IEmailService {
  sendResetOTP(email: string, otp: string): Promise<void>;
  sendComplaintStatusUpdate(email: string, complaintId: string, status: string, comments?: string): Promise<void>;
  sendComplaintReassignmentEmail(email: string, data: IComplaintReassignmentEmailData): Promise<void>;
  sendNoMechanicAvailableEmail(data: IComplaintReassignmentEmailData): Promise<void>;
  sendUniversalSMS(phoneNumber: string, message: string): Promise<boolean>;
  sendEmployeeWelcomeEmail(email: string, name: string, password?: string): Promise<void>;
  sendVideoCallInvitation(
    recipientEmail: string,
    recipientName: string,
    initiatorName: string,
    callLink: string
  ): Promise<void>;
}
