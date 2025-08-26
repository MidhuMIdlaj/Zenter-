// src/infrastructure/db/models/VideoCallHistory.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface VideoCallParticipant {
  employeeId: string;
  employeeName?: string;
  joinedAt?: Date;
  leftAt?: Date;
}

export interface VideoCallHistoryInput {
  roomId: string;
  initiatorId: string;
  initiatorName?: string;
  participants: VideoCallParticipant[];
  startedAt?: Date;
  endedAt?: Date;
  status?: 'ongoing' | 'ended';
  duration?: number;
}

export interface IVideoCallHistory extends Document, VideoCallHistoryInput {
  createdAt: Date;
  updatedAt: Date;
}

const VideoCallHistorySchema: Schema = new Schema({
  roomId: { type: String, required: true, index: true },
  initiatorId: { type: String, required: true },
  initiatorName: { type: String, required: false },
  participants: [
    {
      employeeName: String,
      employeeId: { type: String, required: true },
      joinedAt: Date,
      leftAt: Date,
    }
  ],
  startedAt: { type: Date, default: Date.now },
  endedAt: Date,
  duration: Number,
  status: { 
    type: String, 
    enum: ['ongoing', 'ended'], 
    default: 'ongoing' 
  }
}, {
  timestamps: true
});

export default mongoose.model<IVideoCallHistory>('VideoCallHistory', VideoCallHistorySchema);
