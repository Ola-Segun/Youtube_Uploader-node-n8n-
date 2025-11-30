const { sendToN8n } = require('../services/uploadService');
const User = require('../models/User');
const Video = require('../models/Video');
const { getIo } = require('../services/socketService');

exports.uploadVideo = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.userId;

    // Get user email from database
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create video record
    console.log('Creating video record with data:', { userId, title, description, status: 'uploading', progress: 0 });
    const video = await Video.create({
      userId,
      title,
      description,
      status: 'uploading',
      progress: 0
    });
    console.log('Video record created successfully:', video.id);

    // Send to n8n with userEmail
    const n8nResponse = await sendToN8n(req.file, title, description, user.email);

    // Update video with upload ID from n8n response
    video.uploadId = n8nResponse.uploadId || video.id;
    await video.save();

    // Emit progress start
    const io = getIo();
    console.log('io object in uploadController:', io);
    io.emit('uploadProgress', { uploadId: video.id, progress: 0, status: 'uploading' });

    res.status(200).json({
      uploadId: video.id,
      message: 'Upload initiated successfully'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed: ' + error.message });
  }
};