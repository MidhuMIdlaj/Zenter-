import mongoose, { Schema, Document } from 'mongoose';

interface IChatMessage extends Document {
  senderId: string;
  receiverId: string;
  text?: string;
  attachments?: {
    url: string;
    type: string;
    name: string;
    size: number;
  }[];
  time: Date;
  isDelivered: boolean;
  isRead: boolean;
  messageType?: 'text' | 'task' | 'urgent' | 'file';
  conversationId: string;
  senderRole: string;
  receiverRole: string;
}

const chatMessageSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  text: { type: String },
  attachments: [{
    url: { type: String },
    type: { type: String },
    name: { type: String },
    size: { type: Number },
  }],
  time: { type: Date, default: Date.now },
  isDelivered: { type: Boolean, default: true },
  isRead: { type: Boolean, default: false },
  messageType: { type: String, enum: ['text', 'task', 'urgent', 'file'], default: 'text' },
  conversationId: { type: String, required: true },
  senderRole: { type: String, required: true },
  receiverRole: { type: String, required: true },
});

export default mongoose.model<IChatMessage>('ChatMessage', chatMessageSchema);