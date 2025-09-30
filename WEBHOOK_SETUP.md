# 360dialog Webhook Setup Guide

## Your Configuration Details

- **n8n Webhook URL**: `https://sidetool.app.n8n.cloud/webhook/whatsapp-webhook`
- **360dialog Phone Number**: `15558875639`
- **Channel ID**: `0efYEuCH`

## Option 1: Setup via 360dialog Hub (Easiest)

1. **Go to 360dialog Hub**: https://hub.360dialog.io
2. **Login** with your account (ed@sidetool.co)
3. **Select your WhatsApp Channel** (15558875639)
4. **Find "Webhook" or "Callback URL" settings**
5. **Enter your webhook URL**:
   ```
   https://sidetool.app.n8n.cloud/webhook/whatsapp-webhook
   ```
6. **Save** the configuration

## Option 2: Setup via API

Since you have a **Cloud API hosted by Meta** account, you need to use the WhatsApp Cloud API endpoint:

### Get Current Webhook Config:
```bash
curl -X GET 'https://waba-v2.360dialog.io/v1/configs/webhook' \
  -H 'D360-API-KEY: YOUR_CORRECT_API_KEY'
```

### Set Webhook URL:
```bash
curl -X POST 'https://waba-v2.360dialog.io/v1/configs/webhook' \
  -H 'D360-API-KEY: YOUR_CORRECT_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "url": "https://sidetool.app.n8n.cloud/webhook/whatsapp-webhook"
  }'
```

## Option 3: Contact 360dialog Support

If the above methods don't work:

1. **Open a support ticket** at https://docs.360dialog.com/useful/help-and-support
2. **Request**: "Please set my webhook URL to: `https://sidetool.app.n8n.cloud/webhook/whatsapp-webhook`"
3. **Provide**: Your channel ID `0efYEuCH` and phone number `15558875639`

## Verify Setup

Once configured, test by:

1. **Send a WhatsApp message** to `+1 (555) 887-5639`
2. **Check n8n executions** - You should see the workflow triggered
3. **You should receive a response** from the Retell AI agent

## Troubleshooting

### If messages aren't reaching n8n:

1. **Check n8n workflow is active** (toggle should be ON)
2. **Verify webhook URL** is correct in 360dialog
3. **Test n8n webhook directly**:
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

### If no response from Retell:

1. **Check Retell API key** is valid: `key_3ca65c9afda484a7ad1061596d14`
2. **Check Agent ID** exists: `agent_627fe1d68a83076772b3551df4`
3. **Review n8n execution logs** for error messages

## Important Notes

- Your webhook URL **must respond within 5 seconds** with HTTP 200 OK
- The URL must use **HTTPS with a valid SSL certificate** (✓ n8n provides this)
- The URL cannot contain underscores or port numbers in domain name (✓ your URL is valid)

## Next Steps After Setup

1. Verify webhook is receiving messages
2. Test the full conversation flow
3. Monitor n8n execution logs
4. Consider adding session management for persistent conversations