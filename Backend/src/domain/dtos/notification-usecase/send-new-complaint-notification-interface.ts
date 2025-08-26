export interface ISendNewComplaintNotification {
  success: boolean;
  notificationId?: string | undefined
  socketsReached?: number;
  error?: string;
}