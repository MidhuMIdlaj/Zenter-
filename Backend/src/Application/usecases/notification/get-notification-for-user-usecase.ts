// src/Application/usecases/notification/GetNotificationsForUserUsecase.ts

import { inject, injectable } from "inversify";
import { INotificationRepository } from "../../../domain/Repository/i-notification-repository";
import { TYPES } from "../../../types";
import { ResponseDTO } from "../../../domain/dtos/Response";
import {  IGetNotificationsForUserOutput } from "../../../domain/dtos/notification-usecase/get-notification-for-user-usecase-interface";
import { IGetNotificationsForUserUseCase } from "../../interface/notification/get-notification-for-user-usecase-interface";

interface IGetNotificationsForUserInput {
  userId: string;
}




@injectable()
export class GetNotificationsForUserUseCase implements IGetNotificationsForUserUseCase {
  constructor(
    @inject(TYPES.INotificationRepository) private readonly notificationRepo: INotificationRepository
  ) {}

  async execute({
    userId,
  }: IGetNotificationsForUserInput): Promise<IGetNotificationsForUserOutput> {
    if (!userId) {
      return { success: false, error: "User ID is required" };
    }
    try {
      const result = await this.notificationRepo.getNotificationsForUser(userId);
      return result;
    }catch (error: unknown) {
  console.error("Error in GetNotificationsForUser use case:", error);
  const response: ResponseDTO = {
    success: false,
    data: null,
    statusCode: 500,
    message: error instanceof Error ? error.message : "Failed to get notifications"
  };
  
   return response;
  }
  }
}
