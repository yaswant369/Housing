// backend/test_notifications.js
// Test script to create sample notifications for testing the notification system

const mongoose = require('mongoose');
const User = require('./models/User');
const Notification = require('./models/Notification');
require('dotenv').config();

async function createTestNotifications() {
  try {
    // Connect to database
    console.log('🔌 Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/housing');
    console.log('✅ Database connected successfully!');

    // Find the first user (or create instructions if no users exist)
    let user = await User.findOne();
    if (!user) {
      console.log('❌ No users found in database.');
      console.log('📝 Please create a user account first by:');
      console.log('   1. Register a new account via the frontend');
      console.log('   2. Or run this script after user registration');
      process.exit(1);
    }

    console.log(`👤 Found user: ${user.name} (${user.email})`);
    console.log('📧 User ID:', user.id);

    // Clean up any existing test notifications
    console.log('🧹 Cleaning up existing test notifications...');
    await Notification.deleteMany({ 
      userId: user.id, 
      type: { $in: ['test', 'welcome', 'property_alert', 'system_update'] }
    });

    // Create diverse test notifications
    const testNotifications = [
      {
        id: `test_welcome_${Date.now()}`,
        userId: user.id,
        title: 'Welcome to Our Platform!',
        message: 'Thank you for joining us. Here are some tips to get started with your property search.',
        category: 'account',
        type: 'welcome',
        isRead: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        actionUrl: '/profile',
        priority: 'normal',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Expires in 7 days
      },
      {
        id: `test_property_${Date.now() + 1}`,
        userId: user.id,
        title: 'New Property Matches Found!',
        message: 'We found 3 new properties in Nellore that match your criteria. Check them out now!',
        category: 'property',
        type: 'new_match',
        isRead: false,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        actionUrl: '/properties?filter=new',
        priority: 'high',
        expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // Expires in 5 days
      },
      {
        id: `test_price_${Date.now() + 2}`,
        userId: user.id,
        title: 'Price Alert: Property Price Dropped',
        message: 'A property you saved has reduced its price by ₹50,000. Don\'t miss this opportunity!',
        category: 'property',
        type: 'price_change',
        isRead: false,
        createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        actionUrl: '/saved',
        priority: 'high',
        expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // Expires in 3 days
      },
      {
        id: `test_update_${Date.now() + 3}`,
        userId: user.id,
        title: 'System Update: New Features Available',
        message: 'We\'ve added new filters and improved search performance. Update your app to access these features.',
        category: 'system',
        type: 'system_update',
        isRead: true, // This one is already read
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        actionUrl: '/premium',
        priority: 'normal',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Expires in 30 days
      },
      {
        id: `test_security_${Date.now() + 4}`,
        userId: user.id,
        title: 'Security Alert: New Login Detected',
        message: 'A new login was detected from Chrome on Windows. If this wasn\'t you, please secure your account.',
        category: 'security',
        type: 'login_alert',
        isRead: false,
        createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        actionUrl: '/profile?tab=security',
        priority: 'critical',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // Expires in 1 day
      }
    ];

    console.log('📝 Creating test notifications...');
    
    // Insert all test notifications
    const createdNotifications = await Notification.insertMany(testNotifications);
    
    console.log('✅ Successfully created test notifications!');
    console.log(`📊 Created ${createdNotifications.length} notifications:`);
    
    // Display summary
    const unreadCount = createdNotifications.filter(n => !n.isRead).length;
    const readCount = createdNotifications.filter(n => n.isRead).length;
    
    console.log(`   🔵 Unread: ${unreadCount}`);
    console.log(`   ✅ Read: ${readCount}`);
    console.log(`   📋 Total: ${createdNotifications.length}`);
    
    console.log('\n🎉 Test setup complete!');
    console.log('\n📱 Next Steps:');
    console.log('1. 🔄 Refresh your browser/frontend');
    console.log('2. 🔔 Look for the notification bell in the header');
    console.log('3. 🔢 You should see a badge with the unread count');
    console.log('4. 🖱️ Click the bell to view notifications');
    console.log('5. ✅ Test marking notifications as read');
    console.log('6. 🗑️ Test deleting notifications');
    
    console.log('\n🔍 API Verification:');
    console.log('Open Developer Tools (F12) → Network tab');
    console.log('Check that API calls show 200 status (not 401)');
    
  } catch (error) {
    console.error('❌ Error creating test notifications:', error.message);
    if (error.code === 'MODULE_NOT_FOUND') {
      console.error('📝 Make sure you\'re running this from the backend directory');
    }
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Database disconnected');
    process.exit(0);
  }
}

// Run the test
createTestNotifications();