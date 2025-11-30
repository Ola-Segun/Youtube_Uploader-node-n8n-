const { google } = require('googleapis');
const stream = require('stream');

const uploadToYouTube = async (buffer, title, description, user) => {
  // Mock YouTube upload for testing
  console.log('Mock YouTube upload: buffer size', buffer.length, 'title', title);
  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return 'mock_youtube_id_' + Date.now();
};

module.exports = { uploadToYouTube };