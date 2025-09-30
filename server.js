const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Configuration
const CONFIG = {
  dialog360: {
    apiKey: 'TCQwEr6tgVdcijqE1WLpcu5LAK',
    webhookUrl: 'https://waba-v2.360dialog.io'
  },
  retell: {
    apiKey: 'key_3ca65c9afda484a7ad1061596d14',
    agentId: 'agent_627fe1d68a83076772b3551df4',
    baseUrl: 'https://api.retellai.com'
  }
};

// In-memory session storage (replace with Redis/Database in production)
const sessions = new Map();

// Session timeout (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000;

// Webhook endpoint to receive WhatsApp messages
app.post('/webhook/whatsapp', async (req, res) => {
  try {
    console.log('Received webhook:', JSON.stringify(req.body, null, 2));

    // Validate webhook payload
    if (!req.body.messages || req.body.messages.length === 0) {
      return res.status(200).json({ status: 'ignored', reason: 'no messages' });
    }

    const message = req.body.messages[0];
    const contact = req.body.contacts[0];

    // Only process text messages
    if (message.type !== 'text') {
      return res.status(200).json({ status: 'ignored', reason: 'not text message' });
    }

    const fromNumber = message.from;
    const messageText = message.text.body;
    const contactName = contact.profile.name;

    console.log(`Message from ${contactName} (${fromNumber}): ${messageText}`);

    // Get or create chat session
    let chatId = await getOrCreateSession(fromNumber, contactName);

    // Send message to Retell AI
    const agentResponse = await sendMessageToRetell(chatId, messageText);

    // Send response back to WhatsApp
    await sendWhatsAppMessage(fromNumber, agentResponse);

    res.status(200).json({ status: 'success', message: 'processed' });

  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Get existing session or create new one
async function getOrCreateSession(phoneNumber, contactName) {
  const now = Date.now();

  // Check if session exists and is not expired
  if (sessions.has(phoneNumber)) {
    const session = sessions.get(phoneNumber);
    if (now - session.lastActivity < SESSION_TIMEOUT) {
      // Update last activity
      session.lastActivity = now;
      console.log(`Reusing existing session: ${session.chatId}`);
      return session.chatId;
    } else {
      // Session expired, end it
      console.log(`Session expired for ${phoneNumber}`);
      await endRetellChat(session.chatId);
      sessions.delete(phoneNumber);
    }
  }

  // Create new session
  console.log(`Creating new session for ${phoneNumber}`);
  const chatId = await createRetellChat(phoneNumber, contactName);

  sessions.set(phoneNumber, {
    chatId,
    phoneNumber,
    contactName,
    createdAt: now,
    lastActivity: now
  });

  return chatId;
}

// Create a new Retell chat session
async function createRetellChat(phoneNumber, contactName) {
  try {
    const response = await axios.post(
      `${CONFIG.retell.baseUrl}/create-chat`,
      {
        agent_id: CONFIG.retell.agentId,
        metadata: {
          whatsapp_number: phoneNumber,
          contact_name: contactName,
          channel: 'whatsapp'
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${CONFIG.retell.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Created Retell chat:', response.data.chat_id);
    return response.data.chat_id;

  } catch (error) {
    console.error('Error creating Retell chat:', error.response?.data || error.message);
    throw error;
  }
}

// Send message to Retell and get response
async function sendMessageToRetell(chatId, message) {
  try {
    const response = await axios.post(
      `${CONFIG.retell.baseUrl}/create-chat-completion`,
      {
        chat_id: chatId,
        message: message
      },
      {
        headers: {
          'Authorization': `Bearer ${CONFIG.retell.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Extract the latest agent message
    const messages = response.data.messages;
    const agentMessage = messages
      .filter(msg => msg.role === 'agent')
      .pop();

    if (!agentMessage) {
      return 'Sorry, I could not process your message.';
    }

    return agentMessage.content;

  } catch (error) {
    console.error('Error sending message to Retell:', error.response?.data || error.message);
    throw error;
  }
}

// End a Retell chat session
async function endRetellChat(chatId) {
  try {
    await axios.post(
      `${CONFIG.retell.baseUrl}/end-chat`,
      { chat_id: chatId },
      {
        headers: {
          'Authorization': `Bearer ${CONFIG.retell.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log(`Ended chat session: ${chatId}`);
  } catch (error) {
    console.error('Error ending Retell chat:', error.response?.data || error.message);
  }
}

// Send message to WhatsApp via 360dialog
async function sendWhatsAppMessage(toNumber, messageText) {
  try {
    const response = await axios.post(
      `${CONFIG.dialog360.webhookUrl}/messages`,
      {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: toNumber,
        type: 'text',
        text: {
          body: messageText
        }
      },
      {
        headers: {
          'D360-API-KEY': CONFIG.dialog360.apiKey,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Sent WhatsApp message:', response.data);
    return response.data;

  } catch (error) {
    console.error('Error sending WhatsApp message:', error.response?.data || error.message);
    throw error;
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    activeSessions: sessions.size,
    uptime: process.uptime()
  });
});

// Session management endpoint
app.get('/sessions', (req, res) => {
  const sessionList = Array.from(sessions.entries()).map(([phone, session]) => ({
    phoneNumber: phone,
    contactName: session.contactName,
    chatId: session.chatId,
    duration: Date.now() - session.createdAt,
    lastActivity: new Date(session.lastActivity).toISOString()
  }));

  res.json({
    count: sessionList.length,
    sessions: sessionList
  });
});

// Cleanup expired sessions periodically
setInterval(() => {
  const now = Date.now();
  let cleaned = 0;

  for (const [phoneNumber, session] of sessions.entries()) {
    if (now - session.lastActivity > SESSION_TIMEOUT) {
      endRetellChat(session.chatId);
      sessions.delete(phoneNumber);
      cleaned++;
    }
  }

  if (cleaned > 0) {
    console.log(`Cleaned up ${cleaned} expired sessions`);
  }
}, 5 * 60 * 1000); // Check every 5 minutes

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`WhatsApp-Retell Bridge running on port ${PORT}`);
  console.log(`Webhook URL: http://localhost:${PORT}/webhook/whatsapp`);
});