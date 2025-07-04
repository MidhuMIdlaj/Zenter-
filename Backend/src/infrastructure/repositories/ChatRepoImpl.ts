// src/repositories/implementations/ChatRepository.ts
import { IChatRepository, IChatMessage } from '../../domain/Repository/ChatRepository';
import ChatMessage from '../../infrastructure/db/models/ChatModel';

export class ChatRepository implements IChatRepository {
  async getChatHistory(conversationId: string): Promise<IChatMessage[]> {
    const messages = await ChatMessage.find({ conversationId })
      .sort({ time: 1 })
      .lean();

    return messages.map((msg: any) => ({
      ...msg,
      messageType: msg.messageType ?? 'text'
    })) as IChatMessage[];
  }

  async getConversations(userId: string): Promise<any[]> {
    return ChatMessage.aggregate([
      {
        $match: {
          $or: [{ senderId: userId }, { receiverId: userId }],
        },
      },
      {
        $sort: { time: -1 },
      },
      {
        $group: {
          _id: '$conversationId',
          lastMessage: { $first: '$text' },
          time: { $first: '$time' },
          senderId: { $first: '$senderId' },
          receiverId: { $first: '$receiverId' },
          unreadCount: {
            $sum: {
              $cond: [{ $and: [{ $eq: ['$receiverId', userId] }, { $eq: ['$isRead', false] }] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          conversationId: '$_id',
          lastMessage: 1,
          time: 1,
          otherUserId: {
            $cond: [{ $eq: ['$senderId', userId] }, '$receiverId', '$senderId'],
          },
          unreadCount: 1,
        },
      },
    ]);
  }

  async saveMessage(messageData: {
    senderId: string;
    receiverId: string;
    text: string;
    messageType?: string;
    conversationId?: string;
    senderRole ?: string;
    receiverRole ?: string
  }): Promise<IChatMessage> {
    const newMessage = new ChatMessage({
      ...messageData,
      time: new Date(),
      isDelivered: true,
      isRead: false,
      messageType: messageData.messageType || 'text',
      conversationId: messageData.conversationId || [messageData.senderId, messageData.receiverId].sort().join('_')
    });

    const savedMessage = await newMessage.save();
    const plainMessage = savedMessage.toObject ? savedMessage.toObject() : savedMessage;
    return {
      senderId: plainMessage.senderId,
      receiverId: plainMessage.receiverId,
      text: plainMessage.text,
      time: plainMessage.time,
      isDelivered: plainMessage.isDelivered,
      isRead: plainMessage.isRead,
      conversationId: plainMessage.conversationId,
      messageType: plainMessage.messageType || 'text',
      _id: plainMessage._id,
      senderRole : plainMessage.senderRole,
      receiverRole : plainMessage.receiverRole
    } as IChatMessage;
  }

  
async markMessagesAsRead(conversationId: string, userId: string): Promise<number> {
  const result = await ChatMessage.updateMany(
    { 
      conversationId, 
      receiverId: userId, 
      isRead: false 
    },
    { 
      $set: { isRead: true } 
    }
  );
  
  return result.modifiedCount;
}
}