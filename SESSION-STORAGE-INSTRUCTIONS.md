# Session Persistence Solution for WhatsApp-Retell Integration

## Problem
Every time a customer replies to WhatsApp, we're creating a NEW Retell chat session instead of continuing the existing conversation. This causes the AI to restart and ask "¿Me comunico con {{name}}?" every time.

## Solution Options

### Option 1: Use n8n Database Node (Recommended - Easiest)
n8n has a built-in Postgres database that can store session mappings.

**Steps:**
1. Add **Postgres** node after "Create Chat Session for Form"
2. Store: `phone_number → chat_id` mapping
3. Add **Postgres** node after "Parse WhatsApp Data"
4. Query: Look up `chat_id` by `phone_number`
5. Branch: If found, use existing session; if not, create new

### Option 2: Use Google Sheets
Simple and visual, good for debugging.

**Steps:**
1. Create Google Sheet with columns: `phone_number | chat_id | created_at`
2. Use workflow file: `n8n-workflow-WITH-SESSION-PERSISTENCE.json`
3. Setup Google Sheets OAuth credentials in n8n
4. Replace `YOUR_GOOGLE_SHEETS_CREDENTIAL_ID` in the workflow
5. Set environment variable `GOOGLE_SHEET_ID` with your sheet ID

### Option 3: Use External Database (Supabase)
Most robust solution for production.

**Steps:**
1. Create Supabase table:
   ```sql
   CREATE TABLE chat_sessions (
     id SERIAL PRIMARY KEY,
     phone_number VARCHAR(20) UNIQUE NOT NULL,
     chat_id VARCHAR(100) NOT NULL,
     customer_name VARCHAR(255),
     created_at TIMESTAMP DEFAULT NOW(),
     last_message_at TIMESTAMP DEFAULT NOW()
   );
   ```

2. Add HTTP Request nodes to query/insert sessions
3. Use Supabase REST API or direct Postgres connection

### Option 4: Use Retell's Metadata (Simplest - No DB Needed!)
**This might already work!** Retell may support looking up chat sessions by metadata.

**Check if Retell has:**
- `GET /v1/chat/by-metadata` endpoint
- Ability to query chat by `whatsapp_number` metadata

If yes, we just need to:
1. Try to find existing chat by phone number
2. If not found, create new session
3. Continue the conversation

## Recommended Immediate Fix (No Database)

Use **n8n's execution storage** - store chat_id in a global variable that persists across executions.

### Modified Workflow Logic:

**Flow 1: Form Submission**
```
Form → Create Retell Chat → Store chat_id in metadata → Send WhatsApp
```

**Flow 2: Customer Reply**
```
WhatsApp Message → Parse Phone →
  Try: GET /v1/get-chat?metadata.phone_number={phone} (if Retell supports)
  OR: Use hardcoded lookup object in Code node
  → If found: Continue chat
  → If not found: Create new chat
  → Get AI response → Send to WhatsApp
```

## Testing Current Behavior

Let's check what Retell returns when we create a chat. Look for these fields:
- `chat_id` - we need this
- `session_id` - might be useful
- Any way to query existing chats by metadata

## Action Items

1. **Check Retell API docs** - can we query chats by metadata?
2. **Decide on storage**:
   - Quick test: Use code node with hardcoded object
   - Short term: Google Sheets
   - Production: Supabase/Postgres
3. **Update workflow** with chosen solution
4. **Test** that conversations continue properly

## Quick Test Without Database

Add this code node between "Parse WhatsApp Data" and "Create Retell Session":

```javascript
// In-memory session store (will reset on n8n restart)
const sessionStore = $('Format Message').all().reduce((acc, item) => {
  if (item.json.to && item.json.chat_id) {
    acc[item.json.to] = item.json.chat_id;
  }
  return acc;
}, {});

const phoneNumber = $input.item.json.from_number;
const existingChatId = sessionStore[phoneNumber];

return {
  ...$$input.item.json,
  existing_chat_id: existingChatId,
  has_existing_session: !!existingChatId
};
```

This won't work across executions but helps test the logic.