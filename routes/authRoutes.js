const express = require('express');
const { registerUser, loginUser, verifyOtp } = require('../controllers/authController');
const router = express.Router();

// Register Route
router.post('/register', registerUser);

// OTP Verification Route
router.post('/verify-otp', verifyOtp);

router.post('/login', loginUser);
module.exports = router;
