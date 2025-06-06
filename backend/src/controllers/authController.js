const { validationResult } = require('express-validator');
const authService = require('../services/authService');
const logger = require('../utils/logger');

class AuthController {
  // Register new user
  async register(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const result = await authService.register(req.body);
      
      res.status(201).json({
        success: true,
        data: result,
        message: 'User registered successfully'
      });
    } catch (error) {
      if (error.message === 'User with this email already exists') {
        return res.status(409).json({
          error: error.message
        });
      }
      next(error);
    }
  }

  // Login user
  async login(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { email, password } = req.body;
      const result = await authService.login(email, password);
      
      res.status(200).json({
        success: true,
        data: result,
        message: 'Login successful'
      });
    } catch (error) {
      if (error.message.includes('Invalid email or password') || 
          error.message.includes('Account is deactivated')) {
        return res.status(401).json({
          error: error.message
        });
      }
      next(error);
    }
  }

  // Get current user profile
  async getProfile(req, res, next) {
    try {
      const profile = await authService.getProfile(req.user._id);
      
      res.status(200).json({
        success: true,
        data: profile
      });
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({
          error: error.message
        });
      }
      next(error);
    }
  }

  // Update user profile
  async updateProfile(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const profile = await authService.updateProfile(req.user._id, req.body);
      
      res.status(200).json({
        success: true,
        data: profile,
        message: 'Profile updated successfully'
      });
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({
          error: error.message
        });
      }
      next(error);
    }
  }

  // Change password
  async changePassword(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { oldPassword, newPassword } = req.body;
      const result = await authService.changePassword(req.user._id, oldPassword, newPassword);
      
      res.status(200).json({
        success: true,
        data: result,
        message: 'Password changed successfully'
      });
    } catch (error) {
      if (error.message === 'User not found' || 
          error.message === 'Current password is incorrect') {
        return res.status(400).json({
          error: error.message
        });
      }
      next(error);
    }
  }

  // Logout (client-side token removal, could add token blacklisting here)
  async logout(req, res) {
    try {
      logger.info('User logged out', { userId: req.user._id });
      
      res.status(200).json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      res.status(500).json({
        error: 'Logout failed'
      });
    }
  }

  // Refresh token
  async refreshToken(req, res, next) {
    try {
      const token = authService.generateToken(req.user._id);
      
      res.status(200).json({
        success: true,
        data: { token },
        message: 'Token refreshed successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
