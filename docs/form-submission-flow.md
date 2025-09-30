# Form Submission Flow - How It Works

## Overview
The form submission creates a Retell AI chat session with dynamic variables and stores it in Supabase. The customer initiates the conversation by sending the first message.

## Flow Steps

```
1. Form Submit (web form)
   ↓
2. Format Data (clean phone number, extract fields)
   ↓
3. Create Chat (/create-chat with retell_llm_dynamic_variables)
   ├─ agent_id
   ├─ agent_version: 9
   ├─ metadata: { phone_number, customer_name, debt_amount, due_date }
   ├─ retell_llm_dynamic_variables: { greeting, name, amount, due_date } ✅
   ↓
4. Store Session (save to Supabase)
   ├─ chat_id (primary key)
   ├─ phone_number
   ├─ customer_name
   ├─ debt_amount
   ├─ due_date
   ↓
5. Respond Success (return chat_id to form)
   ├─ Status: "Session created. Customer will receive greeting when they message."
   ├─ NO MESSAGE SENT TO CUSTOMER ✅ NEW
```

**Important Change**: The form NO LONGER sends an initial WhatsApp message. Instead:
- Session is created and stored
- Customer initiates contact by sending first message
- AI responds with personalized greeting using dynamic variables

## Key Changes

### 1. Dynamic Variables in Create Chat

**Before**:
```json
{
  "agent_id": "agent_xxx",
  "metadata": { ... }
}
```

**After**:
```json
{
  "agent_id": "agent_xxx",
  "metadata": { ... },
  "retell_llm_dynamic_variables": {
    "name": "Ed",
    "amount": "1000.00",
    "due_date": "2025-10-30"
  }
}
```

This replaces `{{name}}`, `{{amount}}`, and `{{due_date}}` in the AI agent's prompt.

### 2. No Initial Message Sent

**Before**:
- Form sent "Hola" to WhatsApp after creating session
- **Problem**: Triggered webhook, causing duplicate "Hola" messages (form's Hola + AI's response to Hola)

**After**:
- Form only creates session and stores in Supabase
- Customer sends first message to initiate conversation
- AI responds with personalized greeting using dynamic variables
- **Benefit**: No duplicates, customer-initiated flow

## How Template Variables Work

In your Retell AI agent configuration, you can use:

```
{{greeting}}. Soy Pilar, agente virtual del Banco de Córdoba.
¿Me comunico con {{name}}?

Te escribo para recordarte que tenés un pago de ${{amount}}
que vence el día {{due_date}}.
```

When you pass `retell_llm_dynamic_variables`, Retell replaces:
- `{{name}}` → "Ed"
- `{{amount}}` → "1000.00"
- `{{due_date}}` → "2025-10-30"

**Important**: The variable names in `retell_llm_dynamic_variables` must match the template variable names in your agent prompt (without the `{{` `}}`).

## Why This Fixes Multiple "Hola" Messages

**Old flow (BROKEN)**:
1. Form submits
2. Creates chat session
3. Sends "Hola" to WhatsApp
4. WhatsApp webhook receives "Hola" → triggers workflow
5. AI responds to "Hola" with another "Hola"
6. Customer sees multiple "Hola" messages

**New flow (FIXED)**:
1. Form submits
2. Creates chat session with variables
3. Stores in Supabase
4. **No message sent**
5. Customer sends first message (e.g., "Hola")
6. Webhook processes → AI responds with personalized greeting
7. Customer sees only ONE response

## Testing

1. Submit form with customer data
2. **Customer does NOT receive any message** (this is correct!)
3. Customer initiates by sending "Hola" or any message
4. AI responds with greeting using `{{name}}`, `{{amount}}`, `{{due_date}}`
5. Conversation continues naturally with context maintained