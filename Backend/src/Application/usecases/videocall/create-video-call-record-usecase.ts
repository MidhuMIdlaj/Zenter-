import { inject, injectable } from "inversify";
import { IVideoCallHistoryRepository } from "../../../domain/Repository/i-videocall-history-repository";
import { IVideoCallHistory, VideoCallHistoryInput } from "../../../infrastructure/db/models/videocall.history.model";
import { TYPES } from "../../../types";
import { ICreateVideoCallRecordUseCase } from "../../interface/videocall/create-videocall-record-usecase-interface";



@injectable()
export class CreateVideoCallRecordUseCase implements ICreateVideoCallRecordUseCase{
  constructor(
    @inject(TYPES.IVideoCallRepository) private videoCallHistoryRepo: IVideoCallHistoryRepository
  ) {
    this.videoCallHistoryRepo = videoCallHistoryRepo;
  }

  async execute(callRecord: VideoCallHistoryInput): Promise<IVideoCallHistory> {
    if (!callRecord.roomId) {
      throw new Error("Room ID is required");
    }

    const createdRecord = await this.videoCallHistoryRepo.create(callRecord);
    return createdRecord;
  }
}
