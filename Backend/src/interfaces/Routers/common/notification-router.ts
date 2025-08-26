// src/routes/notificationRoutes.ts
import express from 'express';
import { NotificationController } from '../../controllers/common/notification-controller';
import { checkRole, verifyToken } from '../../../middleware/auth-middleware';
import { asyncHandler } from '../../../middleware/async-handler';
import { container } from '../../../infrastructure/DIContainer/container';
import { TYPES } from '../../../types';

const router = express.Router();

const notificationController = container.get<NotificationController>(TYPES.NotificationController)

// Apply auth middleware to all routes
router.use(asyncHandler(verifyToken));
router.use(checkRole(['admin', 'mechanic', 'coordinator']));
router.get('/notifications/:userId', notificationController.getNotificationsForUser);
router.post('/notifications/:notificationId/mark-read', notificationController.markNotificationAsRead);
router.post('/notifications/chat/:notificationId/mark-read/:conversationId', notificationController.markChatNotificationAsRead);
router.get('/notifications/unread-chat/:userId', notificationController.getUnreadChatNotifications);
router.post('/notifications/mark-all-chat-read', notificationController.markAllChatNotificationsAsRead);

export default router;