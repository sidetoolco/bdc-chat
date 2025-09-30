# WhatsApp-Retell Bridge - Final Setup Guide

## 📁 Current Directory
`/Users/edescobar/Code/whatsapp-retell-bridge`

All files are now in this single directory.

---

## 🎯 What We Built

A complete integration that connects:
1. **Web Form** → Sends initial WhatsApp message
2. **WhatsApp** → Receives messages and sends to Retell AI
3. **Retell AI** → Processes with AI agent and responds back via WhatsApp

---

## 📄 Key Files

### 1. **n8n-workflow-COMPLETE.json** ⭐ (USE THIS ONE)
The final, clean workflow with two parts:
- **Part 1**: Handle incoming WhatsApp messages (customer replies)
- **Part 2**: Handle form submissions (send initial message)

### 2. **chat-whatsapp.html**
The web form for collections with WhatsApp integration

### 3. Configuration Files
- `.env.example` - Environment variables template
- Various webhook setup scripts

---

## ✅ Setup Checklist

### Step 1: Import n8n Workflow

1. Open your n8n instance at `https://sidetool.app.n8n.cloud`
2. **Delete ALL existing workflows** (to avoid conflicts)
3. Import `n8n-workflow-COMPLETE.json`
4. **Activate the workflow** (toggle switch to ON)

### Step 2: Verify Webhooks

The workflow has TWO webhooks:

#### Webhook 1: Incoming WhatsApp Messages
- **Path**: `/whatsapp-webhook`
- **Full URL**: `https://sidetool.app.n8n.cloud/webhook/whatsapp-webhook`
- **Purpose**: Receives messages from 360dialog when customers reply
- **Status**: ✅ Already configured in 360dialog

#### Webhook 2: Form Submissions
- **Path**: `/whatsapp-trigger`
- **Full URL**: `https://sidetool.app.n8n.cloud/webhook/whatsapp-trigger`
- **Purpose**: Receives form data and sends initial WhatsApp message
- **Used by**: `chat-whatsapp.html`

### Step 3: Test the Integration

#### Test 1: Form → WhatsApp Message

1. Open `chat-whatsapp.html` in a browser:
   ```bash
   cd /Users/edescobar/Code/whatsapp-retell-bridge
   open chat-whatsapp.html
   ```

2. Fill in the form:
   - **Name**: Your name
   - **WhatsApp**: Your phone number (with country code, e.g., `+17048169059`)
   - **Amount**: 1000.00
   - **Date**: Any future date

3. Click "Enviar por WhatsApp"

4. **Expected**: You receive a WhatsApp message within seconds

#### Test 2: Customer Reply → AI Response

1. Reply to the WhatsApp message you received

2. **Expected**: You get an AI-generated response from Retell

---

## 🔧 Configuration Details

### API Keys & Credentials

All configured in the workflow:

```
360dialog API Key: fyzs8TZuhjKccQSnCSRz8oucAK
Retell API Key: key_3ca65c9afda484a7ad1061596d14
Retell Agent ID: agent_627fe1d68a83076772b3551df4
WhatsApp Number: +15558875639
```

### Workflow Structure

```
┌─────────────────────────────────────────────────────────┐
│           n8n-workflow-COMPLETE.json                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  FLOW 1: Incoming WhatsApp (Customer Replies)          │
│  ┌─────────────────────────────────────────┐           │
│  │ Webhook - Incoming WhatsApp             │           │
│  │         ↓                                │           │
│  │ Filter - Only Text                       │           │
│  │         ↓                                │           │
│  │ Parse WhatsApp Data                      │           │
│  │         ↓                                │           │
│  │ Create Retell Session                    │           │
│  │         ↓                                │           │
│  │ Get AI Response                          │           │
│  │         ↓                                │           │
│  │ Extract Response                         │           │
│  │         ↓                                │           │
│  │ Send to WhatsApp                         │           │
│  │         ↓                                │           │
│  │ Respond OK                               │           │
│  └─────────────────────────────────────────┘           │
│                                                          │
│  FLOW 2: Form Submission (Initial Message)             │
│  ┌─────────────────────────────────────────┐           │
│  │ Webhook - Form Submission               │           │
│  │         ↓                                │           │
│  │ Format Message                           │           │
│  │         ↓                                │           │
│  │ Send Initial Message                     │           │
│  │         ↓                                │           │
│  │ Respond Success                          │           │
│  └─────────────────────────────────────────┘           │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🚨 Troubleshooting

### Issue: Form submission shows JSON error

**Check**:
1. Is the workflow ACTIVE in n8n?
2. Is the webhook URL correct in `chat-whatsapp.html` (line 256)?
3. Check n8n execution logs

### Issue: WhatsApp message sent but no AI response

**Check**:
1. Did you reply to the message?
2. Is Flow 1 (Incoming WhatsApp) active?
3. Check Retell dashboard for errors

### Issue: No message received on WhatsApp

**Check**:
1. Phone number format (must include country code: +1, +52, etc.)
2. 360dialog API key is correct
3. Check n8n execution logs for errors

---

## 📊 How to Monitor

### In n8n:
1. Go to "Executions" tab
2. You'll see executions for both flows
3. Click on any execution to see details
4. Green = success, Red = error

### In 360dialog:
1. Login to 360dialog dashboard
2. Check message logs
3. Verify delivery status

### In Retell:
1. Login to Retell dashboard
2. Go to "Chats" section
3. See all conversations

---

## 🎨 Customizing the Message

Edit the message in the "Format Message" node:

```javascript
const message = `Hola ${formData.customer_name},

Your custom message here.
Amount: $${formData.debt_amount}
Due: ${formData.due_date}

Your call to action here.`;
```

---

## 📈 Next Steps

1. ✅ Test both flows thoroughly
2. ✅ Customize the message template
3. ✅ Update Retell agent prompts if needed
4. ✅ Deploy `chat-whatsapp.html` to production
5. ✅ Monitor conversation quality
6. ✅ Add analytics tracking

---

## 🔐 Security Notes

- ✅ API keys are server-side only
- ✅ Webhooks validate message format
- ✅ Phone numbers are sanitized
- ⚠️ Consider adding webhook authentication
- ⚠️ Consider rate limiting on form submissions

---

## 💰 Cost Considerations

- **360dialog**: ~$0.005-0.05 per message (varies by country)
- **Retell AI**: Check your plan pricing
- **n8n**: Free (self-hosted) or usage-based

---

## 📞 Support Resources

- **360dialog Docs**: https://docs.360dialog.com
- **Retell Docs**: https://docs.retellai.com
- **n8n Docs**: https://docs.n8n.io

---

## ✨ Summary

You now have a complete system where:

1. **Sales/Collections team** fills out web form
2. **Customer receives** WhatsApp message automatically
3. **Customer can reply** and have AI conversation
4. **AI handles** the conversation intelligently
5. **Team can monitor** all conversations

Everything is in one directory: `/Users/edescobar/Code/whatsapp-retell-bridge`

**Ready to test!** 🚀