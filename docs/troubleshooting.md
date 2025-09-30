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

### Possible Causes

#### A. Webhook Receiving Both Sent and Received Messages
WhatsApp may notify your webhook for both incoming (customer → you) and outgoing (you → customer) messages.

**Solution**: Add a filter to only process incoming messages:
- Check if the message is from a customer (not from your business number)
- In WhatsApp webhook payload, look for `message.from` vs your business phone number

#### B. Multiple Webhook Subscriptions
You may have registered the same webhook URL multiple times.

**Solution**: Check 360dialog dashboard for duplicate webhook configurations

#### C. Form Submission Triggering Webhook
If your form sends the initial message and that triggers the webhook, it creates a loop.

**Solution**:
- Use different webhook paths for form vs WhatsApp messages
- Currently: `/whatsapp-trigger` (form) and `/whatsapp-webhook` (messages) ✅

### Debugging Steps

1. **Check n8n execution logs**: See how many times the webhook fires
2. **Check WhatsApp payload**: Look for `message.from` field
3. **Add logging**: In "Parse WhatsApp Data" node, log the full payload
4. **Test timing**: Submit form, wait 30 seconds, then reply - if duplicates appear immediately, it's not a loop

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