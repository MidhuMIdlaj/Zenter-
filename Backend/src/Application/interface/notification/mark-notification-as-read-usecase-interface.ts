
export interface IMarkNotificationAsReadInput {
  notificationId: string;
}

export interface IMarkNotificationAsReadOutput {
  success: boolean;
  error?: string;
}

export interface IMarkNotificationAsReadUseCase {
  execute(input: IMarkNotificationAsReadInput): Promise<IMarkNotificationAsReadOutput>;
}
