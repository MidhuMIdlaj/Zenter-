import express from 'express';
import { NotificationService } from '../../../service/NotificationService';
import mongoose from 'mongoose';
import { StatusCode } from '../../../shared/enums/statusCode';

const router = express.Router();

router.get('/notifications/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await NotificationService.getNotificationsForUser(userId);
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

router.post('/notifications/:notificationId/mark-read', async (req, res) => {
  try {
    const { notificationId } = req.params;

     if (!notificationId || !mongoose.Types.ObjectId.isValid(notificationId)) {
       res.status(400).json({ 
        success: false,
        error: 'Invalid notification ID' 
      });
      return
    }
    const result = await NotificationService.markNotificationAsRead(notificationId);
    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

router.post('/notifications/chat/:notificationId/mark-read/:conversationId', async (req, res) => {
  try {
    const { notificationId, conversationId } = req.params;
    
    // Validate IDs
    if (!notificationId || !mongoose.Types.ObjectId.isValid(notificationId)) {
       res.status(400).json({ 
        success: false,
        error: 'Invalid notification ID' 
      });
      return
    }

    if (!conversationId) {
       res.status(400).json({ 
        success: false,
        error: 'Conversation ID is required' 
      });
      return
    }

    const result = await NotificationService.markChatNotificationAsRead(
      notificationId,
      conversationId
    );

    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json({ 
        success: false, 
        error: result.error 
      });
    }
  } catch (error) {
    console.error('Error marking chat notification as read:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

router.get('/notifications/unread-chat/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.query;

    // Validate parameters
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
       res.status(400).json({ 
        success: false,
        error: 'Invalid user ID' 
      });
      return
    }

    if (!role || typeof role !== 'string') {
       res.status(400).json({ 
        success: false,
        error: 'Role parameter is required and must be a string' 
      });
      return
    }

    const result: {
      success: boolean;
      notifications?: any[];
      error?: any;
    } = await NotificationService.getUnreadChatNotifications(userId, role);
    
    if (result.success) {
      res.json({
        success: true,
        notifications: result.notifications,
        count: result.notifications?.length
      });
    } else {
      res.status((result.error as any)?.StatusCode || 500).json({ 
        success: false, 
        error: typeof result.error === 'object' && result.error !== null && 'message' in result.error
          ? (result.error as any).message
          : result.error || 'Failed to fetch unread chat notifications'
      });
    }
  } catch (error) {
    console.error('Error fetching unread chat notifications:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : undefined
    });
  }
});

// Add this route to your existing router
router.post('/notifications/mark-all-chat-read', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
       res.status(400).json({ 
        success: false,
        error: 'Invalid user ID' 
      });
      return
    }

    const result = await NotificationService.markAllChatNotificationsAsRead(userId);
    
    if (result.success) {
      res.json({
        success: true,
        markedCount: result.markedCount
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: result.error 
      });
    }
  } catch (error) {
    console.error('Error marking all chat notifications as read:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : undefined
    });
  }
});

export default router;