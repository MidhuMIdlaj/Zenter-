import { inject, injectable } from "inversify";
import { ValidationError } from "../../../domain/error/employeeErrors";
import { IVideoCallHistoryRepository } from "../../../domain/Repository/i-videocall-history-repository";
import { IVideoCallHistory, VideoCallParticipant } from "../../../infrastructure/db/models/videocall.history.model";
import { TYPES } from "../../../types";
import { IUpdateCallParticipantsUseCase } from "../../interface/videocall/update-call-participens-usecase-inerface";


@injectable()
export default class UpdateCallParticipantsUseCase implements IUpdateCallParticipantsUseCase {
  constructor(
    @inject(TYPES.IVideoCallRepository)  private videoCallHistoryRepo: IVideoCallHistoryRepository,
  ) {}

  async execute(roomId: string, participants: VideoCallParticipant[]): Promise<IVideoCallHistory> {
    if (!roomId || !Array.isArray(participants)) {
      throw new ValidationError("roomId and participants array are required");
    }

    const updatedCall = await this.videoCallHistoryRepo.updateParticipants(roomId, participants);

    if (!updatedCall) {
      throw new ValidationError("Call record not found");
    }
    return updatedCall;
  }
}
