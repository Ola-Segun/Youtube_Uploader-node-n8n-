const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
// const auth = require('../middleware/auth'); // Temporarily disabled for testing

router.post('/', /* auth, */ uploadController.uploadVideo);

module.exports = router;