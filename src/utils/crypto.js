const crypto = require('crypto');
const config = require('../config');

class CryptoUtils {
  constructor() {
    this.algorithm = 'aes-256-gcm';
    this.keyLength = 32;
    this.ivLength = 16;
    this.tagLength = 16;
    this.key = Buffer.from(config.ENCRYPTION_KEY, 'utf8').slice(0, this.keyLength);
  }

  /**
   * Encrypt data using AES-256-GCM
   * @param {string|Buffer} data - Data to encrypt
   * @returns {Object} - Encrypted data with IV and auth tag
   */
  encrypt(data) {
    try {
      const iv = crypto.randomBytes(this.ivLength);
      const cipher = crypto.createCipher(this.algorithm, this.key);
      cipher.setAAD(Buffer.from('audit-evidence', 'utf8'));
      
      let encrypted = cipher.update(data, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      const tag = cipher.getAuthTag();
      
      return {
        encrypted,
        iv: iv.toString('hex'),
        tag: tag.toString('hex')
      };
    } catch (error) {
      throw new Error(`Encryption failed: ${error.message}`);
    }
  }

  /**
   * Decrypt data using AES-256-GCM
   * @param {Object} encryptedData - Object containing encrypted data, IV, and tag
   * @returns {string} - Decrypted data
   */
  decrypt(encryptedData) {
    try {
      const { encrypted, iv, tag } = encryptedData;
      const decipher = crypto.createDecipher(this.algorithm, this.key);
      
      decipher.setAuthTag(Buffer.from(tag, 'hex'));
      decipher.setAAD(Buffer.from('audit-evidence', 'utf8'));
      
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      throw new Error(`Decryption failed: ${error.message}`);
    }
  }

  /**
   * Generate SHA-256 hash
   * @param {string|Buffer} data - Data to hash
   * @returns {string} - SHA-256 hash in hex format
   */
  generateHash(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Verify SHA-256 hash
   * @param {string|Buffer} data - Original data
   * @param {string} hash - Hash to verify against
   * @returns {boolean} - True if hash matches
   */
  verifyHash(data, hash) {
    const computedHash = this.generateHash(data);
    return crypto.timingSafeEqual(Buffer.from(computedHash), Buffer.from(hash));
  }

  /**
   * Generate secure random token
   * @param {number} length - Token length in bytes
   * @returns {string} - Random token in hex format
   */
  generateToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }
}

module.exports = new CryptoUtils();