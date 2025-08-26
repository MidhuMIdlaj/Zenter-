import { IVideoCallHistory } from "../../../infrastructure/db/models/videocall.history.model";

export interface IGetCallHistoryUseCase {
  execute(): Promise<IVideoCallHistory[]>;
}
