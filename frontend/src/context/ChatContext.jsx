import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';

const ChatContext = createContext();

// API base URL
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export function ChatProvider({ children }) {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unreadChatsCount, setUnreadChatsCount] = useState(0);
  const navigate = useNavigate();

  // Fetch user's chat list with better error handling
  const fetchChats = async () => {
    try {
      // Only set loading if not already loading to prevent rapid state changes
      if (!loading) {
        setLoading(true);
      }
      setError(null);

      const response = await api.get('/chat/list');
      const data = response.data;

      // Access the chats from the correct nested structure
      const chatsData = data.data?.chats || [];
      setChats(chatsData);
      setUnreadChatsCount(chatsData.reduce((count, chat) => count + chat.unreadCount, 0));

      return data;
    } catch (err) {
      console.error('Error fetching chats:', err);
      setError(err.message);
      // Only show toast if this is a new error (not repeated)
      if (!error) {
        toast.error('Failed to load chats');
      }
      return null;
    } finally {
      // Use setTimeout to batch rapid loading state changes
      setTimeout(() => {
        setLoading(false);
      }, 100);
    }
  };

  // Fetch messages for a specific chat
  const fetchMessages = async (chatId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/chat/messages/${chatId}`);
      const data = response.data;

      setMessages(data.messages || []);
      setCurrentChat(chatId);

      // Mark chat as read
      await markChatAsRead(chatId);

      return data;
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err.message);
      toast.error('Failed to load messages');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Send a chat message
  const sendMessage = async (recipientId, message, chatId = null) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post('/chat/send', {
        recipientId,
        message,
        chatId
      });

      const data = response.data;

      // Add the sent message to local state
      const newMessage = {
        id: `temp_${Date.now()}`,
        senderId: 'current_user', // This would be the actual user ID in real implementation
        message,
        timestamp: new Date(),
        isRead: true
      };

      setMessages(prev => [...prev, newMessage]);

      // If this is a new chat, create a chat session
      if (!chatId) {
        const chatResponse = await api.post('/chat/create', {
          userId2: recipientId
        });
        setCurrentChat(chatResponse.data.data.id);
      }

      toast.success('Message sent!');
      return data;
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err.message);
      toast.error('Failed to send message');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create a new chat session
  const createChat = async (userId2, propertyId = null) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post('/chat/create', {
        userId2,
        propertyId
      });

      const data = response.data;
      const newChat = {
        id: data.data.id,
        participantId: userId2,
        participantName: 'New Chat', // Would be fetched from user data in real implementation
        lastMessage: '',
        lastMessageTime: new Date(),
        unreadCount: 0,
        propertyId
      };

      setChats(prev => [newChat, ...prev]);
      setCurrentChat(newChat.id);
      setMessages([]);

      return data;
    } catch (err) {
      console.error('Error creating chat:', err);
      setError(err.message);
      toast.error('Failed to create chat');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Mark chat as read
  const markChatAsRead = async (chatId) => {
    try {
      // Update local state and unread count in a single operation
      setChats(prevChats => {
        const updatedChats = prevChats.map(chat =>
          chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
        );

        // Calculate the unread count reduction from the previous state
        const originalChat = prevChats.find(c => c.id === chatId);
        const unreadReduction = originalChat ? originalChat.unreadCount : 0;

        // Update unread count based on the previous state
        setUnreadChatsCount(prevCount => prevCount - unreadReduction);

        return updatedChats;
      });

      // In a real implementation, you would call a backend API here
      // await api.put(`/chat/${chatId}/read`);

    } catch (err) {
      console.error('Error marking chat as read:', err);
    }
  };

  // Handle notification click for chat messages
  const handleChatNotificationClick = async (notification) => {
    if (notification.actionUrl && notification.actionUrl.includes('/chat/')) {
      const chatId = notification.actionUrl.split('/chat/')[1];
      navigate(notification.actionUrl);

      // Mark notification as read
      try {
        await api.put(`/notifications/${notification.id}/read`);
      } catch (err) {
        console.error('Error marking notification as read:', err);
      }
    }
  };

  // Load chats on mount - only once and with proper error handling
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Add a flag to prevent multiple concurrent fetches
      let isMounted = true;

      const loadChats = async () => {
        try {
          await fetchChats();
        } catch (err) {
          console.error('Initial chat load failed:', err);
          // Don't show error toast for initial load to prevent spam
          if (isMounted) {
            setError('Failed to load chats - you may be offline');
          }
        }
      };

      loadChats();

      return () => {
        isMounted = false;
      };
    }
  }, []);

  const value = {
    chats,
    currentChat,
    messages,
    loading,
    error,
    unreadChatsCount,
    fetchChats,
    fetchMessages,
    sendMessage,
    createChat,
    markChatAsRead,
    handleChatNotificationClick
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
