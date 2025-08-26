import mongoose, { Schema, Types } from "mongoose";

interface IConversation extends Document {
  participants: {
    userId: string;
    role: string;
    lastRead?: Date;
  }[];
  lastMessage: Types.ObjectId;
  unreadCounts: Record<string, number>;
}

const conversationSchema = new Schema({
  participants: [{
    userId: { type: String, required: true },
    role: { type: String, enum: ['admin', 'coordinator', 'mechanic'], required: true },
    lastRead: { type: Date }
  }],
  lastMessage: { type: Schema.Types.ObjectId, ref: 'ChatMessage' },
  unreadCounts: { type: Map, of: Number, default: {} }
}, { timestamps: true });

export const ConversationModel = mongoose.model<IConversation>('Conversation', conversationSchema);