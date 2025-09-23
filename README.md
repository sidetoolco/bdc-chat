# Kleva Collections Chat - Banco de Córdoba

WhatsApp-style collections chat interface powered by Retell AI.

## Live Demo

Visit: https://sidetoolco.github.io/bdc-chat/

## Features

- 💬 WhatsApp-style UI for familiar user experience
- 🤖 Integrated Retell AI agent for collections conversations
- 📝 Dynamic customer data input (name, debt amount, due date)
- 🏦 Banco de Córdoba branding
- 📱 Mobile responsive design

## Files

- `chat-final.html` - Main chat interface with WhatsApp styling
- `index.html` - Redirect page to chat-final.html
- `kleva-logo.webp` - Kleva logo
- `bancor-verde.png` - Banco de Córdoba logo
- `favicon.svg` - Site favicon

## Configuration

The chat uses Retell AI agent v7:
- Agent ID: `agent_627fe1d68a83076772b3551df4`
- Version: 7
- Public Key: `key_f1b1aa7616495ba07890ef19fcea`

## Usage

1. Open the application at https://sidetoolco.github.io/bdc-chat/
2. Fill in customer data:
   - Full Name
   - Debt Amount
   - Due Date
3. Click "Initialize Agent" to start the conversation

The interface simulates a WhatsApp conversation while the Retell AI agent handles the actual collections dialogue in the background.

## Local Development

```bash
git clone https://github.com/sidetoolco/bdc-chat.git
cd bdc-chat
python3 -m http.server 8080
```

Then open http://localhost:8080 in your browser.

## License

© 2024 Kleva - All rights reserved