import { IGetUnreadChatNotificationsResponse } from "../../../domain/dtos/notification-usecase/get-unread-chat-notification-interface";

export interface IGetUnreadChatNotificationsUseCase {
  execute(userId: string, role: string): Promise<IGetUnreadChatNotificationsResponse>;
}
