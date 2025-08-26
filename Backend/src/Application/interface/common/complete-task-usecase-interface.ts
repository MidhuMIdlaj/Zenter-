import { ICompleteTaskUsecase } from "../../../domain/dtos/complaint-usecase/complete-task-usecase-interface";

export interface ICompleteTaskUseCase {
  execute(
    taskId: string,
    mechanicId: string,
    description: string,
    photoPaths: string[],
    paymentStatus?: string,
    amount?: number,
    paymentMethod?: string
  ): Promise<ICompleteTaskUsecase | null>;
}
