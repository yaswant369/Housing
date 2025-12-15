const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const ChatService = require('../services/chatService');

const router = express.Router();

// POST /api/chat/send - Send a chat message
router.post('/send', authMiddleware, async (req, res) => {
  try {
    const { recipientId, message, chatId } = req.body;
    const senderId = req.user.id;

    if (!recipientId || !message) {
      return res.status(400).json({ message: 'Recipient ID and message are required' });
    }

    const result = await ChatService.sendChatMessage(senderId, recipientId, message, chatId);

    res.json({
      success: true,
      message: 'Chat message sent successfully',
      data: result
    });

  } catch (err) {
    console.error('Error sending chat message:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/chat/create - Create a new chat session
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { userId2, propertyId } = req.body;
    const userId1 = req.user.id;

    if (!userId2) {
      return res.status(400).json({ message: 'User ID 2 is required' });
    }

    const chatSession = await ChatService.createChatSession(userId1, userId2, propertyId);

    res.json({
      success: true,
      message: 'Chat session created successfully',
      data: chatSession
    });

  } catch (err) {
    console.error('Error creating chat session:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/chat/messages - Get chat messages
router.get('/messages/:chatId', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { chatId } = req.params;

    const messages = await ChatService.getChatMessages(userId, chatId);

    res.json({
      success: true,
      data: messages
    });

  } catch (err) {
    console.error('Error getting chat messages:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/chat/list - Get user's chat list
router.get('/list', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const chats = await ChatService.getUserChats(userId);

    res.json({
      success: true,
      data: chats
    });

  } catch (err) {
    console.error('Error getting chat list:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;