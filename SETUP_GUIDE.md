# Complete Setup Guide: WhatsApp to Retell AI Bridge

## ✅ What You Already Have

1. **360dialog Account**: Active and ready
   - Phone Number: `+1 (555) 887-5639`
   - Channel ID: `0efYEuCH`
   - WABA ID: `j5PaKMWA`

2. **n8n Workflow**: Imported and configured
   - Webhook URL: `https://sidetool.app.n8n.cloud/webhook/whatsapp-webhook`

3. **Retell AI**: Configured
   - API Key: `key_3ca65c9afda484a7ad1061596d14`
   - Agent ID: `agent_627fe1d68a83076772b3551df4`

## 🔧 Setup Steps

### Step 1: Generate/Get Your 360dialog API Key

The API key `TCQwEr6tgVdcijqE1WLpcu5LAK` needs to be verified or regenerated.

**Option A: Via 360dialog Dashboard**
1. Go to https://hub.360dialog.com (or your 360dialog portal URL)
2. Login with `ed@sidetool.co`
3. Navigate to **API Keys** section
4. Click **"Generate API Key"** or view existing key
5. Copy the API key

**Option B: You may already have the correct key**
- The key you provided might work for webhook setup
- We'll test it in Step 2

### Step 2: Configure Webhook via API

Once you have confirmed your API key, run this command:

```bash
curl -X POST 'https://waba-v2.360dialog.io/v1/configs/webhook' \
  -H "D360-API-KEY: YOUR_ACTUAL_API_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://sidetool.app.n8n.cloud/webhook/whatsapp-webhook"
  }'
```

**Expected Response (Success):**
```json
{
  "url": "https://sidetool.app.n8n.cloud/webhook/whatsapp-webhook"
}
```

**Verify it worked:**
```bash
curl -X GET 'https://waba-v2.360dialog.io/v1/configs/webhook' \
  -H "D360-API-KEY: YOUR_ACTUAL_API_KEY_HERE" \
  -H "Content-Type: application/json"
```

### Step 3: Activate Your n8n Workflow

1. Open your n8n instance
2. Go to your imported workflow: "WhatsApp to Retell AI Bridge"
3. **Toggle the workflow to ACTIVE** (switch in top right)
4. Verify the webhook URL is correct in the first node

### Step 4: Test the Integration

1. **Send a test message** from your personal WhatsApp to: `+1 (555) 887-5639`
2. **Send any text**, for example: "Hello"

**What should happen:**
- 360dialog receives your message
- Sends it to n8n webhook
- n8n creates a Retell chat session
- Retell processes your message
- Retell's response is sent back via 360dialog
- You receive the AI response on WhatsApp

### Step 5: Monitor & Debug

**Check n8n Executions:**
1. Open n8n
2. Go to "Executions" tab
3. You should see successful executions when messages come in

**Check Retell Dashboard:**
1. Go to Retell dashboard
2. Check "Chats" section
3. You should see new chat sessions being created

**Common Issues:**

| Issue | Solution |
|-------|----------|
| No webhook triggers in n8n | Check webhook URL is correct in 360dialog |
| n8n triggers but no Retell response | Check Retell API key and Agent ID |
| No response sent back to WhatsApp | Check 360dialog API key in n8n |
| "Invalid API token" error | Generate new API key from 360dialog |

## 📊 Flow Diagram

```
User (WhatsApp)
    ↓ sends message
360dialog (receives message)
    ↓ HTTP POST webhook
n8n Workflow
    ↓ 1. Parse message
    ↓ 2. Create Retell chat session
    ↓ 3. Send message to Retell
    ↓ 4. Get AI response
    ↓ 5. Send back via 360dialog
360dialog (sends response)
    ↓
User (receives AI response on WhatsApp)
```

## 🔍 Webhook Payload Example

When a user sends "Hello", 360dialog sends this to n8n:

```json
{
  "messages": [{
    "from": "1234567890",
    "id": "wamid.xxx",
    "timestamp": "1234567890",
    "text": {
      "body": "Hello"
    },
    "type": "text"
  }],
  "contacts": [{
    "profile": {
      "name": "John Doe"
    },
    "wa_id": "1234567890"
  }]
}
```

## 🚨 Important Notes

1. **Webhook Requirements (from 360dialog docs):**
   - Must respond with HTTP 200 within 5 seconds
   - Must use HTTPS with valid SSL certificate
   - Cannot have underscores in domain name
   - Cannot have port numbers in domain name
   ✅ Your n8n URL meets all these requirements!

2. **Session Management:**
   - Current workflow creates a NEW Retell chat session for EACH message
   - For better conversation continuity, consider adding session storage
   - Could use a database to map phone numbers to chat IDs

3. **Rate Limits:**
   - 360dialog Cloud API: Up to 80 messages/second
   - Retell API: Check your plan limits

## 🎯 Next Steps After Setup

1. **Add Error Handling** in n8n workflow
2. **Implement Session Persistence** (store chat_id per user)
3. **Add Logging** for debugging
4. **Set up Monitoring** for webhook failures
5. **Test Edge Cases** (images, long messages, etc.)

## 📞 Support

- **360dialog Support**: https://docs.360dialog.com/useful/help-and-support
- **n8n Community**: https://community.n8n.io/
- **Retell Support**: Check your Retell dashboard

---

## Quick Test Command

Once webhook is configured, test it directly:

```bash
curl -X POST 'https://sidetool.app.n8n.cloud/webhook/whatsapp-webhook' \
  -H 'Content-Type: application/json' \
  -d '{
    "messages": [{
      "from": "1234567890",
      "id": "test123",
      "timestamp": "1234567890",
      "text": {"body": "Test message"},
      "type": "text"
    }],
    "contacts": [{
      "profile": {"name": "Test User"},
      "wa_id": "1234567890"
    }]
  }'
```

This should trigger your n8n workflow!