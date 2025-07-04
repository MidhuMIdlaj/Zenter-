import mongoose, { Schema, Document } from 'mongoose';

interface IChatMessage extends Document {
  senderId: string;
  receiverId: string;
  text?: string;
  file?: {
    url: string; // File path or URL
    type: string; // e.g., 'image/jpeg', 'application/pdf'
    name: string; // Original file name
    size: number; // File size in bytes
  };
  time: Date;
  isDelivered: boolean;
  isRead: boolean;
  messageType?: 'text' | 'task' | 'urgent' | 'file';
  conversationId: string;
  senderRole : string;
  receiverRole : string;
}

const chatMessageSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  text: { type: String },
  file: {
    url: { type: String },
    type: { type: String },
    name: { type: String },
    size: { type: Number },
  },
  time: { type: Date, default: Date.now },
  isDelivered: { type: Boolean, default: true },
  isRead: { type: Boolean, default: false },
  messageType: { type: String, enum: ['text', 'task', 'urgent'], default: 'text' },
  conversationId: { type: String, required: true },
  senderRole : {type : String, require : true},
  receiverRole : {type : String, require :true}
});


export default mongoose.model<IChatMessage>('ChatMessage', chatMessageSchema);