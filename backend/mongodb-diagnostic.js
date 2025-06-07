#!/usr/bin/env node

/**
 * MongoDB Atlas Quick Diagnostic Script
 * This script provides quick health checks and diagnostics for MongoDB Atlas connection
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

class MongoDBDiagnostic {
  async run() {
    console.log('🏥 MongoDB Atlas Health Check & Diagnostics');
    console.log('=' .repeat(50));
    console.log(`⏰ Timestamp: ${new Date().toISOString()}`);

    try {
      // Environment Check
      console.log('\n📋 Environment Configuration:');
      const mongoURI = process.env.MONGODB_URI;
      console.log('   NODE_ENV:', process.env.NODE_ENV || 'not set');
      console.log('   MONGODB_URI:', mongoURI ? '✅ configured' : '❌ missing');
      console.log('   JWT_SECRET:', process.env.JWT_SECRET ? '✅ configured' : '❌ missing');

      if (!mongoURI) {
        console.log('❌ Cannot proceed without MONGODB_URI');
        return false;
      }

      // Connection Test
      console.log('\n🔌 Connection Test:');
      console.log('   Attempting connection...');
      
      const startTime = Date.now();
      await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 5000,
      });
      const connectionTime = Date.now() - startTime;

      console.log(`   ✅ Connected successfully (${connectionTime}ms)`);
      console.log('   Database name:', mongoose.connection.db.databaseName);
      console.log('   Connection state:', this.getConnectionState(mongoose.connection.readyState));

      // Database Info
      console.log('\n📊 Database Information:');
      const db = mongoose.connection.db;
      
      // List collections
      const collections = await db.listCollections().toArray();
      console.log(`   Collections: ${collections.length}`);
      collections.forEach(col => {
        console.log(`     - ${col.name}`);
      });

      // Database stats
      try {
        const stats = await db.stats();
        console.log('   Statistics:');
        console.log(`     - Documents: ${stats.objects || 0}`);
        console.log(`     - Collections: ${stats.collections || 0}`);
        console.log(`     - Storage size: ${Math.round((stats.storageSize || 0) / 1024)} KB`);
        console.log(`     - Data size: ${Math.round((stats.dataSize || 0) / 1024)} KB`);
      } catch (statsError) {
        console.log('   ⚠️  Could not retrieve database stats');
      }

      // Test basic operations
      console.log('\n🧪 Basic Operations Test:');
      
      // Create a temporary collection for testing
      const TestModel = mongoose.model('HealthCheck', new mongoose.Schema({
        timestamp: { type: Date, default: Date.now },
        test: String
      }));

      // Insert test
      const testDoc = await TestModel.create({ test: 'health-check' });
      console.log('   ✅ Insert operation: SUCCESS');

      // Read test
      const foundDoc = await TestModel.findById(testDoc._id);
      console.log('   ✅ Read operation:', foundDoc ? 'SUCCESS' : 'FAILED');

      // Update test
      await TestModel.updateOne({ _id: testDoc._id }, { test: 'updated' });
      console.log('   ✅ Update operation: SUCCESS');

      // Delete test
      await TestModel.deleteOne({ _id: testDoc._id });
      console.log('   ✅ Delete operation: SUCCESS');

      // Connection performance
      console.log('\n⚡ Performance Metrics:');
      const pingStart = Date.now();
      await db.admin().ping();
      const pingTime = Date.now() - pingStart;
      console.log(`   Ping time: ${pingTime}ms`);
      console.log(`   Connection time: ${connectionTime}ms`);

      // Server info
      try {
        const serverInfo = await db.admin().serverStatus();
        console.log('\n🖥️  Server Information:');
        console.log(`   MongoDB version: ${serverInfo.version}`);
        console.log(`   Host: ${serverInfo.host}`);
        console.log(`   Process: ${serverInfo.process}`);
        console.log(`   Uptime: ${Math.round(serverInfo.uptime / 3600)} hours`);
      } catch (serverError) {
        console.log('\n⚠️  Could not retrieve server information');
      }

      console.log('\n🎉 All health checks passed!');
      return true;

    } catch (error) {
      console.error('\n❌ Health check failed:');
      console.error(`   Error: ${error.message}`);
      
      if (error.name === 'MongoServerSelectionError') {
        console.error('   Possible causes:');
        console.error('     - Network connectivity issues');
        console.error('     - Incorrect MongoDB URI');
        console.error('     - MongoDB Atlas cluster is paused');
        console.error('     - IP address not whitelisted');
      }
      
      return false;
    } finally {
      try {
        await mongoose.connection.close();
        console.log('\n🔌 Connection closed');
      } catch (closeError) {
        console.error('❌ Error closing connection:', closeError.message);
      }
    }
  }

  getConnectionState(state) {
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    return states[state] || 'unknown';
  }
}

// Run diagnostics
if (require.main === module) {
  const diagnostic = new MongoDBDiagnostic();
  diagnostic.run()
    .then(success => {
      console.log('\n' + '='.repeat(50));
      console.log(success ? '✅ DIAGNOSTIC PASSED' : '❌ DIAGNOSTIC FAILED');
      console.log('='.repeat(50));
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('\n💥 Diagnostic error:', error);
      process.exit(1);
    });
}

module.exports = MongoDBDiagnostic;
