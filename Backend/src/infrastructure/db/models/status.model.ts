import { Document, Schema } from 'mongoose';

export type ComplaintStatusType = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface ComplaintStatus {
  status: ComplaintStatusType;
  updatedAt: Date;
  updatedBy: string;
}

export const ComplaintStatusSchema = new Schema<ComplaintStatus>({
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: String,
    required: true
  }
}, { _id: false });