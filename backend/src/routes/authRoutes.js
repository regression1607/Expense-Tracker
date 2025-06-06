const express = require('express');
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const {
  validateRegister,
  validateLogin,
  validateProfileUpdate,
  validatePasswordChange
} = require('../validators/authValidator');

const router = express.Router();

// POST /api/auth/register - Register new user
router.post('/register', validateRegister, authController.register);

// POST /api/auth/login - Login user
router.post('/login', validateLogin, authController.login);

// Protected routes (require authentication)
// GET /api/auth/profile - Get current user profile
router.get('/profile', authenticateToken, authController.getProfile);

// PUT /api/auth/profile - Update user profile
router.put('/profile', authenticateToken, validateProfileUpdate, authController.updateProfile);

// POST /api/auth/change-password - Change password
router.post('/change-password', authenticateToken, validatePasswordChange, authController.changePassword);

// POST /api/auth/logout - Logout user
router.post('/logout', authenticateToken, authController.logout);

// POST /api/auth/refresh - Refresh token
router.post('/refresh', authenticateToken, authController.refreshToken);

module.exports = router;
