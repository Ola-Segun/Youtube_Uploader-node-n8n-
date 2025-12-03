require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
  N8N_WEBHOOK_URL: process.env.REACT_APP_N8N_WEBHOOK_URL,
  N8N_SECRET: process.env.REACT_APP_N8N_SECRET,
  FRONTEND_URL: process.env.FRONTEND_URL
};