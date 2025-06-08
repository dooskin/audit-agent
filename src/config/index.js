require('dotenv').config();

const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT) || 3000,
  
  // Database
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/audit_evidence',
  DB_POOL_SIZE: parseInt(process.env.DB_POOL_SIZE) || 10,
  
  // AWS Configuration
  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET || 'audit-evidence-bucket',
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  
  // Security
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || 'your-32-character-encryption-key!!',
  BEARER_TOKEN: process.env.BEARER_TOKEN || 'your-bearer-token-change-in-production',
  
  // CORS
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000'],
  
  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  LOG_FILE_PATH: process.env.LOG_FILE_PATH || './logs',
  
  // Scheduler
  COLLECTION_SCHEDULE: process.env.COLLECTION_SCHEDULE || '0 2 * * *', // Daily at 2 AM
  
  // Cleanup
  TEMP_FILE_CLEANUP_INTERVAL: parseInt(process.env.TEMP_FILE_CLEANUP_INTERVAL) || 3600000, // 1 hour
  TEMP_FILE_MAX_AGE: parseInt(process.env.TEMP_FILE_MAX_AGE) || 86400000, // 24 hours
};

// Validation
const requiredEnvVars = [
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'AWS_S3_BUCKET',
  'DATABASE_URL',
  'JWT_SECRET',
  'ENCRYPTION_KEY',
  'BEARER_TOKEN'
];

if (config.NODE_ENV === 'production') {
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
}

module.exports = config;