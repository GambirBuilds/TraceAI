/**
 * TraceAI Authentication Controller
 */

import jwt from 'jsonwebtoken';
import config from '../config/environment.js';
import { userRepository } from '../repositories/userRepository.js';
import { successResponse } from '../utils/responseFormatter.js';
import { ValidationError, AuthenticationError } from '../utils/errors.js';

function generateTokens(user) {
  const payload = { id: user.id, email: user.email, role: user.role };
  const accessToken = jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiresIn
  });
  const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn
  });
  return { accessToken, refreshToken };
}

export const authController = {
  async register(req, res, next) {
    try {
      const { name, email, password, role } = req.body;
      const existing = await userRepository.findByEmail(email);
      if (existing) {
        throw new ValidationError('A user with this email address already exists.');
      }

      const user = await userRepository.create({ name, email, password, role });
      const { accessToken, refreshToken } = generateTokens(user);

      // Set HttpOnly refresh cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: config.env === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      return successResponse(res, {
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        accessToken
      }, 201);
    } catch (err) {
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await userRepository.findByEmail(email);
      if (!user) {
        throw new AuthenticationError('Invalid email or password.');
      }

      const isValid = await userRepository.verifyPassword(user, password);
      if (!isValid) {
        throw new AuthenticationError('Invalid email or password.');
      }

      const { accessToken, refreshToken } = generateTokens(user);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: config.env === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      return successResponse(res, {
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        accessToken
      });
    } catch (err) {
      next(err);
    }
  },

  async logout(req, res) {
    res.clearCookie('refreshToken');
    return successResponse(res, { message: 'Logged out successfully.' });
  },

  async me(req, res, next) {
    try {
      const user = req.user;
      return successResponse(res, { user });
    } catch (err) {
      next(err);
    }
  },

  async updateProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const updated = await userRepository.update(userId, req.body);
      return successResponse(res, {
        user: {
          id: updated.id,
          name: updated.name,
          email: updated.email,
          role: updated.role,
          organization: updated.organization
        }
      });
    } catch (err) {
      next(err);
    }
  },

  async deleteAccount(req, res, next) {
    try {
      const userId = req.user.id;
      await userRepository.delete(userId);
      res.clearCookie('refreshToken');
      return successResponse(res, { message: 'Account deleted successfully.' });
    } catch (err) {
      next(err);
    }
  }
};

export default authController;
