const express = require('express');
const { Pool } = require('pg');
const AWS = require('aws-sdk');
const config = require('../config');
const logger = require('../utils/logger');

const router = express.Router();

// Database connection for health check
const pool = new Pool({
  connectionString: config.DATABASE_URL,
  max: 1
});

// AWS S3 client for health check
const s3 = new AWS.S3({
  region: config.AWS_REGION,
  accessKeyId: config.AWS_ACCESS_KEY_ID,
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY
});

/**
 * Basic health check endpoint
 */
router.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: config.NODE_ENV
  });
});

/**
 * Detailed health check with dependency status
 */
router.get('/detailed', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: config.NODE_ENV,
    dependencies: {}
  };

  // Check database connectivity
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    health.dependencies.database = { status: 'healthy' };
  } catch (error) {
    health.dependencies.database = { 
      status: 'unhealthy', 
      error: error.message 
    };
    health.status = 'unhealthy';
  }

  // Check AWS S3 connectivity
  try {
    await s3.headBucket({ Bucket: config.AWS_S3_BUCKET }).promise();
    health.dependencies.s3 = { status: 'healthy' };
  } catch (error) {
    health.dependencies.s3 = { 
      status: 'unhealthy', 
      error: error.message 
    };
    health.status = 'unhealthy';
  }

  // Check memory usage
  const memUsage = process.memoryUsage();
  health.system = {
    memory: {
      rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
      external: `${Math.round(memUsage.external / 1024 / 1024)}MB`
    },
    uptime: `${Math.round(process.uptime())}s`
  };

  const statusCode = health.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(health);
});

/**
 * Readiness probe for Kubernetes
 */
router.get('/ready', async (req, res) => {
  try {
    // Quick database check
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    
    res.json({ status: 'ready' });
  } catch (error) {
    logger.error('Readiness check failed', { error: error.message });
    res.status(503).json({ 
      status: 'not ready', 
      error: error.message 
    });
  }
});

/**
 * Liveness probe for Kubernetes
 */
router.get('/live', (req, res) => {
  res.json({ status: 'alive' });
});

module.exports = router;