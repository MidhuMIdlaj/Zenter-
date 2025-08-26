import { IValidateAdminCoordinatorResult } from "../../../domain/dtos/complaint-usecase/validate-coordinator-admin-email-usecase-interface";

export interface IValidateAdminCoordinatorUseCase {
  execute(email: string): Promise<IValidateAdminCoordinatorResult>;
}
