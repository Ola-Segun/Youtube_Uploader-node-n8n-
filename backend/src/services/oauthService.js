const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const axios = require('axios');

const oauth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.BACKEND_URL}/api/youtube/callback`
);

const scopes = [
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtube',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile'
];

const revokeToken = async (token) => {
  try {
    await axios.post(`https://oauth2.googleapis.com/revoke?token=${token}`);
    return true;
  } catch (error) {
    console.error('Error revoking token:', error.response?.data || error.message);
    return false;
  }
};

module.exports = { oauth2Client, scopes, revokeToken };