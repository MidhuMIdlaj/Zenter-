import { IGetNotificationsForUserOutput } from "../../../domain/dtos/notification-usecase/get-notification-for-user-usecase-interface";

export interface IGetNotificationsForUserUseCase {
  execute(input: { userId: string }): Promise<IGetNotificationsForUserOutput>;
}
