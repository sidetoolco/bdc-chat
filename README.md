# WhatsApp to Retell AI Bridge

This integration connects WhatsApp (via 360dialog) with Retell AI's chat agent, enabling text-based conversations.

## Architecture

```
WhatsApp User → 360dialog → n8n Webhook → Retell AI Chat Agent → Response back to WhatsApp
```

## Setup Instructions

### 1. n8n Setup

1. Import `n8n-workflow.json` into your n8n instance
2. Activate the workflow
3. Copy the webhook URL from the "Webhook - Receive WhatsApp Message" node
   - It will look like: `https://your-n8n-instance.com/webhook/whatsapp-webhook`

### 2. Configure 360dialog Webhook

1. Log into your 360dialog account
2. Go to Webhook settings
3. Set the webhook URL to your n8n webhook URL
4. Save the configuration

### 3. Environment Variables

The workflow uses these credentials (already configured in the workflow):

- **360dialog API Key**: `TCQwEr6tgVdcijqE1WLpcu5LAK`
- **Retell API Key**: `key_3ca65c9afda484a7ad1061596d14`
- **Retell Agent ID**: `agent_627fe1d68a83076772b3551df4`
- **Retell Conversation Flow**: `conversation_flow_51a24ed50a77`

## How It Works

### Inbound Message Flow:

1. **User sends WhatsApp message** → 360dialog receives it
2. **360dialog webhook** → Triggers n8n workflow
3. **n8n parses message** → Extracts text and user info
4. **Create Retell chat session** → New conversation instance
5. **Send message to Retell** → Agent processes the message
6. **Extract agent response** → Get reply from Retell
7. **Send via 360dialog** → User receives response on WhatsApp

### Message Format

**Incoming from WhatsApp (360dialog format):**
```json
{
  "messages": [{
    "from": "14155551234",
    "id": "wamid.xxx",
    "timestamp": "1234567890",
    "text": {
      "body": "Hello, I have a question"
    },
    "type": "text"
  }],
  "contacts": [{
    "profile": {
      "name": "John Doe"
    },
    "wa_id": "14155551234"
  }]
}
```

**Outgoing to WhatsApp (360dialog format):**
```json
{
  "messaging_product": "whatsapp",
  "recipient_type": "individual",
  "to": "14155551234",
  "type": "text",
  "text": {
    "body": "Hi! How can I help you today?"
  }
}
```

## Improvements & Enhancements

### Session Management
The current implementation creates a new Retell chat session for each message. For better conversation continuity, you should:

1. Store `chat_id` mapped to `from_number` in a database
2. Reuse existing `chat_id` for continuing conversations
3. Set session timeout to end chats after inactivity

### Add to workflow:
```javascript
// Check if user has an active session
const userId = $json.from_number;
// Query your database for existing chat_id
// If found, use it; if not, create new session
```

### Error Handling
Add error handling nodes to catch:
- Retell API failures
- 360dialog delivery failures
- Invalid message formats

### Message Types
Extend to support:
- Images
- Documents
- Location sharing
- Quick reply buttons (360dialog interactive messages)

### Webhook Verification
Add 360dialog webhook verification for security:
```javascript
// Verify webhook signature
const signature = $request.headers['x-hub-signature'];
// Validate against your webhook secret
```

## Testing

1. Send a WhatsApp message to your 360dialog number
2. Check n8n execution logs for the workflow
3. Verify the response is delivered back to WhatsApp

## Monitoring

Monitor these metrics:
- n8n workflow execution success rate
- Retell API response times
- 360dialog message delivery status
- Chat session durations

## Troubleshooting

### Messages not reaching n8n
- Verify 360dialog webhook URL is correct
- Check n8n webhook is active and accessible
- Review 360dialog webhook logs

### No response from Retell
- Verify API key is valid
- Check agent ID exists
- Review Retell dashboard for errors

### Response not delivered to WhatsApp
- Check 360dialog API key
- Verify phone number format (E.164)
- Review 360dialog delivery status

## Cost Considerations

- **Retell**: Charged per message/token
- **360dialog**: Charged per conversation session
- **n8n**: Free for self-hosted, usage-based for cloud

## Future Enhancements

1. **Persistent Sessions**: Store chat history in database
2. **Multi-agent Routing**: Route to different agents based on context
3. **Rich Media**: Support images, PDFs, voice notes
4. **Analytics**: Track conversation metrics
5. **Fallback Handling**: Human handoff for complex queries