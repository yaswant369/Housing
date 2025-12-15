import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MessageCircle, Send, User, Clock, MoreVertical,
  Phone, Video, Search, Smile, Paperclip, Mic, Settings,
  Users, Star, Check, X, Trash2, Archive, Bell, Volume2, VolumeX
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// Helper function to format time
const formatTime = (timestamp) => {
  if (!timestamp) return 'Just now';
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Helper function to format date
const formatDate = (timestamp) => {
  if (!timestamp) return 'Today';
  const date = new Date(timestamp);
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();

  if (isToday) return 'Today';
  return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
};

export default function ChatPage() {
  const {
    chats,
    currentChat,
    messages,
    loading,
    fetchChats,
    fetchMessages,
    sendMessage,
    markChatAsRead,
    createChat
  } = useChat();

  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [showChatOptions, setShowChatOptions] = useState(false);
  const [activeTab, setActiveTab] = useState('chats');
  const [isMuted, setIsMuted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [filePreview, setFilePreview] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Filter chats based on search term and active tab
  const filteredChats = chats.filter(chat =>
    chat.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() || !currentChat) return;

    setIsTyping(true);
    try {
      await sendMessage('recipient_id', newMessage, currentChat);
      setNewMessage('');
      setFilePreview(null);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsTyping(false);
    }
  };

  // Handle chat selection with smooth transitions
  const handleSelectChat = async (chatId) => {
    try {
      await fetchMessages(chatId);
      await markChatAsRead(chatId);
    } catch (error) {
      console.error('Error selecting chat:', error);
      toast.error('Failed to load chat');
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Fetch chats on mount - only once
  useEffect(() => {
    fetchChats();
  }, []);

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFilePreview({
          name: file.name,
          type: file.type,
          preview: event.target.result,
          file: file
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove file preview
  const removeFilePreview = () => {
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Toggle voice recording (simulated)
  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      toast.success('Recording started...', {
        icon: <Mic className="text-red-500" />,
        duration: 1000
      });
    } else {
      setIsRecording(false);
      toast.success('Recording stopped', {
        icon: <Check className="text-green-500" />,
        duration: 1000
      });
    }
  };

  // Chat categories for sidebar
  const chatCategories = [
    { id: 'all', label: 'All Chats', count: chats.length, icon: MessageCircle },
    { id: 'unread', label: 'Unread', count: chats.filter(c => c.unreadCount > 0).length, icon: Bell },
    { id: 'important', label: 'Important', count: chats.filter(c => c.isImportant).length, icon: Star },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Button for Mobile */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back</span>
          </button>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages Center</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Enhanced Chat List Sidebar */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Sidebar Header with Tabs */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Chats</h3>
                <button 
                  className="text-white hover:bg-white/20 p-1 rounded-full transition-colors"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <Settings size={18} />
                </button>
              </div>

              {/* Category Tabs */}
              <div className="flex space-x-1 overflow-x-auto pb-2">
                {chatCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveTab(category.id)}
                    className={`flex-1 flex items-center justify-center space-x-1 py-1.5 px-2 rounded-full text-xs font-medium transition-colors ${
                      activeTab === category.id
                        ? 'bg-white text-blue-600 shadow'
                        : 'text-white hover:bg-white/20'
                    }`}
                  >
                    <category.icon size={14} />
                    <span>{category.label}</span>
                    {category.count > 0 && (
                      <span className="bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 ml-1">
                        {category.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Bar */}
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search chats..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Chat List with Loading States */}
            <div className="overflow-y-auto h-[calc(100vh-300px)] min-h-[400px]">
              {loading ? (
                <div className="p-6 space-y-4">
                  {/* Skeleton loader for chat items */}
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="flex items-center space-x-3 p-3 animate-pulse">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-2 bg-gray-100 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredChats.length === 0 ? (
                <div className="p-6 text-center">
                  <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <MessageCircle className="text-blue-600" size={32} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No chats yet</h3>
                  <p className="text-gray-500 mb-4">Start connecting with property owners</p>
                  <button
                    onClick={() => toast.info('Agent chat feature coming soon!')}
                    className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <User className="h-4 w-4" />
                    <span>Explore Properties</span>
                  </button>
                </div>
              ) : (
                filteredChats.map(chat => (
                  <motion.div
                    key={chat.id}
                    onClick={() => handleSelectChat(chat.id)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                      currentChat === chat.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {chat.participantName.charAt(0)}
                        </div>
                        {chat.isOnline && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-gray-900 truncate">{chat.participantName}</p>
                          <p className="text-xs text-gray-400">
                            {formatTime(chat.lastMessageTime)}
                          </p>
                        </div>

                        <div className="flex items-center space-x-2">
                          {chat.isImportant && <Star size={14} className="text-yellow-500" />}
                          <p className={`text-sm truncate ${
                            chat.unreadCount > 0 ? 'font-medium text-gray-900' : 'text-gray-500'
                          }`}>
                            {chat.lastMessage}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 mt-2">
                      {chat.unreadCount > 0 && (
                        <span className="min-w-[20px] h-[20px] bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg shadow-red-500/30 ring-2 ring-white animate-pulse">
                          {chat.unreadCount}
                        </span>
                      )}

                      {chat.hasAttachment && (
                        <Paperclip size={14} className="text-gray-400" />
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Enhanced Chat Area */}
          <div className="lg:col-span-3 bg-white rounded-xl shadow-sm flex flex-col">
            {/* Chat Header with Options */}
            {currentChat ? (
              <>
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-t-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => navigate(-1)}
                        className="lg:hidden text-white hover:bg-white/20 p-1 rounded-full transition-colors"
                      >
                        <ArrowLeft size={20} />
                      </button>

                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {chats.find(c => c.id === currentChat)?.participantName.charAt(0) || 'C'}
                        </div>
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                      </div>

                      <div>
                        <h3 className="font-semibold text-white">
                          {chats.find(c => c.id === currentChat)?.participantName || 'Chat'}
                        </h3>
                        <p className="text-blue-100 text-xs">Online</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button className="text-white hover:bg-white/20 p-1.5 rounded-full transition-colors">
                        <Phone size={18} />
                      </button>
                      <button className="text-white hover:bg-white/20 p-1.5 rounded-full transition-colors">
                        <Video size={18} />
                      </button>
                      <button
                        onClick={() => setShowChatOptions(!showChatOptions)}
                        className="text-white hover:bg-white/20 p-1.5 rounded-full transition-colors relative"
                      >
                        <MoreVertical size={18} />
                        {showChatOptions && (
                          <div className="absolute right-0 top-8 z-10 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[120px]">
                            <button
                              onClick={() => {
                                // Mute chat functionality
                                setIsMuted(!isMuted);
                                toast.success(isMuted ? 'Chat unmuted' : 'Chat muted');
                              }}
                              className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                            >
                              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                              <span>{isMuted ? 'Unmute' : 'Mute'}</span>
                            </button>
                            <button className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors">
                              <Archive size={16} />
                              <span>Archive</span>
                            </button>
                            <button className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors">
                              <Trash2 size={16} />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Enhanced Message Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {messages.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <MessageCircle className="text-blue-600" size={32} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Welcome to Messages</h3>
                      <p className="text-gray-500 mb-4">Start a conversation with property owners</p>
                      <button
                        onClick={() => toast.info('Start by browsing properties!')}
                        className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <User className="h-4 w-4" />
                        <span>Browse Properties</span>
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Date Separators */}
                      {messages.map((message, index) => {
                        const showDateSeparator = index === 0 ||
                          formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp);

                        return (
                          <React.Fragment key={message.id}>
                            {showDateSeparator && (
                              <div className="flex justify-center my-4">
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                                  {formatDate(message.timestamp)}
                                </span>
                              </div>
                            )}

                            {/* Message Bubble */}
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}
                            >
                              <div className={`max-w-[80%] ${message.isCurrentUser ? 'ml-auto' : ''}`}>
                                <div className={`flex items-end space-x-2 ${message.isCurrentUser ? 'flex-row-reverse' : ''}`}>
                                  {!message.isCurrentUser && (
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                      {chats.find(c => c.id === currentChat)?.participantName.charAt(0) || 'A'}
                                    </div>
                                  )}

                                  <div className={`group relative ${message.isCurrentUser ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'}`}>
                                    {/* Message Content */}
                                    <div className={`p-3 rounded-lg ${message.isCurrentUser ? 'rounded-br-none' : 'rounded-bl-none'}`}>
                                      <p className="text-sm">{message.content}</p>

                                      {/* Message Metadata */}
                                      <div className={`flex items-center space-x-2 mt-1 text-xs opacity-70 ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                                        <span>{formatTime(message.timestamp)}</span>
                                        {message.isCurrentUser && (
                                          <React.Fragment>
                                            {message.isRead ? <Check size={12} className="text-blue-300" /> : <Check size={12} className="text-gray-300" />}
                                            <span>{message.isRead ? 'Read' : 'Delivered'}</span>
                                          </React.Fragment>
                                        )}
                                      </div>
                                    </div>

                                    {/* Message Actions (hover) */}
                                    <div className="absolute top-1/2 -translate-y-1/2 right-full mr-2 hidden group-hover:flex space-x-1">
                                      <button className="bg-white p-1 rounded-full shadow hover:bg-gray-100 transition-colors">
                                        <Smile size={14} className="text-gray-600" />
                                      </button>
                                      <button className="bg-white p-1 rounded-full shadow hover:bg-gray-100 transition-colors">
                                        <Star size={14} className="text-gray-600" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </React.Fragment>
                        );
                      })}

                      {/* Typing Indicator */}
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="flex items-center space-x-2 p-3 bg-gray-100 rounded-lg max-w-[80%]">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                              A
                            </div>
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                {/* Enhanced Message Input Area */}
                <div className="border-t border-gray-200 p-3 bg-white">
                  {/* File Preview */}
                  {filePreview && (
                    <div className="mb-3 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {filePreview.type.startsWith('image/') ? (
                          <img src={filePreview.preview} alt="Preview" className="w-12 h-12 object-cover rounded" />
                        ) : (
                          <div className="w-12 h-12 bg-blue-100 rounded flex items-center justify-center">
                            <Paperclip className="text-blue-600" size={20} />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium truncate max-w-[150px]">{filePreview.name}</p>
                          <p className="text-xs text-gray-500">File attached</p>
                        </div>
                      </div>
                      <button
                        onClick={removeFilePreview}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => fileInputRef.current.click()}
                      className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      <Paperclip size={20} />
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                        accept="image/*,.pdf,.doc,.docx"
                      />
                    </button>

                    <button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      <Smile size={20} />
                    </button>

                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="w-full px-4 py-2 text-sm bg-gray-100 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      />

                      {/* Voice Recording Button */}
                      <button
                        onClick={toggleRecording}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors ${
                          isRecording ? 'bg-red-500 text-white' : 'text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        <Mic size={18} />
                      </button>
                    </div>

                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() && !filePreview}
                      className={`p-2 rounded-full transition-colors ${
                        newMessage.trim() || filePreview
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Send size={20} />
                    </button>
                  </div>

                  {/* Emoji Picker (simulated) */}
                  <AnimatePresence>
                    {showEmojiPicker && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-16 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4"
                      >
                        <div className="grid grid-cols-8 gap-2">
                          {['😀', '😃', '😄', '😁', '😆', '😂', '🤣', '😊'].map((emoji, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                setNewMessage(prev => prev + emoji);
                                setShowEmojiPicker(false);
                              }}
                              className="text-2xl hover:bg-gray-100 p-1 rounded transition-colors"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              // No chat selected - Welcome screen
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <MessageCircle className="text-blue-600" size={40} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to Messages</h3>
                <p className="text-gray-500 mb-6">Select a chat from the left sidebar to start messaging</p>
                <button
                  onClick={() => toast.info('Property browsing feature coming soon!')}
                  className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
                >
                  <User className="h-5 w-5" />
                  <span className="font-medium">Browse Properties</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Notifications</h4>
                    <p className="text-sm text-gray-500">chat notifications</p>
                  </div>
                  <button className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none">
                    <span className="sr-only">Enable notifications</span>
                    <span className="w-4 h-4 bg-white rounded-full shadow transform transition-transform"></span>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Sound</h4>
                    <p className="text-sm text-gray-500">message sounds</p>
                  </div>
                  <button className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none">
                    <span className="sr-only">Enable sound</span>
                    <span className="w-4 h-4 bg-white rounded-full shadow transform transition-transform"></span>
                  </button>
                </div>

                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Save Settings
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
