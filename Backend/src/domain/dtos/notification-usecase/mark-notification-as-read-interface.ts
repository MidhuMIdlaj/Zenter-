import { INotification } from "../../../infrastructure/db/models/notification.model";

export interface IMarkChatNotificationAsReadResult {
  success: boolean;
  error?: string;
  notification?: INotification;
  markedCount?: number;
}