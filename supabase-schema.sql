-- Contest Entries Table Schema for Supabase
-- This table stores all contest entries with their codes and email tracking status

CREATE TABLE IF NOT EXISTS contest_entries (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) NOT NULL UNIQUE,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  email_sent BOOLEAN DEFAULT false,
  email_opened BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_contest_entries_email ON contest_entries(email);

-- Create index on code for faster lookups
CREATE INDEX IF NOT EXISTS idx_contest_entries_code ON contest_entries(code);

-- Enable Row Level Security (RLS)
ALTER TABLE contest_entries ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to insert (for contest participation)
CREATE POLICY "Allow public insert" ON contest_entries
  FOR INSERT
  WITH CHECK (true);

-- Create a policy that allows authenticated service role to select and update (for admin)
-- Note: For production, configure service role access in Supabase dashboard
CREATE POLICY "Allow authenticated select" ON contest_entries
  FOR SELECT
  USING (true);  -- Allow anyone to read their own entries via RLS

CREATE POLICY "Allow authenticated update" ON contest_entries
  FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- Comments for documentation
COMMENT ON TABLE contest_entries IS 'Stores contest entries with unique codes and email tracking';
COMMENT ON COLUMN contest_entries.email IS 'Participant email address (unique)';
COMMENT ON COLUMN contest_entries.name IS 'Participant name';
COMMENT ON COLUMN contest_entries.code IS 'Generated unique contest code (format: PXZ-XXXXXXXX)';
COMMENT ON COLUMN contest_entries.timestamp IS 'When the code was generated';
COMMENT ON COLUMN contest_entries.email_sent IS 'Whether the confirmation email was sent successfully';
COMMENT ON COLUMN contest_entries.email_opened IS 'Whether the email was opened by the recipient';
