#!/bin/bash

# 360dialog Webhook Configuration Script (CORRECT VERSION)
# Based on official 360dialog documentation

API_KEY="TCQwEr6tgVdcijqE1WLpcu5LAK"
WEBHOOK_URL="https://sidetool.app.n8n.cloud/webhook/whatsapp-webhook"

echo "=========================================="
echo "360dialog Webhook Configuration"
echo "=========================================="
echo "Webhook URL: $WEBHOOK_URL"
echo ""

# Set the webhook URL for the phone number (recommended method)
echo "Setting webhook URL for phone number..."
curl -X POST 'https://waba-v2.360dialog.io/v1/configs/webhook' \
  -H "D360-API-KEY: $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"url\": \"$WEBHOOK_URL\"
  }"

echo ""
echo ""
echo "=========================================="
echo "Verifying webhook configuration..."
echo "=========================================="

# Get the current webhook configuration
curl -X GET 'https://waba-v2.360dialog.io/v1/configs/webhook' \
  -H "D360-API-KEY: $API_KEY" \
  -H "Content-Type: application/json"

echo ""
echo ""
echo "=========================================="
echo "Configuration complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Make sure your n8n workflow is ACTIVE"
echo "2. Test by sending a WhatsApp message to: +1 (555) 887-5639"
echo "3. You should receive a response from the Retell AI agent"
echo ""