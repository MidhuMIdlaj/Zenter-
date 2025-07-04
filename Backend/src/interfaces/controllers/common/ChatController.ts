// src/controllers/chat/ChatController.ts
import { Request, Response, NextFunction } from 'express';
import { IChatRepository } from '../../../domain/Repository/ChatRepository'
import { StatusCode } from '../../../shared/enums/statusCode';
import { io } from '../../../server';
import { NotificationService } from '../../../service/NotificationService';
import ChatMessageModel from '../../../infrastructure/db/models/ChatModel'
import { ConversationModel } from '../../../infrastructure/db/models/conversationSchema ';
import NotificationModel from '../../../infrastructure/db/models/Noification'

export class ChatController {
  private chatRepo: IChatRepository;

  constructor(chatRepository: IChatRepository) {
    this.chatRepo = chatRepository;
  }

  getChatHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId, receiverId } = req.params;
      const conversationId = [userId, receiverId].sort().join('_');
      const messages = await this.chatRepo.getChatHistory(conversationId);
      res.json(messages);
    } catch (err) {
      console.error('Error fetching chat history:', err);
      next(err);
    }
  };

  getConversations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId } = req.params;
      const conversations = await this.chatRepo.getConversations(userId);
      res.json(conversations);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      next(err);
    }
  };

  saveMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { senderId, receiverId, text, messageType, conversationId, senderRole, receiverRole } = req.body;
      const savedMessage = await this.chatRepo.saveMessage({
        senderId,
        receiverId,
        text,
        messageType,
        conversationId,
        senderRole,
        receiverRole
      });
      res.status(StatusCode.CREATED).json(savedMessage);
    } catch (err) {
      console.error('Error saving message:', err);
      next(err);
    }
  };

markMessagesAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { conversationId, userId } = req.body;
    
    if (!conversationId || !userId) {
      res.status(StatusCode.BAD_REQUEST).json({ error: 'Missing required fields' });
      return;
    }

    const markedCount = await this.chatRepo.markMessagesAsRead(conversationId, userId);
    
    if (io) {
      io.to(`user_${userId}`).emit('messages_read', { conversationId });
    }
    res.json({ 
      success: true, 
      markedCount 
    });
  } catch (err) {
    console.error('Error marking messages as read:', err);
    next(err);
   }
 };
}