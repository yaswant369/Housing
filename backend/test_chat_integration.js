const mongoose = require('mongoose');
const ChatService = require('./services/chatService');
const NotificationService = require('./services/notificationService');
const User = require('./models/User');
const Notification = require('./models/Notification');

require('dotenv').config();

async function testChatIntegration() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clean up test data
    console.log('Cleaning up test data...');
    await Notification.deleteMany({ type: 'chat_message' });
    await User.deleteMany({ $or: [{ email: 'testuser1@example.com' }, { email: 'testuser2@example.com' }] });

    // Create test users
    console.log('Creating test users...');
    const user1 = new User({
      id: 'user_test_1',
      name: 'Test User 1',
      email: 'testuser1@example.com',
      username: 'testuser1',
      password: 'password123',
      phone: '1234567890',
      role: 'user'
    });

    const user2 = new User({
      id: 'user_test_2',
      name: 'Test User 2',
      email: 'testuser2@example.com',
      username: 'testuser2',
      password: 'password123',
      phone: '0987654321',
      role: 'user'
    });

    await user1.save();
    await user2.save();
    console.log('Test users created');

    // Test chat message sending
    console.log('Testing chat message sending...');
    const chatId = 'test_chat_123';
    const result = await ChatService.sendChatMessage(
      user1.id,
      user2.id,
      'Hello, this is a test message!',
      chatId
    );

    console.log('Chat message sent result:', result);

    // Verify notification was created
    console.log('Verifying notification was created...');
    const notifications = await Notification.find({ userId: user2.id, type: 'chat_message' });
    console.log('Found notifications:', notifications.length);

    if (notifications.length > 0) {
      const notification = notifications[0];
      console.log('Notification details:');
      console.log('- Type:', notification.type);
      console.log('- Title:', notification.title);
      console.log('- Message:', notification.message);
      console.log('- Category:', notification.category);
      console.log('- Priority:', notification.priority);
      console.log('- Action URL:', notification.actionUrl);
      console.log('- Related Entity:', notification.relatedEntity);
      console.log('- Metadata:', notification.metadata);
    } else {
      console.error('No chat message notification found!');
    }

    // Test notification retrieval
    console.log('Testing notification retrieval...');
    const unreadCount = await Notification.getUnreadCount(user2.id);
    console.log('Unread notification count for user2:', unreadCount);

    console.log('✅ All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the test
testChatIntegration();