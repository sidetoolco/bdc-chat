# WhatsApp to Retell Session Management

## Architecture Overview

The system maintains conversation context by mapping WhatsApp phone numbers to Retell chat_id values in Supabase.

## Database Schema
```sql
CREATE TABLE whatsapp_sessions (
  chat_id TEXT PRIMARY KEY,
  phone_number TEXT NOT NULL,
  customer_name TEXT,
  debt_amount TEXT,
  due_date TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  last_message_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_phone_number ON whatsapp_sessions(phone_number);
CREATE INDEX idx_last_message ON whatsapp_sessions(last_message_at DESC);
```

## Flow 1: Form Submission (New Session)

**Purpose**: Create initial chat session and send first message

```
Form Submit
  ↓
Format Data (clean phone number)
  ↓
Create Retell Chat (/create-chat)
  ├─ Returns: chat_id
  ├─ Includes: metadata (customer_name, debt_amount, due_date)
  ↓
Store in Supabase (phone_number → chat_id mapping)
  ↓
Get AI Greeting (/create-chat-completion)
  ├─ Input: chat_id, content: "Hola"
  ├─ Returns: messages array with agent response
  ↓
Extract Greeting (get agent message content)
  ↓
Send to WhatsApp (360dialog API)
  ↓
Success Response
```

## Flow 2: Customer Reply (Continue Session)

**Purpose**: Continue existing conversation or create new session

```
WhatsApp Webhook
  ↓
Filter (only text messages)
  ↓
Parse WhatsApp Data
  ├─ Extract: from_number, message_text, contact_name, wa_id
  ↓
Lookup Session in Supabase
  ├─ Query: ?phone_number=eq.{number}&order=last_message_at.desc&limit=1
  ├─ Gets most recent session for this phone number
  ↓
Check Session (has chat_id?)
  ├─ Yes: Use Existing Session
  │   ├─ Update last_message_at timestamp
  │   └─ Use existing chat_id
  │
  └─ No: Create New Session
      ├─ Call /create-chat
      ├─ Store new chat_id in Supabase
      └─ Use new chat_id
  ↓
Get AI Response (/create-chat-completion)
  ├─ Input: chat_id, content: {user_message}
  ├─ Returns: messages array
  ↓
Extract Response (get agent message)
  ↓
Send to WhatsApp
  ↓
Success Response
```

## Critical Points for Context Preservation

1. **Always use the SAME chat_id** for the same conversation
2. **Lookup by phone_number** to find existing sessions
3. **Order by last_message_at DESC** to get most recent session
4. **Update last_message_at** on each message to track active sessions
5. **Use /create-chat-completion** NOT /create-chat for continuing conversations

## Why Context Gets Lost

❌ **Wrong**: Creating new chat_id for every message
✅ **Right**: Reuse chat_id from Supabase lookup

❌ **Wrong**: Using /create-chat for every message
✅ **Right**: Use /create-chat once, then /create-chat-completion for all subsequent messages

❌ **Wrong**: Not storing or looking up chat_id
✅ **Right**: Store in Supabase, lookup before each response

## Debugging Steps

1. Check if chat_id is stored in Supabase after form submission
2. Verify customer reply triggers Supabase lookup
3. Confirm lookup returns the correct chat_id
4. Ensure /create-chat-completion uses the found chat_id
5. Check that Retell returns conversation history in responses