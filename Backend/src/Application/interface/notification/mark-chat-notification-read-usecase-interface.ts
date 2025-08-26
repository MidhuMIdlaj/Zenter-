
export interface IMarkChatNotificationAsReadInput {
  notificationId: string;
  conversationId: string;
}

export interface IMarkChatNotificationAsReadOutput {
  success: boolean;
  error?: string;
}

export interface IMarkChatNotificationAsReadUseCase {
  execute(input: IMarkChatNotificationAsReadInput): Promise<IMarkChatNotificationAsReadOutput>;
}
