const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile } = require('../controllers/profileController');
const { protect } = require('../middlewares/authMiddleware');

// Route to get the user profile
// GET /api/users/profile
// This route is protected and requires authentication
router.get('/', protect, getUserProfile);

// Route to update the user profile
// PUT /api/users/profile
// This route is protected and requires authentication
router.put('/updateProfile', updateUserProfile);

module.exports = router;
