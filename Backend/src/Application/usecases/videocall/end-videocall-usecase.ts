import { inject, injectable } from "inversify";
import { ValidationError } from "../../../domain/error/employeeErrors";
import { IVideoCallHistoryRepository } from "../../../domain/Repository/i-videocall-history-repository";
import { IVideoCallHistory } from "../../../infrastructure/db/models/videocall.history.model";
import { TYPES } from "../../../types";
import { IEndVideoCallUseCase } from "../../interface/videocall/end-videocall-usecase-interface";


@injectable()
export class EndVideoCallUseCase implements IEndVideoCallUseCase {
  constructor(
    @inject(TYPES.IVideoCallRepository) private videoCallHistoryRepo: IVideoCallHistoryRepository
  ) {}

  async execute(roomId: string): Promise<IVideoCallHistory> {
    if (!roomId) {
      throw new ValidationError("Room ID is required");
    }

    const call = await this.videoCallHistoryRepo.findByRoomId(roomId);
    if (!call) {
      throw new ValidationError("Call not found");
    }

    if (call.status === "ended") {
      return call; // Already ended, return as is
    }

    const endedAt = new Date();
    const startedAt = call.startedAt || new Date();
    const durationInSeconds = Math.floor((endedAt.getTime() - startedAt.getTime()) / 1000);

    call.endedAt = endedAt;
    call.status = "ended";
    call.duration = durationInSeconds;

    return await call.save();
  }
}
