# Simplest Fix: Store chat_id in Retell's metadata and retrieve it

## The Problem
Line 62 in current workflow: We call `/create-chat` every time, which creates a NEW session.

## The Fix
Use phone number as a unique identifier and check if a chat already exists.

## Immediate Solution (Using Static Variables in n8n)

Since n8n doesn't have persistent storage built-in easily, the **fastest solution** is to use:

### **Option A: Use n8n's Sticky Notes + Code Node (Temporary Testing)**
Just for testing - add a Code node that maintains a JavaScript object.

### **Option B: Use JSONbin.io (Free, No Setup)**
Free API to store JSON data - perfect for our use case!

1. Go to https://jsonbin.io
2. Create a free account
3. Create a bin with:
```json
{
  "sessions": {}
}
```
4. Get your API key and Bin ID
5. Use HTTP nodes to GET/UPDATE the sessions

### **Option C: Use Supabase (Best for Production)**

Create this table in Supabase:

```sql
CREATE TABLE whatsapp_sessions (
  phone_number TEXT PRIMARY KEY,
  chat_id TEXT NOT NULL,
  customer_name TEXT,
  last_updated TIMESTAMP DEFAULT NOW()
);
```

Then update the workflow to:
1. **On form submit**: INSERT chat session
2. **On message receive**: SELECT chat_id by phone number
3. Use existing chat_id or create new one

## I recommend Supabase - do you have a Supabase project already?

If yes, I can create the table and update the workflow right now.
If no, we can use JSONbin.io as a quick temporary solution.