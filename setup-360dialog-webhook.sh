#!/bin/bash

# 360dialog Webhook Configuration Script
# This script configures the webhook URL for your 360dialog WhatsApp channel

API_KEY="TCQwEr6tgVdcijqE1WLpcu5LAK"
WEBHOOK_URL="https://sidetool.app.n8n.cloud/webhook/whatsapp-webhook"
CHANNEL_ID="0efYEuCH"

echo "Configuring 360dialog webhook..."
echo "Channel ID: $CHANNEL_ID"
echo "Webhook URL: $WEBHOOK_URL"
echo ""

# Set the webhook URL
curl -X PATCH "https://hub.360dialog.io/api/v2/channels/$CHANNEL_ID" \
  -H "D360-API-KEY: $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"webhook_url\": \"$WEBHOOK_URL\"
  }"

echo ""
echo "Webhook configuration complete!"
echo ""
echo "To verify, check your 360dialog dashboard or run:"
echo "curl -X GET \"https://hub.360dialog.io/api/v2/channels/$CHANNEL_ID\" -H \"D360-API-KEY: $API_KEY\""