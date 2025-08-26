import { EmailInfo } from "../../../domain/dtos/Employee-usecase/get-coordinator-email-interface";

export interface IGetCoordinatorEmails {
  execute(): Promise<EmailInfo[]>;
}
