const mongoose = require('mongoose');

module.exports = async (req, res) => {
  try {
    const diagnostics = {
      timestamp: new Date().toISOString(),
      nodeEnv: process.env.NODE_ENV,
      hasMongoUri: !!process.env.MONGODB_URI,
      hasJwtSecret: !!process.env.JWT_SECRET,
      hasFrontendUrl: !!process.env.FRONTEND_URL,
      mongoConnectionState: mongoose.connection.readyState,
      mongoConnectionStates: {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
      }
    };

    // Test MongoDB connection
    if (mongoose.connection.readyState === 1) {
      try {
        await mongoose.connection.db.admin().ping();
        diagnostics.mongoConnectionTest = 'success';
      } catch (error) {
        diagnostics.mongoConnectionTest = 'failed';
        diagnostics.mongoError = error.message;
      }
    } else {
      diagnostics.mongoConnectionTest = 'not connected';
    }

    res.status(200).json(diagnostics);
  } catch (error) {
    res.status(500).json({
      error: 'Diagnostic failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
};
