const winston = require('winston');

// Create logger configuration based on environment
const createLogger = () => {
  const transports = [];
  
  // Always add console transport
  transports.push(new winston.transports.Console({
    format: process.env.NODE_ENV === 'production'
      ? winston.format.combine(
          winston.format.timestamp(),
          winston.format.errors({ stack: true }),
          winston.format.json()
        )
      : winston.format.simple()
  }));
  
  // Only add file transports in development (not in serverless)
  if (process.env.NODE_ENV !== 'production') {
    transports.push(
      new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
      new winston.transports.File({ filename: 'logs/combined.log' })
    );
  }
  
  return winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    ),
    defaultMeta: { service: 'expense-tracker' },
    transports
  });
};

const logger = createLogger();

module.exports = logger;
