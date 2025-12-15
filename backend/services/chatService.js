const NotificationService = require('./notificationService');
const User = require('../models/User');

class ChatService {
  /**
   * Send a chat message and create notification
   */
  static async sendChatMessage(senderId, recipientId, message, chatId) {
    try {
      // Validate users
      const sender = await User.findOne({ id: senderId });
      const recipient = await User.findOne({ id: recipientId });

      if (!sender || !recipient) {
        throw new Error('Sender or recipient not found');
      }

      // Create notification for recipient
      const messagePreview = message.length > 50 ? message.substring(0, 50) + '...' : message;

      await NotificationService.sendChatMessageNotification(
        recipientId,
        sender.name || sender.username || 'A user',
        messagePreview,
        chatId
      );

      // In a real implementation, you would also save the chat message to database
      // and handle real-time delivery via WebSocket or similar

      return {
        success: true,
        message: 'Chat message sent and notification created',
        notificationCreated: true
      };

    } catch (error) {
      console.error('Error sending chat message:', error);
      throw error;
    }
  }

  /**
   * Create a new chat session
   */
  static async createChatSession(userId1, userId2, propertyId = null) {
    try {
      // Validate users
      const user1 = await User.findOne({ id: userId1 });
      const user2 = await User.findOne({ id: userId2 });

      if (!user1 || !user2) {
        throw new Error('One or both users not found');
      }

      // Generate chat ID
      const chatId = `chat_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

      // In a real implementation, you would save this to database
      const chatSession = {
        id: chatId,
        participants: [userId1, userId2],
        propertyId,
        createdAt: new Date(),
        updatedAt: new Date(),
        messages: []
      };

      return chatSession;

    } catch (error) {
      console.error('Error creating chat session:', error);
      throw error;
    }
  }

  /**
   * Get chat messages for a user
   */
  static async getChatMessages(userId, chatId) {
    try {
      // Validate user
      const user = await User.findOne({ id: userId });
      if (!user) {
        throw new Error('User not found');
      }

      // In a real implementation, you would fetch messages from database
      // For now, return mock data
      return {
        chatId,
        messages: [
          {
            id: 'msg_1',
            senderId: 'user_other',
            message: 'Hello, I\'m interested in your property.',
            timestamp: new Date(Date.now() - 3600000),
            isRead: true
          },
          {
            id: 'msg_2',
            senderId: userId,
            message: 'Thank you for your interest! How can I help you?',
            timestamp: new Date(Date.now() - 1800000),
            isRead: true
          }
        ]
      };

    } catch (error) {
      console.error('Error getting chat messages:', error);
      throw error;
    }
  }

  /**
   * Get chat list for a user
   */
  static async getUserChats(userId) {
    try {
      // Validate user
      const user = await User.findOne({ id: userId });
      if (!user) {
        throw new Error('User not found');
      }

      // In a real implementation, you would fetch chats from database
      // For now, return mock data
      return {
        chats: [
          {
            id: 'chat_1',
            participantId: 'user_other',
            participantName: 'John Doe',
            lastMessage: 'Hello, I\'m interested in your property.',
            lastMessageTime: new Date(Date.now() - 3600000),
            unreadCount: 1,
            propertyId: 'prop_123'
          },
          {
            id: 'chat_2',
            participantId: 'user_agent',
            participantName: 'Sarah Smith',
            lastMessage: 'Can we schedule a viewing?',
            lastMessageTime: new Date(Date.now() - 7200000),
            unreadCount: 0,
            propertyId: 'prop_456'
          }
        ]
      };

    } catch (error) {
      console.error('Error getting user chats:', error);
      throw error;
    }
  }
}

module.exports = ChatService;