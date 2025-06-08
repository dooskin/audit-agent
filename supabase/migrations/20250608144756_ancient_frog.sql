-- Initialize database schema for audit evidence service

-- Create database if it doesn't exist
-- This is handled by Docker Compose postgres service

-- Create artifacts table
CREATE TABLE IF NOT EXISTS artifacts (
    id SERIAL PRIMARY KEY,
    artifact_id UUID UNIQUE NOT NULL,
    tenant_id UUID NOT NULL,
    artifact_type VARCHAR(100) NOT NULL,
    s3_uri TEXT NOT NULL,
    sha256_hash VARCHAR(64) NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_artifacts_tenant_id ON artifacts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_artifacts_created_at ON artifacts(created_at);
CREATE INDEX IF NOT EXISTS idx_artifacts_artifact_type ON artifacts(artifact_type);

-- Create audit log table
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    artifact_id UUID REFERENCES artifacts(artifact_id),
    action VARCHAR(50) NOT NULL,
    user_id VARCHAR(100),
    ip_address INET,
    user_agent TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for audit logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_artifact_id ON audit_logs(artifact_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_artifacts_updated_at 
    BEFORE UPDATE ON artifacts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions (adjust as needed for your setup)
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO audit_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO audit_user;