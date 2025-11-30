const express = require('express');
const router = express.Router();
const { upload } = require('../services/uploadService');
const uploadController = require('../controllers/uploadController');
const auth = require('../middleware/auth');

// POST /upload - Upload video
router.post('/', auth, upload.single('file'), uploadController.uploadVideo);

module.exports = router;