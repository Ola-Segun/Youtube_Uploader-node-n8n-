const axios = require('axios');
const multer = require('multer');
const path = require('path');
const FormData = require('form-data');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /mp4|avi|mov|mkv|webm/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only video files are allowed!'));
    }
  },
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

const sendToN8n = async (file, title, description, userEmail) => {
  const n8nWebhookUrl = process.env.REACT_APP_N8N_WEBHOOK_URL || 'https://ola-paul.app.n8n.cloud/webhook-test/youtube-upload?secret=n8n-secret-yt-uploader-2025';

  console.log('Preparing to send video upload to n8n webhook:', {
    url: n8nWebhookUrl,
    fileName: file.originalname,
    fileSize: file.size,
    title,
    description,
    userEmail
  });

  // Create FormData for n8n
  const n8nFormData = new FormData();
  n8nFormData.append('file', file.buffer, file.originalname);
  n8nFormData.append('title', title);
  n8nFormData.append('description', description);
  n8nFormData.append('userEmail', userEmail);
  n8nFormData.append('secret', process.env.REACT_APP_N8N_SECRET || 'n8n-secret-yt-uploader-2025');

  try {
    console.log('Sending POST request to n8n webhook...');
    const response = await axios.post(n8nWebhookUrl, n8nFormData, {
      headers: {
        ...n8nFormData.getHeaders()
      }
    });
    console.log('Successfully sent to n8n webhook. Response status:', response.status, 'Response data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending to n8n:', error.message, 'Status:', error.response?.status, 'Data:', error.response?.data);
    throw error;
  }
};

module.exports = { upload, sendToN8n };