const express = require('express');
const router = express.Router();
const Video = require('../models/Video');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  const videos = await Video.findAll();
  res.json(videos);
});

router.get('/progress/:uploadId', async (req, res) => {
  const video = await Video.findByPk(req.params.uploadId);
  res.json({ progress: video.progress, status: video.status });
});

module.exports = router;