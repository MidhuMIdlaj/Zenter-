import { inject, injectable } from "inversify";
import { INotificationRepository } from "../../../domain/Repository/i-notification-repository";
import { TYPES } from "../../../types";
import { IMarkAllChatNotificationsAsReadResult } from "../../../domain/dtos/notification-usecase/mark-all-chat-notification-as-read-interface";
import { IMarkAllChatNotificationsAsReadUseCase } from "../../interface/notification/mark-all-chat-notification-as-read-usecase-interface";

@injectable()
export class markAllChatNotificationsAsRead implements IMarkAllChatNotificationsAsReadUseCase{
  constructor(
    @inject(TYPES.INotificationRepository) private readonly notificationRepo: INotificationRepository
  ) {}

  async execute(userId : string): Promise<IMarkAllChatNotificationsAsReadResult> {
    return await this.notificationRepo.markAllChatNotificationsAsRead(userId);
  }
}
