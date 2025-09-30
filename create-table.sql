-- Create table for storing WhatsApp chat sessions
CREATE TABLE IF NOT EXISTS whatsapp_sessions (
  phone_number TEXT PRIMARY KEY,
  chat_id TEXT NOT NULL,
  customer_name TEXT,
  debt_amount TEXT,
  due_date TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  last_message_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_chat_id ON whatsapp_sessions(chat_id);

-- Enable Row Level Security
ALTER TABLE whatsapp_sessions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations
DROP POLICY IF EXISTS "Allow all operations" ON whatsapp_sessions;
CREATE POLICY "Allow all operations" ON whatsapp_sessions
  FOR ALL
  USING (true)
  WITH CHECK (true);
