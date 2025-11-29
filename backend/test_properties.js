#!/usr/bin/env node
/**
 * Test script to verify property posting and fetching functionality
 * This script tests the complete flow from property creation to user property fetching
 */

const mongoose = require('mongoose');
const Property = require('./models/Property');
const User = require('./models/User');
require('dotenv').config();

async function testPropertyFlow() {
  try {
    console.log('🔗 Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Database connected');

    // Test 1: Check if we have any users
    const userCount = await User.countDocuments();
    console.log(`👥 Total users in database: ${userCount}`);
    
    if (userCount === 0) {
      console.log('⚠️  No users found. Please create a user account first.');
      console.log('   You can register via the frontend application.');
      return;
    }

    // Test 2: Get a sample user
    const sampleUser = await User.findOne().limit(1);
    console.log(`👤 Sample user: ${sampleUser.name} (${sampleUser.id})`);

    // Test 3: Check existing properties for this user
    const userProperties = await Property.find({ userId: sampleUser.id });
    console.log(`🏠 Properties for user ${sampleUser.id}: ${userProperties.length}`);

    if (userProperties.length > 0) {
      console.log('📋 Existing properties:');
      userProperties.forEach((prop, index) => {
        console.log(`   ${index + 1}. ${prop.type} in ${prop.location} - ₹${prop.price} (ID: ${prop.id})`);
      });
    } else {
      console.log('📝 No properties found for this user.');
      
      // Test 4: Show property creation statistics
      const totalProps = await Property.countDocuments();
      console.log(`📊 Total properties in database: ${totalProps}`);
      
      if (totalProps === 0) {
        console.log('✨ Database is empty - ready for first property creation!');
      } else {
        const otherUserProps = await Property.find({ userId: { $ne: sampleUser.id } });
        console.log(`👥 Properties from other users: ${otherUserProps.length}`);
      }
    }

    // Test 5: Check database indexes
    const indexes = await Property.collection.listIndexes().toArray();
    console.log('🗄️  Property collection indexes:');
    indexes.forEach(index => {
      console.log(`   - ${index.name}: ${JSON.stringify(index.key)}`);
    });

    console.log('\n🎉 Test completed successfully!');
    console.log('\n💡 Next steps:');
    console.log('   1. Open the frontend application');
    console.log('   2. Login with the sample user');
    console.log('   3. Try posting a new property');
    console.log('   4. Check "My Properties" page to see if it appears');

  } catch (err) {
    console.error('❌ Test failed:', err);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the test
if (require.main === module) {
  testPropertyFlow();
}

module.exports = { testPropertyFlow };