const express = require('express');
const cors = require('cors');
const Retell = require('retell-sdk').default;
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Initialize Retell client
const retellClient = new Retell({
  apiKey: process.env.RETELL_API_KEY || 'key_f1b1aa7616495ba07890ef19fcea',
});

// Endpoint to create a web call session
app.post('/api/create-web-call', async (req, res) => {
  try {
    const { customerName, debtAmount, dueDate } = req.body;

    // Create a web call with dynamic variables
    const webCallResponse = await retellClient.call.createWebCall({
      agent_id: 'agent_627fe1d68a83076772b3551df4',
      metadata: {
        customer_name: customerName,
        debt_amount: debtAmount,
        due_date: dueDate,
        bank: 'Banco de Córdoba'
      },
      // Pass dynamic variables that will be available in the agent
      custom_data: {
        name: customerName,
        greeting: 'Hola',
        customer_name: customerName,
        debt_amount: debtAmount,
        due_date: dueDate,
        bank: 'Banco de Córdoba',
        agent_type: 'Collections'
      }
    });

    res.json({
      success: true,
      call_id: webCallResponse.call_id,
      web_call_link: webCallResponse.web_call_link,
      access_token: webCallResponse.access_token
    });
  } catch (error) {
    console.error('Error creating web call:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Endpoint to register a call (for embedding)
app.post('/api/register-call', async (req, res) => {
  try {
    const { agentId, customerData } = req.body;

    // Register call with dynamic data
    const registerResponse = await retellClient.call.registerPhoneCall({
      agent_id: agentId || 'agent_627fe1d68a83076772b3551df4',
      from_number: '+14157774444', // Your Retell number
      to_number: '+12137774445',   // Customer number (can be dummy for web)
      metadata: customerData
    });

    res.json({
      success: true,
      call_id: registerResponse.call_id,
      sample_rate: registerResponse.sample_rate
    });
  } catch (error) {
    console.error('Error registering call:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Access the chat at http://localhost:3000/sdk-chat.html');
});