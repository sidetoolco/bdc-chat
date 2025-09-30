# Get Chat API

Retrieve details of a specific chat session.

## Endpoint
```
GET https://api.retellai.com/get-chat/{chat_id}
```

## Response (200)
```json
{
  "chat_id": "Jabr9TXYYJHfvl6Syypi88rdAHYHmcq6",
  "agent_id": "oBeDLoLOeuAbiuaMFXRtDOLriTJ5tSxD",
  "chat_status": "ongoing",
  "start_timestamp": 1703302407333,
  "end_timestamp": 1703302428855,
  "transcript": "Agent: hi how are you doing?\nUser: Doing pretty well. How are you?\n...",
  "message_with_tool_calls": [...],
  "metadata": {},
  "retell_llm_dynamic_variables": {
    "customer_name": "John Doe"
  },
  "collected_dynamic_variables": {
    "last_node_name": "Test node"
  },
  "chat_cost": {
    "product_costs": [...],
    "combined_cost": 70
  },
  "chat_analysis": {
    "chat_summary": "...",
    "user_sentiment": "Positive",
    "chat_successful": true,
    "custom_analysis_data": {}
  }
}
```

## Key Points
- Retrieves complete chat history
- Shows full transcript and messages
- Available after chat starts
- Analysis data available after chat ends