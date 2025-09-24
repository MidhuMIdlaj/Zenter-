import { INotification } from "../../../infrastructure/db/models/notification.model";

export interface IGetUnreadChatNotificationsResponse {
  success: boolean;
  notifications?: INotification[];
  error?: string;
}