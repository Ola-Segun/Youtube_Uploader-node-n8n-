const { upload } = require('../services/uploadService');
const { uploadToYouTube } = require('../services/youtubeService');
const { triggerN8nWorkflow } = require('../services/n8nService');
const Video = require('../models/Video');
const User = require('../models/User');
const { io } = require('../../server');

exports.uploadVideo = [
  upload.single('video'),
  async (req, res) => {
    try {
      const { title, description } = req.body;
      const userId = req.user?.userId || 1; // Temporary for testing without auth
      console.log('UploadController: Upload started', { title, description, file: req.file?.originalname, userId });

      // Save to DB first to get ID
      const video = await Video.create({
        userId,
        title,
        description,
        fileUrl: '', // Direct upload to YouTube, no storage
        status: 'uploading'
      });
      console.log('UploadController: Video record created', video.id);

      // Get user for YouTube upload
      const user = { email: 'test@example.com', accessToken: 'dummy', refreshToken: 'dummy' }; // Mock user for testing
      console.log('UploadController: Using mock user', user.email);

      // Emit progress before YouTube upload
      // io.emit('uploadProgress', { uploadId: video.id, progress: 50 });
      console.log('Progress: 50%');

      // Upload directly to YouTube
      console.log('UploadController: Starting YouTube upload');
      const youtubeId = await uploadToYouTube(req.file.buffer, title, description, user);
      console.log('UploadController: YouTube upload completed', youtubeId);
      video.youtubeId = youtubeId;
      video.status = 'completed';
      video.progress = 100;
      await video.save();
      // io.emit('uploadProgress', { uploadId: video.id, progress: 100 });
      console.log('Progress: 100%');

      // Trigger n8n webhook
      await triggerN8nWorkflow(video.id, user.email, 'completed');

      res.status(201).json({ uploadId: video.id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }
];