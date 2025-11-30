const express = require('express');
const router = express.Router();
const Video = require('../models/Video');
const User = require('../models/User');
const internalAuth = require('../middleware/internalAuth');

// GET /internal/videos/:id - Get video details
router.get('/videos/:id', internalAuth, async (req, res) => {
  try {
    const video = await Video.findByPk(req.params.id);
    if (!video) return res.status(404).json({ error: 'Video not found' });
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /internal/users/by-email/:email - Get user tokens
router.get('/users/by-email/:email', internalAuth, async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.params.email } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
      accessToken: user.accessToken,
      refreshToken: user.refreshToken
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /internal/videos/:id - Update video
router.put('/videos/:id', internalAuth, async (req, res) => {
  try {
    const { youtubeId, status } = req.body;
    const video = await Video.findByPk(req.params.id);
    if (!video) return res.status(404).json({ error: 'Video not found' });
    if (youtubeId) video.youtubeId = youtubeId;
    if (status) video.status = status;
    await video.save();
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;