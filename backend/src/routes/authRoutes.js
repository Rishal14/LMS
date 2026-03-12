const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, logoutUser, verifyEmail } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-email', verifyEmail);
router.get('/me', protect, getMe);
router.post('/logout', protect, logoutUser);

module.exports = router;
