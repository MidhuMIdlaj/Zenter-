import { inject, injectable } from "inversify";
import { IVideoCallHistoryRepository } from "../../../domain/Repository/i-videocall-history-repository";
import { IVideoCallHistory } from "../../../infrastructure/db/models/videocall.history.model";
import { TYPES } from "../../../types";
import { IGetCallHistoryUseCase } from "../../interface/videocall/get-call-history-usecase-interface";

@injectable()
export default class GetCallHistoryUseCase implements IGetCallHistoryUseCase {
  constructor(
    @inject(TYPES.IVideoCallRepository)  private videoCallHistoryRepo: IVideoCallHistoryRepository,
  ) {}

  async execute(): Promise<IVideoCallHistory[]> {
    const callHistory = await this.videoCallHistoryRepo.findAll();
    return callHistory;
  }
}
