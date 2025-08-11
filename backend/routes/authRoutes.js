const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Routes
router.post('/request-otp', authController.requestOTP);
router.post('/verify-otp', authController.verifyOTP);
router.post('/register', authController.createUser);
router.post('/login', authController.loginUser);

module.exports = router;
