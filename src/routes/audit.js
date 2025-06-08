const express = require('express');
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const awsService = require('../services/awsService');
const storageService = require('../services/storageService');
const databaseService = require('../services/databaseService');
const logger = require('../utils/logger');

const router = express.Router();

// Validation schema for AWS collection request
const awsCollectionSchema = Joi.object({
  tenant_id: Joi.string().uuid().required(),
  aws_role_arn: Joi.string().pattern(/^arn:aws:iam::\d{12}:role\/[\w+=,.@-]+$/).required(),
  external_id: Joi.string().min(1).max(1224).required()
});

/**
 * POST /collect/aws
 * Collect AWS audit evidence
 */
router.post('/aws', async (req, res) => {
  try {
    // Validate request body
    const { error, value } = awsCollectionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation Error',
        message: error.details[0].message,
        requestId: req.id
      });
    }

    const { tenant_id, aws_role_arn, external_id } = value;
    const artifact_id = uuidv4();

    logger.info('Starting AWS evidence collection', {
      requestId: req.id,
      tenantId: tenant_id,
      artifactId: artifact_id,
      roleArn: aws_role_arn
    });

    // Assume AWS role and collect evidence
    const credentials = await awsService.assumeRole(aws_role_arn, external_id);
    const evidenceData = await awsService.collectEvidence(credentials);

    // Process and store evidence
    const { s3_uri, sha256_hash } = await storageService.storeEvidence(
      artifact_id,
      evidenceData,
      tenant_id
    );

    // Record metadata in database
    await databaseService.recordArtifact({
      artifact_id,
      tenant_id,
      artifact_type: 'aws_audit_evidence',
      s3_uri,
      sha256_hash,
      metadata: {
        role_arn: aws_role_arn,
        external_id,
        collection_timestamp: new Date().toISOString(),
        evidence_types: ['iam_users', 'cloudtrail_events']
      }
    });

    logger.info('AWS evidence collection completed', {
      requestId: req.id,
      tenantId: tenant_id,
      artifactId: artifact_id,
      s3Uri: s3_uri,
      hash: sha256_hash
    });

    res.status(201).json({
      artifact_id,
      sha256_hash,
      message: 'Evidence collection completed successfully'
    });

  } catch (error) {
    logger.error('AWS evidence collection failed', {
      requestId: req.id,
      error: error.message,
      stack: error.stack
    });

    if (error.name === 'AccessDenied') {
      return res.status(403).json({
        error: 'Access Denied',
        message: 'Unable to assume AWS role or access required resources',
        requestId: req.id
      });
    }

    if (error.name === 'InvalidRole') {
      return res.status(400).json({
        error: 'Invalid Role',
        message: 'The specified AWS role ARN is invalid or inaccessible',
        requestId: req.id
      });
    }

    res.status(500).json({
      error: 'Collection Failed',
      message: 'Evidence collection encountered an error',
      requestId: req.id
    });
  }
});

module.exports = router;