import { IMarkAllChatNotificationsAsReadResult } from "../../../domain/dtos/notification-usecase/mark-all-chat-notification-as-read-interface";

export interface IMarkAllChatNotificationsAsReadUseCase {
  execute(userId: string): Promise<IMarkAllChatNotificationsAsReadResult>;
}
