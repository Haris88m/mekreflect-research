CREATE TABLE IF NOT EXISTS consultations (
 id TEXT PRIMARY KEY, created_at TEXT NOT NULL, expires_at TEXT NOT NULL,
 name TEXT NOT NULL, email TEXT NOT NULL, organization TEXT NOT NULL,
 topic TEXT NOT NULL, message TEXT NOT NULL, consent_version TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'requested', withdrawal_hash TEXT NOT NULL UNIQUE
);
CREATE INDEX IF NOT EXISTS consultations_expiry ON consultations(expires_at);
CREATE TABLE IF NOT EXISTS subscriptions (
 id TEXT PRIMARY KEY, created_at TEXT NOT NULL, expires_at TEXT NOT NULL,
 name TEXT NOT NULL, email TEXT NOT NULL, consent_version TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'pending_confirmation', withdrawal_hash TEXT NOT NULL UNIQUE
);
CREATE INDEX IF NOT EXISTS subscriptions_expiry ON subscriptions(expires_at);
CREATE TABLE IF NOT EXISTS request_limits (
 key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS request_limits_expiry ON request_limits(expires_at);
CREATE TABLE IF NOT EXISTS source_snapshots (
 source_id TEXT PRIMARY KEY, fetched_at TEXT NOT NULL, checked_at TEXT NOT NULL,
 source_url TEXT NOT NULL, status TEXT NOT NULL, payload TEXT NOT NULL,
 error TEXT
);
CREATE TABLE IF NOT EXISTS refresh_log (
 id TEXT PRIMARY KEY, started_at TEXT NOT NULL, completed_at TEXT,
 status TEXT NOT NULL, detail TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS refresh_log_time ON refresh_log(started_at);
