// domain/usecases/chat/IGetConversationsUseCase.ts

import { IGetConversationUsecase } from "../../../domain/dtos/Chat-usecase/get-conversation-usecase";


export interface IGetConversationsUseCase {
  execute(userId: string): Promise<IGetConversationUsecase[]>;
}
