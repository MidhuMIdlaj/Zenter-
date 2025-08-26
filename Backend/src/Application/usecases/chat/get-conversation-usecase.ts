import { inject, injectable } from "inversify";
import { IChatRepository } from "../../../domain/Repository/i-chat-repository";
import { TYPES } from "../../../types";
import { IGetConversationUsecase } from "../../../domain/dtos/Chat-usecase/get-conversation-usecase";
import { IGetConversationsUseCase } from "../../interface/chat/get-conversation-usecase-interface";


@injectable()
class GetConversationsUseCase implements IGetConversationsUseCase {
    constructor(
      @inject(TYPES.IChatRepository) private  chatRepo : IChatRepository
    ) {}

  async execute(userId: string): Promise<IGetConversationUsecase[]> {
    const conversations = await this.chatRepo.getConversations(userId);
    return conversations;
  }
}

export default GetConversationsUseCase;
