import { inject, injectable } from "inversify";
import { INotificationRepository } from "../../../domain/Repository/i-notification-repository";
import { TYPES } from "../../../types";
import { IMarkChatNotificationAsReadInput, IMarkChatNotificationAsReadOutput, IMarkChatNotificationAsReadUseCase } from "../../interface/notification/mark-chat-notification-read-usecase-interface";




@injectable()
export class MarkChatNotificationAsReadUseCase implements IMarkChatNotificationAsReadUseCase {
  constructor(
    @inject(TYPES.INotificationRepository)  private readonly notificationRepo: INotificationRepository
  ) {}

  async execute({
    notificationId,
    conversationId,
  }: IMarkChatNotificationAsReadInput): Promise<IMarkChatNotificationAsReadOutput> {
    if (!notificationId || !conversationId) {
      return {
        success: false,
        error: 'Notification ID and Conversation ID are required',
      };
    }

    return await this.notificationRepo.markChatNotificationAsRead(
      notificationId,
      conversationId
    );
  }
}
