/*
  # AWS Audit Evidence Collection Database Schema

  1. New Tables
    - `evidence_records`
      - `id` (serial, primary key)
      - `artifact_id` (uuid, unique)
      - `tenant_id` (varchar, indexed)
      - `artifact_type` (varchar, indexed)
      - `collection_types` (text)
      - `s3_uri` (text)
      - `s3_key` (text)
      - `sha256_hash` (varchar)
      - `encryption_metadata` (jsonb)
      - `collected_by` (varchar, indexed)
      - `collection_metadata` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `audit_logs`
      - `id` (serial, primary key)
      - `event_type` (varchar, indexed)
      - `user_id` (varchar, indexed)
      - `tenant_id` (varchar, indexed)
      - `artifact_id` (uuid)
      - `event_data` (jsonb)
      - `ip_address` (inet)
      - `user_agent` (text)
      - `created_at` (timestamptz, indexed)

  2. Security
    - Enable RLS on both tables
    - Add policies for tenant-based access control
    - Add policies for audit log access

  3. Indexes
    - Performance indexes on frequently queried columns
    - Composite indexes for common query patterns
*/

-- Create evidence_records table
CREATE TABLE IF NOT EXISTS evidence_records (
  id SERIAL PRIMARY KEY,
  artifact_id UUID UNIQUE NOT NULL,
  tenant_id VARCHAR(100) NOT NULL,
  artifact_type VARCHAR(50) NOT NULL,
  collection_types TEXT,
  s3_uri TEXT NOT NULL,
  s3_key TEXT NOT NULL,
  sha256_hash VARCHAR(64) NOT NULL,
  encryption_metadata JSONB NOT NULL,
  collected_by VARCHAR(100) NOT NULL,
  collection_metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  event_type VARCHAR(50) NOT NULL,
  user_id VARCHAR(100),
  tenant_id VARCHAR(100),
  artifact_id UUID,
  event_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for evidence_records
CREATE INDEX IF NOT EXISTS idx_evidence_tenant_id ON evidence_records(tenant_id);
CREATE INDEX IF NOT EXISTS idx_evidence_artifact_type ON evidence_records(artifact_type);
CREATE INDEX IF NOT EXISTS idx_evidence_created_at ON evidence_records(created_at);
CREATE INDEX IF NOT EXISTS idx_evidence_collected_by ON evidence_records(collected_by);
CREATE INDEX IF NOT EXISTS idx_evidence_tenant_created ON evidence_records(tenant_id, created_at DESC);

-- Create indexes for audit_logs
CREATE INDEX IF NOT EXISTS idx_audit_event_type ON audit_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_audit_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_tenant_id ON audit_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_tenant_created ON audit_logs(tenant_id, created_at DESC);

-- Enable Row Level Security
ALTER TABLE evidence_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for evidence_records
CREATE POLICY "Users can read own tenant evidence"
  ON evidence_records
  FOR SELECT
  TO authenticated
  USING (
    tenant_id = (auth.jwt() ->> 'tenant_id')::text
    OR 
    'admin' = ANY(string_to_array(auth.jwt() ->> 'scope', ' '))
  );

CREATE POLICY "Users can insert own tenant evidence"
  ON evidence_records
  FOR INSERT
  TO authenticated
  WITH CHECK (
    tenant_id = (auth.jwt() ->> 'tenant_id')::text
    OR 
    'admin' = ANY(string_to_array(auth.jwt() ->> 'scope', ' '))
  );

CREATE POLICY "Admins can update evidence"
  ON evidence_records
  FOR UPDATE
  TO authenticated
  USING (
    'admin' = ANY(string_to_array(auth.jwt() ->> 'scope', ' '))
  );

CREATE POLICY "Admins can delete evidence"
  ON evidence_records
  FOR DELETE
  TO authenticated
  USING (
    'admin' = ANY(string_to_array(auth.jwt() ->> 'scope', ' '))
  );

-- RLS Policies for audit_logs
CREATE POLICY "Users can read own tenant audit logs"
  ON audit_logs
  FOR SELECT
  TO authenticated
  USING (
    tenant_id = (auth.jwt() ->> 'tenant_id')::text
    OR 
    'admin' = ANY(string_to_array(auth.jwt() ->> 'scope', ' '))
  );

CREATE POLICY "Service can insert audit logs"
  ON audit_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for evidence_records
CREATE TRIGGER update_evidence_records_updated_at
  BEFORE UPDATE ON evidence_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to validate evidence integrity
CREATE OR REPLACE FUNCTION validate_evidence_integrity()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate SHA-256 hash format
  IF NEW.sha256_hash !~ '^[a-f0-9]{64}$' THEN
    RAISE EXCEPTION 'Invalid SHA-256 hash format';
  END IF;
  
  -- Validate encryption metadata structure
  IF NOT (NEW.encryption_metadata ? 'algorithm' AND 
          NEW.encryption_metadata ? 'iv' AND 
          NEW.encryption_metadata ? 'auth_tag') THEN
    RAISE EXCEPTION 'Invalid encryption metadata structure';
  END IF;
  
  -- Validate S3 URI format
  IF NEW.s3_uri !~ '^https://.*\.s3\..*\.amazonaws\.com/.*' THEN
    RAISE EXCEPTION 'Invalid S3 URI format';
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create validation trigger
CREATE TRIGGER validate_evidence_integrity_trigger
  BEFORE INSERT OR UPDATE ON evidence_records
  FOR EACH ROW
  EXECUTE FUNCTION validate_evidence_integrity();

-- Create function for audit logging
CREATE OR REPLACE FUNCTION log_evidence_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit_logs (
      event_type, user_id, tenant_id, artifact_id, event_data
    ) VALUES (
      'EVIDENCE_CREATED',
      NEW.collected_by,
      NEW.tenant_id,
      NEW.artifact_id,
      jsonb_build_object(
        'artifact_type', NEW.artifact_type,
        'collection_types', NEW.collection_types,
        's3_uri', NEW.s3_uri
      )
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_logs (
      event_type, user_id, tenant_id, artifact_id, event_data
    ) VALUES (
      'EVIDENCE_UPDATED',
      NEW.collected_by,
      NEW.tenant_id,
      NEW.artifact_id,
      jsonb_build_object(
        'changes', jsonb_build_object(
          'old', to_jsonb(OLD),
          'new', to_jsonb(NEW)
        )
      )
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO audit_logs (
      event_type, user_id, tenant_id, artifact_id, event_data
    ) VALUES (
      'EVIDENCE_DELETED',
      OLD.collected_by,
      OLD.tenant_id,
      OLD.artifact_id,
      jsonb_build_object(
        'deleted_record', to_jsonb(OLD)
      )
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

-- Create audit trigger
CREATE TRIGGER evidence_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON evidence_records
  FOR EACH ROW
  EXECUTE FUNCTION log_evidence_changes();

-- Create view for evidence summary
CREATE OR REPLACE VIEW evidence_summary AS
SELECT 
  tenant_id,
  artifact_type,
  COUNT(*) as total_records,
  MIN(created_at) as first_collection,
  MAX(created_at) as last_collection,
  COUNT(DISTINCT collected_by) as unique_collectors,
  SUM(CASE WHEN created_at >= NOW() - INTERVAL '24 hours' THEN 1 ELSE 0 END) as last_24h_count,
  SUM(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 ELSE 0 END) as last_7d_count
FROM evidence_records
GROUP BY tenant_id, artifact_type;

-- Grant permissions for the view
GRANT SELECT ON evidence_summary TO authenticated;

-- Create RLS policy for the view
CREATE POLICY "Users can read own tenant summary"
  ON evidence_summary
  FOR SELECT
  TO authenticated
  USING (
    tenant_id = (auth.jwt() ->> 'tenant_id')::text
    OR 
    'admin' = ANY(string_to_array(auth.jwt() ->> 'scope', ' '))
  );