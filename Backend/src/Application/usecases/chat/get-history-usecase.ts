import { inject, injectable } from "inversify";
import { IChatMessage, IChatRepository } from "../../../domain/Repository/i-chat-repository";
import { TYPES } from "../../../types";
import { IGetChatHistoryUseCase } from "../../interface/chat/get-history-usecase-interface";

@injectable()
class GetChatHistoryUseCase  implements IGetChatHistoryUseCase{
  constructor(
    @inject(TYPES.IChatRepository) private  chatRepo : IChatRepository
  ) {}

  async execute(userId: string, receiverId: string): Promise<IChatMessage[]> {
    const conversationId = [userId, receiverId].sort().join("_");
    const messages = await this.chatRepo.getChatHistory(conversationId);
    return messages;
  }
}

export default GetChatHistoryUseCase;

