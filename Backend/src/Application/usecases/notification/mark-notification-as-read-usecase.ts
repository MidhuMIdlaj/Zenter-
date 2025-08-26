import { inject, injectable } from "inversify";
import { INotificationRepository } from "../../../domain/Repository/i-notification-repository";
import { TYPES } from "../../../types";
import { IMarkNotificationAsReadInput, IMarkNotificationAsReadOutput, IMarkNotificationAsReadUseCase } from "../../interface/notification/mark-notification-as-read-usecase-interface";



@injectable()
export class MarkNotificationAsReadUseCase implements IMarkNotificationAsReadUseCase {
  constructor(
    @inject(TYPES.INotificationRepository)  private readonly notificationRepo: INotificationRepository
  ) {}

  async execute({
    notificationId,
  }: IMarkNotificationAsReadInput): Promise<IMarkNotificationAsReadOutput> {
    if (!notificationId) {
      return { success: false, error: "Notification ID is required" };
    }
    try {
      const result = await this.notificationRepo.markNotificationAsRead(notificationId);
      return result;
    } catch (error: unknown) {
       console.error("Error in MarkNotificationAsRead use case:", error);
      return { 
       success: false, 
       error: error instanceof Error ? error.message : "Internal server error" 
     };
    }
  }
}
