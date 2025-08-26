import { INotification } from "../../Repository/i-notification-repository";

export interface IGetUnreadChatNotificationsResponse {
  success: boolean;
  notifications?: INotification[];
  error?: string;
}