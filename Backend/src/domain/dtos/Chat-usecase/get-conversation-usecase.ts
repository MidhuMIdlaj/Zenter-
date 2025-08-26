export interface IGetConversationUsecase{
  conversationId: string;
  lastMessage?: string;
  time: Date;
  otherUserId: string;
  unreadCount: number;
}
