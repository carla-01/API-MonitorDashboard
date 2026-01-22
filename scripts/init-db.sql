-- Banco de dados API Monitor Dashboard
CREATE TABLE IF NOT EXISTS api_metrics (
    id SERIAL PRIMARY KEY,
    api_name VARCHAR(100) NOT NULL,
    url TEXT NOT NULL,
    endpoint_type VARCHAR(50),
    response_time_ms DECIMAL(10,2),
    status_code INTEGER,
    success BOOLEAN DEFAULT false,
    data_size_bytes INTEGER,
    content_type VARCHAR(100),
    has_error BOOLEAN DEFAULT false,
    error_message TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_api_metrics_api_name ON api_metrics(api_name);
CREATE INDEX IF NOT EXISTS idx_api_metrics_timestamp ON api_metrics(timestamp);
CREATE INDEX IF NOT EXISTS idx_api_metrics_success ON api_metrics(success);

CREATE TABLE IF NOT EXISTS api_configs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    base_url TEXT NOT NULL,
    endpoints JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    check_interval_seconds INTEGER DEFAULT 300,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO api_configs (name, base_url, endpoints) VALUES
ON CONFLICT (name) DO NOTHING;

CREATE OR REPLACE VIEW api_stats AS
SELECT
    api_name,
    COUNT(*) as total_checks,
    AVG(response_time_ms) as avg_response_time,
    SUM(CASE WHEN success THEN 1 ELSE 0 END) as successful_checks,
    (SUM(CASE WHEN success THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) as success_rate
FROM api_metrics
WHERE timestamp > NOW() - INTERVAL '24 hours'
GROUP BY api_name;
