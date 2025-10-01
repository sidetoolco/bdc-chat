# Troubleshooting Guide

## Issue 1: Template Variables Not Replaced

### Symptoms
Messages show `{{greeting}}`, `{{name}}`, `{{amount}}`, `{{due_date}}` literally instead of actual values.

### Solution
1. **Check Retell Agent Prompt**: Go to Retell dashboard and ensure your agent's prompt uses the exact variable names you're passing
2. **Verify Dynamic Variables**: In n8n "Create Chat" node, check the output shows:
   ```json
   {
     "retell_llm_dynamic_variables": {
       "greeting": "Hola",
       "name": "Ed",
       "amount": "1000.00",
       "due_date": "2025-10-30"
     }
   }
   ```
3. **Variable Name Matching**: Template `{{name}}` must match key `"name"` in dynamic variables
4. **Retell Agent Configuration**: Some Retell agents require you to declare dynamic variables in the agent settings first

### Testing Steps
1. Delete old sessions from Supabase
2. Submit new form
3. Check Retell dashboard logs to see if variables were received
4. Test conversation

## Issue 2: Duplicate Messages

### Symptoms
AI sends the same message twice when customer replies.

### Root Cause
WhatsApp API sends webhook notifications for:
1. **Incoming messages** (customer → you) - has `value.messages` array
2. **Status updates** (delivery/read receipts for messages YOU sent) - has `value.statuses` array

Both types trigger your webhook, causing duplicate processing.

### Solution ✅ FIXED
The workflow now filters out status updates:

**Filter - Only Text node** checks:
```javascript
// Only process if messages array exists AND it's a text message
value.messages exists && value.messages[0].type === "text"
```

This prevents:
- Status updates (has `value.statuses` instead of `value.messages`)
- Non-text messages (images, audio, etc.)

### Possible Other Causes

#### A. Multiple Webhook Subscriptions
You may have registered the same webhook URL multiple times.

**Solution**: Check 360dialog dashboard for duplicate webhook configurations

#### B. Form Submission Triggering Webhook
If your form sends the initial message and that triggers the webhook, it creates a loop.

**Solution**:
- Use different webhook paths for form vs WhatsApp messages
- Currently: `/whatsapp-trigger` (form) and `/whatsapp-webhook` (messages) ✅

### Debugging Steps

1. **Check n8n execution logs**: See what triggers each execution
2. **Look for `value.statuses`**: If present, it's a status update (should be ignored)
3. **Look for `value.messages`**: If present, it's an incoming message (should be processed)
4. **Test**: Send one message and watch for two webhook calls - one with messages, one with statuses

### Common Error: Cannot Read Properties of Undefined

**Error message**: `Cannot read properties of undefined (reading '0') [line 5]`

**Location**: Parse WhatsApp Data node

**Root cause**: The webhook received a status update (has `value.statuses`, no `value.messages`), but Parse WhatsApp Data tried to access `value.messages[0]`.

**Why it happens**:
- WhatsApp sends webhook for EVERY event: incoming messages AND status updates
- Status updates (delivery/read receipts) don't have `value.messages` array
- If pinned test data contains a status update, it will fail

**Solution**: The "Filter - Only Text Messages" node already prevents this by checking:
```javascript
value.messages exists && value.messages[0].type === "text"
```

**Important**: Do NOT pin status update data for testing. Use actual incoming message data.

## Issue 3: Context Not Maintained

### Symptoms
AI doesn't remember previous messages, restarts conversation each time.

### Solution
1. **Check Supabase**: Verify chat_id is stored and retrieved correctly
2. **Check "Has Existing Session?" node**: Should show `has_session: true` for returning customers
3. **Verify API parameter**: Must use `"content"` not `"message"` in `/create-chat-completion`

### Debugging Steps
```sql
-- Check stored sessions
SELECT * FROM whatsapp_sessions ORDER BY last_message_at DESC;

-- Check if lookup is working
SELECT * FROM whatsapp_sessions WHERE phone_number = '17048169059';
```

## Issue 4: Multiple Messages on Form Submit

### Symptoms
Customer receives 2-3 messages immediately after form submission.

### Solution
The form flow should:
1. Create chat session
2. Store in Supabase
3. Send ONE simple message ("Hola")
4. Wait for customer to reply

**Check**: The "Get AI Greeting" node should NOT be present in the form flow. If it is, remove it.

## Issue 5: Variables Work for First Message Only

### Symptoms
First message has correct values, but subsequent messages show templates again.

### Cause
Dynamic variables are set when you call `/create-chat`, and they persist throughout that chat session. If they're not persisting, the agent might be creating a new session.

### Solution
Ensure the agent's prompt uses the variables consistently throughout the conversation, not just in the first message.

## Quick Checklist

- [ ] Retell agent prompt uses `{{name}}`, `{{amount}}`, `{{due_date}}`
- [ ] n8n "Create Chat" includes `retell_llm_dynamic_variables`
- [ ] Supabase has chat_id stored
- [ ] Webhook only processes incoming messages (not sent)
- [ ] Using `"content"` parameter in `/create-chat-completion`
- [ ] Form flow sends only ONE message
- [ ] No duplicate webhook subscriptions

## Getting Help

1. Export n8n execution logs
2. Check Retell dashboard for chat logs
3. Query Supabase for session data
4. Share specific error messages or unexpected behavior