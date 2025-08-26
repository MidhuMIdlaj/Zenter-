import { IChatMessage } from "../../../domain/Repository/i-chat-repository";


export interface IGetChatHistoryUseCase {
  execute(userId: string, receiverId: string): Promise<IChatMessage[]>;
}
