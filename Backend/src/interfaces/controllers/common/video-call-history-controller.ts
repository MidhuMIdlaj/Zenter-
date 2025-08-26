// src/controllers/videoCall/VideoCallHistoryController.ts
import { Request, Response, NextFunction } from 'express';
import { StatusCode } from '../../../shared/enums/statusCode';
import {  ValidationError } from '../../../domain/error/employeeErrors';
import { VideoCallHistoryInput } from '../../../infrastructure/db/models/videocall.history.model';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../types';
import { IFindAdminNameUseCase } from '../../../Application/interface/admin/admin/find-all-admin-name-usecase-interface';
import { ICreateVideoCallRecordUseCase } from '../../../Application/interface/videocall/create-videocall-record-usecase-interface';
import { IEndVideoCallUseCase } from '../../../Application/interface/videocall/end-videocall-usecase-interface';
import { IGetCallHistoryUseCase } from '../../../Application/interface/videocall/get-call-history-usecase-interface';
import { IUpdateCallParticipantsUseCase } from '../../../Application/interface/videocall/update-call-participens-usecase-inerface';

@injectable()
export class VideoCallHistoryController {
  constructor(
    @inject(TYPES.CreateVideoCallRecordUseCase) private createCallRecordUseCase : ICreateVideoCallRecordUseCase,
    @inject(TYPES.UpdateCallParticipantsUseCase) private updateParticipantsUseCase : IUpdateCallParticipantsUseCase,
    @inject(TYPES.EndVideoCallUseCase) private endCallUseCase : IEndVideoCallUseCase,
    @inject(TYPES.GetCallHistoryUseCase) private getCallHistoryUseCase : IGetCallHistoryUseCase,
    @inject(TYPES.findAdminNameUsecases) private findAdminNameUsecases : IFindAdminNameUseCase
  ) {}

  createCallRecord = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { roomId,initiatorId, participants } = req.body;

    if (!roomId) {
      throw new ValidationError('Room ID is required');
    }
    const initiator = await this.findAdminNameUsecases.execute(initiatorId);
    const initiatorName = typeof initiator === 'string'
      ? initiator
      : initiator && typeof initiator === 'object' && 'name' in initiator
        ? (initiator as { name: string }).name
        : 'admin';
    const callRecord: VideoCallHistoryInput = {
      roomId,
      initiatorId,
      initiatorName,
      participants: participants || [],
      startedAt: new Date(),
      status: 'ongoing'
    };

    const createdRecord = await this.createCallRecordUseCase.execute(callRecord);

    res.status(StatusCode.CREATED).json({
      success: true,
      message: 'Video call record created successfully',
      data: createdRecord
    });
        } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'A call with this room ID already exists') {
          return next(new ValidationError(error.message));
        }
      }

      if (
        typeof error === 'object' &&
        error !== null &&
        'name' in error &&
        'code' in error &&
        (error as any).name === 'MongoServerError' &&
        (error as any).code === 11000
      ) {
        return next(new ValidationError('Duplicate key error - room ID must be unique'));
      }

      return next(error);
      }
  }


  updateParticipants = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { roomId } = req.params;
    const { participants } = req.body;

    if (!roomId || !Array.isArray(participants)) {
      throw new ValidationError('roomId and participants array are required');
    }

    const updatedRecord = await this.updateParticipantsUseCase.execute(roomId, participants);

    res.status(StatusCode.OK).json({
      success: true,
      message: 'Participants updated successfully',
      data: updatedRecord
    });
  } catch (error) {
    next(error);
  }
};

 endCall = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { roomId } = req.params;
    if (!roomId) {
      throw new ValidationError('Room ID is required');
    }

    const call = await this.endCallUseCase.execute(roomId);
    if (!call) {
      throw new ValidationError('Call not found');
    }

    if (call.status === 'ended') {
       res.status(200).json({
        success: true,
        message: 'Call already ended',
        data: call,
      });
      return
    }

    const endedAt = new Date();
    const startedAt = call.startedAt || new Date();

    const durationInSeconds = Math.floor((endedAt.getTime() - startedAt.getTime()) / 1000);

    call.endedAt = endedAt;
    call.status = 'ended';
    call.duration = durationInSeconds;

    const updatedCall = await call.save();

    res.status(200).json({
      success: true,
      message: 'Call ended successfully',
      data: updatedCall,
    });
  } catch (error) {
    next(error);
  }
};

  getCallHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
     const histories = await this.getCallHistoryUseCase.execute()
      res.status(StatusCode.OK).json({
        success: true,
        message: 'Video call history retrieved successfully',
        data: histories,
      });
    } catch (error) {
      next(error);
    }
  };
}