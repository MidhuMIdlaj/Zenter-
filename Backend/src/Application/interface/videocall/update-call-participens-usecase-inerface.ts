import { IVideoCallHistory, VideoCallParticipant } from "../../../infrastructure/db/models/videocall.history.model";

export interface IUpdateCallParticipantsUseCase {
  execute(roomId: string, participants: VideoCallParticipant[]): Promise<IVideoCallHistory>;
}
