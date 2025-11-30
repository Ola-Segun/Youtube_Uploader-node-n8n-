const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

router.get('/login', authController.login);
router.get('/callback', authController.callback, authController.callbackSuccess);
router.get('/logout', auth, authController.logout);

module.exports = router;