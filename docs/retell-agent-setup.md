# Retell AI Agent Configuration

## Problem: Template Variables Not Being Replaced

If you see `{{greeting}}`, `{{name}}`, `{{amount}}` in messages instead of actual values, your Retell agent prompt needs to be configured to use dynamic variables.

## Solution

### Step 1: Update Your Retell Agent Prompt

Go to your Retell AI Dashboard → Agents → Edit `agent_627fe1d68a83076772b3551df4`

In the agent's **System Prompt** or **First Message**, use the dynamic variables:

**Instead of**:
```
{{greeting}}. Soy Pilar, agente virtual del Banco de Córdoba. ¿Me comunico con {{name}}?
```

**Use**:
```
Hola. Soy Pilar, agente virtual del Banco de Córdoba. ¿Me comunico con {{name}}?

Te escribo para recordarte que tenés un pago de ${{amount}} que vence el día {{due_date}}. ¿Podemos contar con tu pago para esa fecha?
```

### Step 2: Define Dynamic Variables in Agent

In your Retell agent settings, you may need to declare the dynamic variables:

- `name` (string)
- `amount` (string)
- `due_date` (string)

### Step 3: Remove `{{greeting}}` Variable

The `{{greeting}}` variable is not being passed from the workflow. Either:

**Option A**: Remove it from the prompt:
```
Hola. Soy Pilar, agente virtual del Banco de Córdoba. ¿Me comunico con {{name}}?
```

**Option B**: Add it to the workflow (see below)

## Updating the Workflow to Include Greeting

If you want to pass a custom greeting, update the "Create Chat" node to include:

```json
{
  "retell_llm_dynamic_variables": {
    "greeting": "Hola",
    "name": customer_name,
    "amount": debt_amount,
    "due_date": due_date
  }
}
```

## Why Variables Aren't Replacing

Common reasons:

1. **Variable name mismatch**: Template uses `{{name}}` but you pass `customer_name`
2. **Not defined in agent**: Agent doesn't know about these variables
3. **Wrong API call**: Using `/create-chat-completion` without the variables being set in original `/create-chat`
4. **Typo in template**: `{{greeting}}` vs `{{greetings}}`

## Testing

1. Update agent prompt in Retell dashboard
2. Create new chat session via form
3. Check if variables are replaced
4. If not, check the agent's logs in Retell dashboard

## Debug: Check What's Being Sent

In n8n, check the "Create Chat" node output to verify:
```json
{
  "chat_id": "chat_xxx",
  "retell_llm_dynamic_variables": {
    "name": "Ed",
    "amount": "1000.00",
    "due_date": "2025-10-30"
  }
}
```