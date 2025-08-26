import { ISavedMessageUsecase } from "../../../domain/dtos/Chat-usecase/save-message-usecase-interface";
import { SaveMessageInput } from "../../usecases/chat/save-message-usecase";

export interface ISaveMessageUseCase {
  execute(input: SaveMessageInput): Promise<ISavedMessageUsecase>;
}