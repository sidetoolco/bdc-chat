-- Drop the old table if it exists
DROP TABLE IF EXISTS whatsapp_sessions;

-- Create new table with chat_id as primary key
CREATE TABLE whatsapp_sessions (
  chat_id TEXT PRIMARY KEY,
  phone_number TEXT NOT NULL,
  customer_name TEXT,
  debt_amount TEXT,
  due_date TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  last_message_at TIMESTAMP DEFAULT NOW()
);

-- Create index on phone_number for fast lookups
CREATE INDEX idx_phone_number ON whatsapp_sessions(phone_number);

-- Create index on last_message_at for sorting recent conversations
CREATE INDEX idx_last_message ON whatsapp_sessions(last_message_at DESC);

-- Enable RLS
ALTER TABLE whatsapp_sessions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations
CREATE POLICY "Allow all operations" ON whatsapp_sessions
  FOR ALL USING (true) WITH CHECK (true);