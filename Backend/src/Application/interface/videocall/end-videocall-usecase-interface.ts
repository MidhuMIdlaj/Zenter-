import { IVideoCallHistory } from "../../../infrastructure/db/models/videocall.history.model";

export interface IEndVideoCallUseCase {
  execute(roomId: string): Promise<IVideoCallHistory>;
}
