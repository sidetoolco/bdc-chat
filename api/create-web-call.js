const Retell = require('retell-sdk').default;

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { customerName, debtAmount, dueDate } = req.body;

    // Initialize Retell client
    const retellClient = new Retell({
      apiKey: process.env.RETELL_API_KEY || 'key_f1b1aa7616495ba07890ef19fcea',
    });

    // Create a web call with dynamic variables
    const webCallResponse = await retellClient.call.createWebCall({
      agent_id: 'agent_627fe1d68a83076772b3551df4',
      metadata: {
        customer_name: customerName,
        debt_amount: debtAmount,
        due_date: dueDate,
        bank: 'Banco de Córdoba'
      },
      custom_data: {
        name: customerName,
        greeting: 'Hola',
        amount: debtAmount,
        customer_name: customerName,
        debt_amount: debtAmount,
        due_date: dueDate,
        bank: 'Banco de Córdoba',
        agent_type: 'Collections'
      }
    });

    res.status(200).json({
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
};