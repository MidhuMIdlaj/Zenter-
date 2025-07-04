// service/NotificationService.ts
import mongoose from 'mongoose';
import { ioInstance } from '../app';
import NotificationModel from '../infrastructure/db/models/Noification';
import { io } from '../server';

export class NotificationService {
  static async sendNewComplaintNotification(
    mechanicId: string,
    complaint: any,
    createdBy: string
  ) {
    try {

      const deadline = this.calculateDeadline(complaint.priority);
      const message = `You got one complaint, finish the task before 2 hours`;

      // Create notification in database
      const notification = new NotificationModel({
        recipientId: mechanicId,
        recipientType: 'mechanic',
        title: 'New Complaint Assigned',
        message,
        type: 'complaint_assigned',
        relatedId: complaint._id,
        createdBy,
        read: false,
        data: {
          complaintId: complaint._id,
          customerName: complaint.customerName,
          priority: complaint.priority,
          productName: complaint.productName,
          deadline,
        },
      });

      const savedNotification = await notification.save();
      console.log('💾 Notification saved to database:', savedNotification._id);

      if (ioInstance) {
        const roomName = `user_${mechanicId}`;
        console.log('📡 Emitting to room:', roomName);

        const notificationData = {
          _id: savedNotification._id,
          title: savedNotification.title,
          message: savedNotification.message,
          createdAt: savedNotification.createdAt,
          read: savedNotification.read,
          complaintId: complaint._id,
          deadline: savedNotification.data.deadline,
          priority: complaint.priority,
        };

        ioInstance.to(roomName).emit('new_complaint_assigned', notificationData);
        console.log('✅ Notification emitted to room:', roomName);

        const socketsInRoom = await ioInstance.in(roomName).fetchSockets();
        console.log(`👥 Sockets in room ${roomName}:`, socketsInRoom.length);

        return {
          success: true,
          notificationId: savedNotification._id,
          socketsReached: socketsInRoom.length,
        };
      } else {
        console.error('❌ Socket instance not available');
        return {
          success: false,
          error: 'Socket instance not available',
          notificationId: savedNotification._id,
        };
      }
    } catch (error) {
      console.error('❌ Error sending notification:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }


  // service/NotificationService.ts - Add this method
static async createVideoCallNotification(
  recipientIds: string[],
  initiatorId: string,
  callLink: string,
  initiatorName: string,
  recipientType : string,
) {
  try {
    console.log("3")
    console.log("ioInstance available:", !!ioInstance);
    // Create notifications for all recipients
    const notifications = await Promise.all(
      recipientIds.map(async (recipientId) => {
        const notification = new NotificationModel({
          recipientId,
          recipientType,
          title: 'New Video Call Invitation',
          message: `${initiatorName} has invited you to a video call`,
          type: 'video_call',
          relatedId: callLink, // Using callLink as relatedId
          createdBy: initiatorId,
          read: false,
          data: {
            callLink,
            initiatorName,
            timestamp: new Date()
          }
        });
        const savedNotification = await notification.save();
        console.log( ioInstance, savedNotification._id , "4")
        
        if (ioInstance) {
          // Enhanced emissio
             console.log(`Emitting to user_${recipientId} and role_${recipientType}`);
          
          // Debug socket rooms
          const sockets = await ioInstance.fetchSockets();
          console.log(`Total connected sockets: ${sockets.length}`);
          
          sockets.forEach(s => {
            if (s.rooms.has(`user_${recipientId}`)) {
              console.log(`Found socket in user_${recipientId} room:`, s.id);
            }
            if (s.rooms.has(`role_${recipientType}`)) {
              console.log(`Found socket in role_${recipientType} room:`, s.id);
            }
          });
          try {
            ioInstance.to(`user_${recipientId}`).emit('new_video_call_notification', {
              _id: savedNotification._id,
              title: 'Video Call Invitation',
              message: `${initiatorName} is calling - Click to join`,
              callLink,
              initiatorName,
              timestamp: savedNotification.createdAt,
              recipientType
            });

            ioInstance.to(`role_${recipientType}`).emit('new_video_call_notification', {
              _id: savedNotification._id,
              title: 'Video Call Invitation',
              message: `${initiatorName} is calling - Click to join`,
              callLink,
              initiatorName,
              timestamp: savedNotification.createdAt,
              recipientType
            });
          } catch (emitError) {
            console.error('Error emitting notification:', emitError);
          }
        }

        return savedNotification;
      })
    );

    return notifications;
  } catch (error) {
    console.error('Error creating video call notifications:', error);
    throw error;
  }
}
  

  static async getNotificationsForUser(userId: string) {
    try {
      const notifications = await NotificationModel.find({ recipientId: userId })
        .sort({ createdAt: -1 })
        .limit(50);
      return { success: true, notifications };
    } catch (error) {
      console.error('❌ Error fetching notifications:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  static async markChatNotificationAsRead(notificationId: string, conversationId: string) {
    try {

       if (!notificationId || !mongoose.Types.ObjectId.isValid(notificationId)) {
      return { success: false, error: 'Invalid notification ID' };
    }
    if (!conversationId) {
      return { success: false, error: 'Conversation ID is required' };
    }
      const notification = await NotificationModel.findOneAndUpdate(
        {
          _id: notificationId,
          type: 'chat_message',
          relatedId: conversationId
        },
        { read: true },
        { new: true }
      );

      if (!notification) {
        return { success: false, error: 'Chat notification not found' };
      }
      const result = await NotificationModel.updateMany(
        {
          type: 'chat_message',
          relatedId: conversationId,
          read: false,
          recipientId: notification.recipientId
        },
        { read: true }
      );

      if (ioInstance) {
      ioInstance.to(`user_${notification.recipientId}`).emit('chat_notifications_read', {
        conversationId,
        markedCount: result.modifiedCount
      });
    }

      return { 
        success: true, 
        notification,
        markedCount: result?.modifiedCount || 0
      };
    } catch (error) {
      console.error('❌ Error marking chat notification as read:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  static async markNotificationAsRead(notificationId: string) {
    try {
       if (!notificationId || !mongoose.Types.ObjectId.isValid(notificationId)) {
      return { success: false, error: 'Invalid notification ID' };
    }

      const updatedNotification = await NotificationModel.findByIdAndUpdate(
        notificationId,
        { read: true },
        { new: true }
      );

      if (!updatedNotification) {
        return { success: false, error: 'Notification not found' };
      }

      if (ioInstance) {
      ioInstance.to(`user_${updatedNotification.recipientId}`).emit('notification_read', {
        notificationId: updatedNotification._id,
        read: true
      });
    }
      return { success: true, updatedNotification };
    } catch (error) {
      console.error('❌ Error marking notification as read:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  static calculateDeadline(priority: string): Date {
    const now = new Date();
    const hours = priority === 'high' ? 2 : 4; // Set to 2 hours for high priority
    now.setHours(now.getHours() + hours);
    return now;
  }

       // Emit socket notification if recipient is online
 static async createChatNotification(
    recipientId: string,
    senderId: string,
    senderName: string,
    messageText: string,
    conversationId: string,
    recipientRole: string 
  ) {
 
    try {
      // Truncate long messages for the notification
      const truncatedMessage = messageText.length > 50 
        ? `${messageText.substring(0, 50)}...` 
        : messageText;

      const notification = new NotificationModel({
        recipientId,
        recipientType: recipientRole,
        title: `New message arrived `,
        message: truncatedMessage,
        type: 'chat_message',
        relatedId: conversationId,
        createdBy: senderId,
        read: false,
        data: {
          senderId,
          senderName,
          conversationId,
          messagePreview: truncatedMessage
        }
      });

      const savedNotification = await notification.save();

      if (ioInstance) {
        const notificationData = {
          notificationId: savedNotification._id,
          title: savedNotification.title,
          message: savedNotification.message,
          type: savedNotification.type,
          createdAt: savedNotification.createdAt,
          read: savedNotification.read,
          senderId: savedNotification.createdBy,
          senderName,
          conversationId
        };

        ioInstance.to(`user_${recipientId}`).emit('new_chat_notification', notificationData);
      }

      return savedNotification;
    } catch (error) {
      console.error('Error creating chat notification:', error);
      throw error;
    }
  }


  static async getUnreadChatNotifications(userId: string, role: string) {
  try {
    console.log({userId, role})
    const notifications = await NotificationModel.find({
      recipientType: role,
      type: 'chat_message',
      read: false
    }).sort({ createdAt: -1 });
    console.log(notifications , "345")
    return { success: true, notifications };
  } catch (error) {
    console.error('Error fetching unread chat notifications:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

static async markAllChatNotificationsAsRead(userId: string) {
  try {
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return { success: false, error: 'Invalid user ID' };
    }

    const result = await NotificationModel.updateMany(
      {
        recipientId: userId,
        type: 'chat_message',
        read: false
      },
      { read: true }
    );

    if (ioInstance) {
      ioInstance.to(`user_${userId}`).emit('all_chat_notifications_read', {
        userId,
        markedCount: result.modifiedCount
      });
    }

    return { 
      success: true,
      markedCount: result.modifiedCount 
    };
  } catch (error) {
    console.error('Error marking all chat notifications as read:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

}