const jwt = require('jsonwebtoken');
const config = require('../config');
const logger = require('../utils/logger');

/**
 * Authentication middleware supporting Bearer tokens and JWT
 */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authorization header is required',
        requestId: req.id
      });
    }

    const [scheme, token] = authHeader.split(' ');
    
    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid authorization format. Use: Bearer <token>',
        requestId: req.id
      });
    }

    // Check if it's a simple bearer token
    if (token === config.BEARER_TOKEN) {
      req.user = { type: 'bearer', authenticated: true };
      logger.info('Bearer token authentication successful', { requestId: req.id });
      return next();
    }

    // Try JWT verification
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET);
      req.user = { ...decoded, type: 'jwt', authenticated: true };
      logger.info('JWT authentication successful', { 
        requestId: req.id, 
        userId: decoded.sub || decoded.id 
      });
      return next();
    } catch (jwtError) {
      logger.warn('JWT verification failed', { 
        requestId: req.id, 
        error: jwtError.message 
      });
    }

    // If neither bearer token nor JWT worked
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired token',
      requestId: req.id
    });

  } catch (error) {
    logger.error('Authentication middleware error', { 
      requestId: req.id, 
      error: error.message 
    });
    
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Authentication processing failed',
      requestId: req.id
    });
  }
};

module.exports = authMiddleware;