#!/usr/bin/env node

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Test configuration
const TEST_CONFIG = {
  timeout: 30000, // 30 seconds timeout
  retries: 3,
  batchSize: 5
};

// Test schema
const TestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  testRun: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const TestModel = mongoose.model('MongoDBTest', TestSchema);

class MongoDBTester {
  constructor() {
    this.testRunId = `test_run_${Date.now()}`;
    this.createdDocuments = [];
    this.isConnected = false;
  }

  async connect() {
    try {
      const mongoURI = process.env.MONGODB_URI;
      if (!mongoURI) {
        throw new Error('MONGODB_URI not found in environment variables');
      }

      console.log('🔌 Connecting to MongoDB Atlas...');
      console.log(`📍 URI: ${mongoURI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`);

      await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: TEST_CONFIG.timeout,
        socketTimeoutMS: TEST_CONFIG.timeout,
        maxPoolSize: 10,
      });

      this.isConnected = true;
      console.log('✅ MongoDB Atlas connection established');
      console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
      console.log(`🔗 Connection state: ${mongoose.connection.readyState}`);
      
      return true;
    } catch (error) {
      console.error('❌ MongoDB connection failed:');
      console.error(`   Error: ${error.message}`);
      if (error.code) console.error(`   Code: ${error.code}`);
      return false;
    }
  }

  async testInsertOperations() {
    console.log('\n📝 Testing INSERT Operations...');
    
    try {
      // Single document insert
      console.log('   → Single document insert...');
      const singleDoc = new TestModel({
        name: 'Single Test Document',
        email: `single.test.${this.testRunId}@example.com`,
        amount: 100.50,
        category: 'Test',
        testRun: this.testRunId
      });

      const savedDoc = await singleDoc.save();
      this.createdDocuments.push(savedDoc._id);
      console.log(`   ✅ Single document inserted: ${savedDoc._id}`);

      // Batch insert
      console.log('   → Batch documents insert...');
      const batchData = Array.from({ length: TEST_CONFIG.batchSize }, (_, i) => ({
        name: `Batch Document ${i + 1}`,
        email: `batch.${i + 1}.${this.testRunId}@example.com`,
        amount: Math.round((Math.random() * 1000 + 10) * 100) / 100,
        category: ['Food', 'Travel', 'Shopping', 'Bills'][i % 4],
        testRun: this.testRunId
      }));

      const batchDocs = await TestModel.insertMany(batchData);
      this.createdDocuments.push(...batchDocs.map(doc => doc._id));
      console.log(`   ✅ Batch insert completed: ${batchDocs.length} documents`);

      return true;
    } catch (error) {
      console.error(`   ❌ Insert operation failed: ${error.message}`);
      return false;
    }
  }

  async testReadOperations() {
    console.log('\n🔍 Testing READ Operations...');
    
    try {
      // Count all test documents
      const totalCount = await TestModel.countDocuments({ testRun: this.testRunId });
      console.log(`   ✅ Total test documents: ${totalCount}`);

      // Find all documents
      const allDocs = await TestModel.find({ testRun: this.testRunId }).limit(10);
      console.log(`   ✅ Retrieved ${allDocs.length} documents`);

      // Find by specific criteria
      const specificDocs = await TestModel.find({ 
        testRun: this.testRunId,
        amount: { $gte: 100 }
      });
      console.log(`   ✅ Documents with amount >= 100: ${specificDocs.length}`);

      // Find one document
      const oneDoc = await TestModel.findOne({ testRun: this.testRunId });
      if (oneDoc) {
        console.log(`   ✅ Found document: ${oneDoc.name} (${oneDoc.email})`);
      }

      // Aggregation
      const aggregation = await TestModel.aggregate([
        { $match: { testRun: this.testRunId } },
        { $group: { 
            _id: '$category', 
            count: { $sum: 1 },
            totalAmount: { $sum: '$amount' }
          } 
        }
      ]);
      console.log(`   ✅ Aggregation results: ${aggregation.length} categories`);

      return true;
    } catch (error) {
      console.error(`   ❌ Read operation failed: ${error.message}`);
      return false;
    }
  }

  async testUpdateOperations() {
    console.log('\n📝 Testing UPDATE Operations...');
    
    try {
      // Update one document
      const updateResult = await TestModel.updateOne(
        { testRun: this.testRunId },
        { $set: { name: 'Updated Test Document', amount: 999.99 } }
      );
      console.log(`   ✅ Updated ${updateResult.modifiedCount} document(s)`);

      // Update multiple documents
      const updateManyResult = await TestModel.updateMany(
        { testRun: this.testRunId, category: 'Test' },
        { $set: { category: 'Updated Category' } }
      );
      console.log(`   ✅ Bulk update: ${updateManyResult.modifiedCount} document(s)`);

      // Find and update
      const findAndUpdate = await TestModel.findOneAndUpdate(
        { testRun: this.testRunId },
        { $inc: { amount: 50.00 } },
        { new: true }
      );
      if (findAndUpdate) {
        console.log(`   ✅ Find and update: ${findAndUpdate.name} - New amount: ${findAndUpdate.amount}`);
      }

      return true;
    } catch (error) {
      console.error(`   ❌ Update operation failed: ${error.message}`);
      return false;
    }
  }

  async testDeleteOperations() {
    console.log('\n🗑️  Testing DELETE Operations...');
    
    try {
      // Count before deletion
      const beforeCount = await TestModel.countDocuments({ testRun: this.testRunId });
      console.log(`   📊 Documents before deletion: ${beforeCount}`);

      // Delete one document
      const deleteOneResult = await TestModel.deleteOne({ testRun: this.testRunId });
      console.log(`   ✅ Deleted one document: ${deleteOneResult.deletedCount}`);

      // Delete many documents
      const deleteManyResult = await TestModel.deleteMany({ testRun: this.testRunId });
      console.log(`   ✅ Bulk delete: ${deleteManyResult.deletedCount} document(s)`);

      // Verify deletion
      const afterCount = await TestModel.countDocuments({ testRun: this.testRunId });
      console.log(`   ✅ Documents after deletion: ${afterCount}`);
      
      this.createdDocuments = []; // Clear the tracking array

      return true;
    } catch (error) {
      console.error(`   ❌ Delete operation failed: ${error.message}`);
      return false;
    }
  }

  async cleanup() {
    console.log('\n🧹 Cleaning up test data...');
    
    try {
      // Remove any remaining test documents
      const cleanupResult = await TestModel.deleteMany({ testRun: this.testRunId });
      if (cleanupResult.deletedCount > 0) {
        console.log(`   ✅ Cleaned up ${cleanupResult.deletedCount} remaining document(s)`);
      } else {
        console.log('   ✅ No cleanup needed - all test data already removed');
      }
      
      return true;
    } catch (error) {
      console.error(`   ❌ Cleanup failed: ${error.message}`);
      return false;
    }
  }

  async disconnect() {
    try {
      if (this.isConnected) {
        await mongoose.connection.close();
        this.isConnected = false;
        console.log('\n🔌 Database connection closed');
      }
    } catch (error) {
      console.error(`❌ Error closing connection: ${error.message}`);
    }
  }

  async runAllTests() {
    console.log('🚀 Starting Comprehensive MongoDB Atlas CRUD Test');
    console.log('=' .repeat(60));
    console.log(`🆔 Test Run ID: ${this.testRunId}`);
    console.log(`⏰ Started at: ${new Date().toISOString()}`);

    const results = {
      connection: false,
      insert: false,
      read: false,
      update: false,
      delete: false,
      cleanup: false
    };

    try {
      // Test connection
      results.connection = await this.connect();
      if (!results.connection) {
        throw new Error('Failed to connect to MongoDB');
      }

      // Run CRUD tests
      results.insert = await this.testInsertOperations();
      results.read = await this.testReadOperations();
      results.update = await this.testUpdateOperations();
      results.delete = await this.testDeleteOperations();

      // Cleanup
      results.cleanup = await this.cleanup();

    } catch (error) {
      console.error(`\n💥 Test execution failed: ${error.message}`);
    } finally {
      await this.disconnect();
    }

    // Print results
    console.log('\n📊 Test Results Summary:');
    console.log('=' .repeat(60));
    Object.entries(results).forEach(([test, passed]) => {
      const status = passed ? '✅ PASSED' : '❌ FAILED';
      console.log(`   ${test.toUpperCase().padEnd(12)}: ${status}`);
    });

    const allPassed = Object.values(results).every(result => result === true);
    console.log('\n' + '='.repeat(60));
    console.log(allPassed ? '🎉 ALL TESTS PASSED!' : '💥 SOME TESTS FAILED!');
    console.log('=' .repeat(60));
    console.log(`⏰ Completed at: ${new Date().toISOString()}`);

    return allPassed;
  }
}

// Handle process termination gracefully
const tester = new MongoDBTester();

process.on('SIGINT', async () => {
  console.log('\n⚠️  Received SIGINT. Cleaning up...');
  await tester.cleanup();
  await tester.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n⚠️  Received SIGTERM. Cleaning up...');
  await tester.cleanup();
  await tester.disconnect();
  process.exit(0);
});

// Run the tests
if (require.main === module) {
  tester.runAllTests()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('\n💥 Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = MongoDBTester;
