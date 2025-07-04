import { Document } from 'mongoose';

export interface IChatMessage extends Document {
  senderId: string;
  receiverId: string;
  text: string;
  time: Date;
  isDelivered: boolean;
  isRead: boolean;
  messageType: string;
  conversationId: string;
  senderRole : string;
  receiverRole : string;
}

export interface IChatRepository {
  getChatHistory(conversationId: string): Promise<IChatMessage[]>;
  getConversations(userId: string): Promise<any[]>;
  saveMessage(messageData: {
    senderId: string;
    receiverId: string;
    text: string;
    messageType?: string;
    conversationId?: string;
    senderRole ?: string;
    receiverRole ?: string;
  }): Promise<IChatMessage>;
   markMessagesAsRead(conversationId: string, userId: string): Promise<number>;
}