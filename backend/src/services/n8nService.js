const axios = require('axios');

const triggerN8nWorkflow = async (videoId, userEmail, status) => {
  try {
    await axios.post(process.env.N8N_WEBHOOK_URL, {
      videoId,
      userEmail,
      status
    });
  } catch (error) {
    console.error('n8n webhook failed:', error);
  }
};

module.exports = { triggerN8nWorkflow };