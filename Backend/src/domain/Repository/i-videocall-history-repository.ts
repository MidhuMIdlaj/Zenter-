import { IVideoCallHistory, VideoCallHistoryInput, VideoCallParticipant } from "../../infrastructure/db/models/videocall.history.model";

export interface IVideoCallHistoryRepository {
  create(callRecord: VideoCallHistoryInput): Promise<IVideoCallHistory>;
  update(roomId: string, callRecord: IVideoCallHistory): Promise<IVideoCallHistory>;
  findByRoomId(roomId: string): Promise<IVideoCallHistory | null>;
  findAll(): Promise<IVideoCallHistory[]>;
  updateParticipants(roomId: string, participants: VideoCallParticipant[]): Promise<IVideoCallHistory>;
}