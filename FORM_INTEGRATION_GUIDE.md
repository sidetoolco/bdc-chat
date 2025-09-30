# Form to WhatsApp Integration - Quick Fix Guide

## Problem
The Retell `/create-sms-chat` endpoint returned an error causing JSON parse failure.

## Solution
Use 360dialog directly to send the initial WhatsApp message, then let the existing webhook handle responses.

## Steps to Fix

### 1. Import the Simple Test Workflow

**File**: `n8n-workflow-SIMPLE-TEST.json`

This workflow:
1. ✅ Receives form data
2. ✅ Formats a WhatsApp message
3. ✅ Sends via 360dialog API
4. ✅ Returns success response

### 2. Test It

1. Import `n8n-workflow-SIMPLE-TEST.json` into n8n
2. Activate it
3. Make sure the webhook path is: `/whatsapp-trigger`
4. Fill out the form at `chat-whatsapp.html`
5. Submit

**Expected Result**: You receive a WhatsApp message immediately

### 3. How It Works

#### Form sends:
```json
{
  "customer_name": "Ed",
  "phone_number": "+17048169059",
  "debt_amount": "1000.00",
  "due_date": "2025-10-30"
}
```

#### n8n workflow:
1. **Formats message**:
   ```
   Hola Ed,

   Somos del Banco de Córdoba. Le contactamos sobre
   su saldo pendiente de $1000.00 ARS con vencimiento
   el 2025-10-30.

   ¿Le gustaría hablar sobre opciones de pago?
   ```

2. **Sends to 360dialog**:
   ```json
   {
     "messaging_product": "whatsapp",
     "to": "17048169059",
     "type": "text",
     "text": {
       "body": "Hola Ed,..."
     }
   }
   ```

3. **Customer receives on WhatsApp**

4. **Customer replies** → Triggers existing webhook → Retell AI responds

## Architecture

```
┌─────────────┐
│   Form      │
│ (HTML Page) │
└──────┬──────┘
       │ POST /whatsapp-trigger
       ↓
┌──────────────────┐
│   n8n Workflow   │
│ (Simple Test)    │
└──────┬───────────┘
       │ Send initial message
       ↓
┌──────────────────┐
│   360dialog      │
│   WhatsApp API   │
└──────┬───────────┘
       │ Message delivered
       ↓
┌──────────────────┐
│   Customer       │
│   (WhatsApp)     │
└──────┬───────────┘
       │ Customer replies
       ↓
┌──────────────────┐
│ Existing n8n     │
│ Webhook Handler  │
└──────┬───────────┘
       │ Parse & forward
       ↓
┌──────────────────┐
│   Retell AI      │
│   Chat Agent     │
└──────────────────┘
```

## Three Workflow Options

### Option 1: Simple Test (Recommended for Testing)
**File**: `n8n-workflow-SIMPLE-TEST.json`
- ✅ Just sends WhatsApp message
- ✅ Quick to test
- ✅ Easy to debug
- ❌ No Retell session created upfront

### Option 2: Full Integration
**File**: `n8n-workflow-FORM-TO-WHATSAPP.json`
- ✅ Sends WhatsApp message
- ✅ Creates Retell chat session
- ✅ Links them together
- ⚠️ More complex

### Option 3: With Error Handling
**File**: `n8n-workflow-FORM-TRIGGER-FIXED.json`
- ✅ Tries Retell SMS API
- ✅ Full error handling
- ✅ Detailed logging
- ⚠️ SMS API may not be available for your account

## Troubleshooting

### Issue: JSON Parse Error
**Cause**: Retell API returned empty or error response
**Fix**: Use Simple Test workflow (Option 1)

### Issue: Message not sent
**Check**:
1. n8n workflow is ACTIVE
2. 360dialog API key is correct: `fyzs8TZuhjKccQSnCSRz8oucAK`
3. Phone number format: Must include country code

### Issue: Message sent but no AI response
**This is expected!** The simple workflow only sends the initial message.

**To get AI responses**:
1. Customer must reply to the message
2. Their reply triggers the existing `/whatsapp-webhook` flow
3. That flow connects to Retell AI
4. AI responds back

### Issue: Customer replies but no AI response
**Check**:
1. Existing workflow `WhatsApp to Retell AI Bridge` is ACTIVE
2. Webhook is configured in 360dialog
3. Check n8n execution logs

## Testing Checklist

- [ ] Import `n8n-workflow-SIMPLE-TEST.json`
- [ ] Activate the workflow
- [ ] Verify webhook URL: `https://sidetool.app.n8n.cloud/webhook/whatsapp-trigger`
- [ ] Open `chat-whatsapp.html`
- [ ] Fill in form with YOUR phone number
- [ ] Click "Enviar por WhatsApp"
- [ ] Check for success message in browser
- [ ] Check your WhatsApp - you should receive message
- [ ] Reply to the message
- [ ] Check if AI responds (requires main workflow to be active)

## Customizing the Message

Edit the message in the "Prepare Data" node:

```javascript
const message = `Hola ${formData.customer_name},

Tu mensaje personalizado aquí.
Monto: $${formData.debt_amount}
Fecha: ${formData.due_date}

¿Cómo te podemos ayudar?`;
```

## Next Steps

1. **Test with Simple workflow** ✅
2. **Verify customer receives message** ✅
3. **Test customer reply → AI response** ✅
4. **Customize message template**
5. **Add to production**

## Support

If messages aren't being sent:
1. Check n8n execution logs
2. Check 360dialog dashboard
3. Verify API keys are correct
4. Test phone number format