export interface INotification extends Document {
  userId: string;
  type: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
  conversationId?: string;
  recipientId: string;
  __v?: number;  
}
