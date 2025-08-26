import { IVideoCallHistory, VideoCallHistoryInput } from "../../../infrastructure/db/models/videocall.history.model";

export interface ICreateVideoCallRecordUseCase {
  execute(callRecord: VideoCallHistoryInput): Promise<IVideoCallHistory>;
}
