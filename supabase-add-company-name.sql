-- Add company_name column to whatsapp_sessions table
ALTER TABLE whatsapp_sessions ADD COLUMN IF NOT EXISTS company_name TEXT;

-- Verify the column was added
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'whatsapp_sessions';
