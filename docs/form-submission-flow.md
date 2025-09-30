# Form Submission Flow - How It Works

## Overview
The form submission creates a Retell AI chat session with dynamic variables, stores it in Supabase, and sends a simple "Hola" message to WhatsApp to initiate the conversation.

## Flow Steps

```
1. Form Submit (web form)
   ↓
2. Format Data (clean phone number, extract fields)
   ↓
3. Create Chat (/create-chat with retell_llm_dynamic_variables)
   ├─ agent_id
   ├─ metadata: { phone_number, customer_name, debt_amount, due_date }
   ├─ retell_llm_dynamic_variables: { name, amount, due_date } ✅ NEW
   ↓
4. Store Session (save to Supabase)
   ├─ chat_id (primary key)
   ├─ phone_number
   ├─ customer_name
   ├─ debt_amount
   ├─ due_date
   ↓
5. Prepare Initial Message
   ├─ phone_number
   ├─ chat_id
   ├─ initial_message: "Hola"
   ↓
6. Send Initial WhatsApp (send "Hola" to customer)
   ↓
7. Respond Success (return chat_id to form)
```

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

### 2. Simplified Initial Message

**Before**:
- Called `/create-chat-completion` to get AI greeting
- Extracted agent's response
- Sent AI-generated greeting to WhatsApp
- **Problem**: Caused multiple messages to fire

**After**:
- Just send "Hola" to WhatsApp
- Customer replies "Hola" back
- Then the conversation continues via the webhook flow
- **Benefit**: Single message, clean start

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

## Why This Fixes Multiple Messages

**Old flow**:
1. Form submits
2. Calls `/create-chat-completion` with "Hola"
3. AI responds (possibly multiple times if streaming)
4. Sends all responses to WhatsApp

**New flow**:
1. Form submits
2. Creates chat session with variables
3. Sends simple "Hola" from n8n (not AI)
4. Customer replies
5. Webhook handles customer's reply → AI responds ONCE

## Testing

1. Submit form with customer data
2. Customer receives "Hola" on WhatsApp
3. Customer replies "si" or any message
4. AI responds with greeting using `{{name}}`, `{{amount}}`, `{{due_date}}`
5. Conversation continues naturally