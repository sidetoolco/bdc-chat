# WhatsApp Integration for Collections System

This document explains how to integrate the collections form with WhatsApp messaging via Retell AI.

## Architecture

```
User fills form → n8n Webhook → Retell SMS API → WhatsApp (via 360dialog)
                                      ↓
                                 AI responds via WhatsApp
```

## Files Created

1. **`chat-whatsapp.html`** - Modified frontend with WhatsApp integration
2. **`n8n-workflow-FORM-TRIGGER.json`** - n8n workflow to handle form submissions

## Setup Instructions

### 1. Import the n8n Workflow

1. Open your n8n instance
2. Import `/Users/edescobar/Code/whatsapp-retell-bridge/n8n-workflow-FORM-TRIGGER.json`
3. Activate the workflow
4. Copy the webhook URL (should be: `https://sidetool.app.n8n.cloud/webhook/whatsapp-trigger`)

### 2. Deploy the Frontend

**Option A: Vercel (Recommended)**

```bash
cd /Users/edescobar/Code/retell-chat
vercel deploy
```

**Option B: Local Testing**

```bash
cd /Users/edescobar/Code/retell-chat
python3 -m http.server 8000
# Open http://localhost:8000/chat-whatsapp.html
```

### 3. Update the API Endpoint (if needed)

If your n8n webhook URL is different, edit `chat-whatsapp.html` line 256:

```javascript
const API_ENDPOINT = 'https://your-n8n-url.com/webhook/whatsapp-trigger';
```

## How It Works

### Form Submission Flow:

1. **User fills out the form**:
   - Customer Name: "Juan Pérez"
   - WhatsApp Number: "+5491123456789"
   - Debt Amount: 5000.00
   - Due Date: 2025-10-29

2. **Form sends POST request** to n8n webhook:
   ```json
   {
     "customer_name": "Juan Pérez",
     "phone_number": "+5491123456789",
     "debt_amount": "5000.00",
     "due_date": "2025-10-29",
     "timestamp": "2025-09-29T..."
   }
   ```

3. **n8n workflow calls Retell SMS API**:
   - Uses `/create-sms-chat` endpoint
   - From: `+15558875639` (your 360dialog number)
   - To: Customer's WhatsApp number
   - Includes dynamic variables for the agent

4. **Retell AI sends first message** via WhatsApp automatically

5. **Customer receives message** on WhatsApp and can reply

6. **AI continues conversation** using your Retell agent configuration

## Key Differences from Original

### Original (`chat-final.html`):
- ❌ Web-based chat widget
- ❌ Customer initiates conversation
- ❌ Limited to web interface

### New (`chat-whatsapp.html`):
- ✅ WhatsApp messaging
- ✅ Business initiates conversation
- ✅ Customer receives on their phone
- ✅ Uses Retell SMS capability

## Configuration

### Retell AI Agent
- **Agent ID**: `agent_627fe1d68a83076772b3551df4`
- **From Number**: `+15558875639` (360dialog number)
- **API Key**: `key_3ca65c9afda484a7ad1061596d14`

### Dynamic Variables Passed:
```json
{
  "customer_name": "...",
  "debt_amount": "...",
  "due_date": "..."
}
```

These variables are available in your Retell agent prompt using `{{customer_name}}`, `{{debt_amount}}`, `{{due_date}}`.

## Testing

### 1. Test the Form Locally

```bash
cd /Users/edescobar/Code/retell-chat
open chat-whatsapp.html
```

### 2. Fill Out the Form
- Name: Test Customer
- WhatsApp: Your personal WhatsApp number (with country code)
- Amount: 1000.00
- Date: Any future date

### 3. Click "Enviar por WhatsApp"

### 4. Check Your Phone
You should receive a WhatsApp message from `+1 (555) 887-5639`

## Troubleshooting

### Form Shows Error
- **Check n8n workflow is ACTIVE**
- **Verify webhook URL** in `chat-whatsapp.html`
- **Check browser console** for errors (F12)

### No WhatsApp Message Received
- **Verify Retell API key** is correct
- **Check phone number format** (must include country code: +1, +52, +54, etc.)
- **Check Retell dashboard** for SMS chat creation
- **Verify 360dialog number** has SMS enabled

### Message Sends But No AI Response
- **Check Retell agent configuration**
- **Verify agent is in "chat" mode**
- **Check agent has correct prompt**
- **Review Retell dashboard logs**

## Advanced: Customizing the Message

The initial message is controlled by your Retell agent's configuration. To customize:

1. Go to Retell dashboard
2. Select agent `agent_627fe1d68a83076772b3551df4`
3. Update the "First Message" or prompt
4. Use dynamic variables like:
   ```
   Hola {{customer_name}},
   le contactamos sobre su saldo pendiente de ${{debt_amount}} ARS
   con vencimiento {{due_date}}.
   ```

## Cost Considerations

- **Retell SMS**: Charged per message sent/received
- **360dialog**: Charged per conversation (24-hour window)
- **n8n**: Free for self-hosted, or usage-based pricing

## Security Notes

- ✅ Webhook URL is public but requires specific payload format
- ✅ Retell API key is server-side (not exposed in frontend)
- ✅ Phone numbers are validated on Retell side
- ⚠️ Consider adding authentication to webhook if needed

## Next Steps

1. **Test thoroughly** with multiple phone numbers
2. **Monitor Retell dashboard** for conversation quality
3. **Adjust agent prompts** based on customer responses
4. **Set up analytics** to track conversion rates
5. **Add error handling** for failed messages

## Support

- **Retell AI**: https://docs.retellai.com
- **360dialog**: https://docs.360dialog.com
- **n8n**: https://docs.n8n.io