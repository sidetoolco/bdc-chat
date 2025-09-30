# Setup Supabase Table for Session Persistence

## Step 1: Create the Table

Go to your Supabase dashboard:
https://supabase.com/dashboard/project/kkcqrobubmtpehagzuox

Then go to **SQL Editor** and run this:

```sql
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
```

## Step 2: Verify the Table

Run this query to verify:

```sql
SELECT * FROM whatsapp_sessions;
```

You should see an empty table with the columns listed above.

## Step 3: Import the Updated n8n Workflow

The workflow file `n8n-workflow-SUPABASE.json` has been created with:

- **Flow 1 (Form Submission)**: Creates Retell chat session → Stores in Supabase → Sends WhatsApp
- **Flow 2 (Customer Reply)**: Looks up session in Supabase → Uses existing chat_id → Continues conversation

## Supabase Configuration

- **URL**: https://kkcqrobubmtpehagzuox.supabase.co
- **Anon Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrY3Fyb2J1Ym10cGVoYWd6dW94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMDQzMjcsImV4cCI6MjA3NDc4MDMyN30.id3WmZfsIG0h9I1IEbx1SAZa2laiPF9L8AIsf6M6Lo8
- **Service Role Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrY3Fyb2J1Ym10cGVoYWd6dW94Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTIwNDMyNywiZXhwIjoyMDc0NzgwMzI3fQ.uKj_c7_CWEXuLaUeerpP5ALEHjMkBj-NrfUOzPveArM

The workflow uses the **service_role** key for unrestricted access.

## Next Steps

1. Run the SQL in Supabase dashboard
2. Import `n8n-workflow-SUPABASE.json` into n8n
3. Delete the old workflow
4. Activate the new workflow
5. Test by submitting the form and replying to WhatsApp