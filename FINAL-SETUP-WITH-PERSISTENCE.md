# Final Setup: WhatsApp-Retell with Session Persistence

## What Was Fixed

**Problem**: Every customer reply created a NEW Retell session, causing the AI to restart and ask "¿Me comunico con {{name}}?" every time.

**Solution**: Store `phone_number → chat_id` mapping in Supabase, so conversations continue seamlessly.

---

## Setup Steps

### Step 1: Create Supabase Table

1. Go to https://supabase.com/dashboard/project/kkcqrobubmtpehagzuox
2. Click **SQL Editor**
3. Run this SQL:

```sql
CREATE TABLE IF NOT EXISTS whatsapp_sessions (
  phone_number TEXT PRIMARY KEY,
  chat_id TEXT NOT NULL,
  customer_name TEXT,
  debt_amount TEXT,
  due_date TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  last_message_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_id ON whatsapp_sessions(chat_id);

ALTER TABLE whatsapp_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all operations" ON whatsapp_sessions;
CREATE POLICY "Allow all operations" ON whatsapp_sessions
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

4. Verify with: `SELECT * FROM whatsapp_sessions;`

### Step 2: Import New n8n Workflow

1. Open n8n at https://sidetool.app.n8n.cloud
2. **Delete** the current "WhatsApp-Retell Complete Integration" workflow
3. Click **Import from File**
4. Select `n8n-workflow-SUPABASE.json`
5. **Activate** the workflow

### Step 3: Test the Integration

#### Test 1: Send initial message
1. Open https://bdc-chat.vercel.app (or your Vercel URL)
2. Fill form with your WhatsApp number
3. Submit
4. You should receive WhatsApp message

#### Test 2: Reply and continue conversation
1. Reply "Si" to the WhatsApp message
2. You should get: "Hola Ed. Soy Pilar, agente virtual del Banco de Córdoba..."
3. Reply again: "Quiero pagar"
4. **Check**: AI should continue the conversation, NOT restart

#### Test 3: Verify in Supabase
1. Go to Supabase dashboard
2. Table Editor → whatsapp_sessions
3. You should see entries with phone numbers and chat IDs

---

## How It Works

### Flow 1: Form Submission (Initial Message)
```
Form → n8n webhook
  ↓
Format message
  ↓
Create Retell chat session (returns chat_id)
  ↓
Store in Supabase: phone_number → chat_id
  ↓
Send WhatsApp message via 360dialog
```

### Flow 2: Customer Reply (Continuing Conversation)
```
WhatsApp message → 360dialog webhook → n8n
  ↓
Parse phone number
  ↓
Lookup in Supabase: Does this phone have a chat_id?
  ├─ YES: Use existing chat_id (continue conversation)
  └─ NO: Create new chat_id (first message)
  ↓
Send message to Retell with chat_id
  ↓
Get AI response
  ↓
Send response to WhatsApp
```

---

## Key Changes from Old Workflow

| Old | New |
|-----|-----|
| Always create new chat session | Check Supabase first |
| AI restarts every message | AI remembers conversation |
| No persistence | Phone number → chat_id stored |
| "¿Me comunico con Ed?" every time | Continues smoothly |

---

## Supabase Configuration

- **URL**: https://kkcqrobubmtpehagzuox.supabase.co
- **Table**: `whatsapp_sessions`
- **API Key**: Service role key (already in workflow)

---

## Troubleshooting

### Issue: AI still restarting
- Check Supabase table: `SELECT * FROM whatsapp_sessions;`
- Verify your phone number is stored
- Check n8n execution logs for errors

### Issue: "Table does not exist"
- Run the SQL in Supabase dashboard
- Refresh the table editor
- Make sure you're in the correct project

### Issue: Supabase returns 401
- Check that service_role key is correct in workflow
- Verify RLS policy allows all operations

---

## Next Steps

1. ✅ Run SQL in Supabase
2. ✅ Import new workflow
3. ✅ Test with your phone
4. ✅ Verify conversations continue
5. Monitor Supabase table for sessions

---

## Files

- `n8n-workflow-SUPABASE.json` - Import this workflow
- `supabase-setup.sql` - SQL to create table
- `SETUP-SUPABASE-TABLE.md` - Detailed instructions

**All set! The AI will now remember conversations.** 🎉