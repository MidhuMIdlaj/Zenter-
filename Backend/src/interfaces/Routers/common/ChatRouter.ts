// src/routes/chatRoutes.ts
import express from 'express';
import { ChatController } from '../../controllers/common/ChatController';
import { ChatRepository } from '../../../infrastructure/repositories/ChatRepoImpl';
import { verifyToken } from '../../../middleware/authMiddleware';
import { Request, Response, NextFunction } from 'express';
const router = express.Router();


const chatRepository = new ChatRepository();
const chatController = new ChatController(chatRepository);

// Apply auth middleware to all routes
router.use(verifyToken as (req: Request, res: Response, next: NextFunction) => void);
router.get('/history/:userId/:receiverId', chatController.getChatHistory);
router.get('/conversations/:userId', chatController.getConversations);
router.post('/messages', chatController.saveMessage);
router.put('/messages/read', chatController.markMessagesAsRead);
export default router;