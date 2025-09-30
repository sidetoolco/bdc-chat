# Create Chat API

Create a chat session with Retell AI.

## Endpoint
```
POST https://api.retellai.com/create-chat
```

## Request Body
```json
{
  "agent_id": "oBeDLoLOeuAbiuaMFXRtDOLriTJ5tSxD",
  "agent_version": 1,  // optional
  "metadata": {},  // optional storage
  "retell_llm_dynamic_variables": {  // optional
    "customer_name": "John Doe"
  }
}
```

## Response (201)
```json
{
  "chat_id": "Jabr9TXYYJHfvl6Syypi88rdAHYHmcq6",
  "agent_id": "oBeDLoLOeuAbiuaMFXRtDOLriTJ5tSxD",
  "chat_status": "ongoing",  // ongoing | ended | error
  "retell_llm_dynamic_variables": {
    "customer_name": "John Doe"
  },
  "start_timestamp": 1703302407333,
  "metadata": {}
}
```

## Key Points
- Creates a NEW chat session
- Returns a unique `chat_id`
- Use this `chat_id` for all subsequent messages via `/create-chat-completion`
- Store the `chat_id` mapped to the user (e.g., WhatsApp phone number)
- Reuse the same `chat_id` to maintain conversation context