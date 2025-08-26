import express from 'express';
import { ChatController } from '../../controllers/common/chat-controller';
import { checkRole, verifyToken } from '../../../middleware/auth-middleware';
import chatMulter from '../../../infrastructure/Services/chat-multer-config-service';
import { asyncHandler } from '../../../middleware/async-handler';
import { container } from '../../../infrastructure/DIContainer/container';
import { TYPES } from '../../../types';

const router = express.Router();
const chatController = container.get<ChatController>(TYPES.ChatController)

router.use(asyncHandler(verifyToken));
router.get('/history/:userId/:receiverId', checkRole(['admin', 'coordinator', 'mechanic']),chatController.getChatHistory);
router.get('/conversations/:userId',checkRole(['admin', 'coordinator', 'mechanic']) ,chatController.getConversations);
router.post('/messages', checkRole(['admin', 'coordinator', 'mechanic']), chatMulter.array('attachments', 5), chatController.saveMessage);
router.put('/messages/read',checkRole(['admin', 'coordinator', 'mechanic']) ,chatController.markMessagesAsRead);

export default router;