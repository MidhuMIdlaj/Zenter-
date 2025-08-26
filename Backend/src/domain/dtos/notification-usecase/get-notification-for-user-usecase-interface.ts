import { INotification } from "./i-notification-interface";

export interface IGetNotificationsForUserOutput {
  success: boolean;
  notifications?: INotification[];
  error?: string;
}