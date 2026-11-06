/**
 * TraceAI User Repository
 * Encapsulates user retrieval, creation, profile updating, and password verification.
 */

import { memoryDb } from '../config/database.js';
import bcrypt from 'bcryptjs';

export const userRepository = {
  async findById(id) {
    return memoryDb.users.get(id) || null;
  },

  async findByEmail(email) {
    if (!email) return null;
    const normalized = email.toLowerCase().trim();
    for (const user of memoryDb.users.values()) {
      if (user.email.toLowerCase() === normalized) {
        return user;
      }
    }
    return null;
  },

  async create({ name, email, password, role = 'analyst' }) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const id = `usr-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

    const newUser = {
      id,
      name,
      email: email.toLowerCase().trim(),
      passwordHash,
      role,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    memoryDb.users.set(id, newUser);
    return newUser;
  },

  async update(id, updates) {
    const user = await this.findById(id);
    if (!user) return null;

    const updated = {
      ...user,
      ...updates,
      updatedAt: new Date()
    };
    memoryDb.users.set(id, updated);
    return updated;
  },

  async delete(id) {
    return memoryDb.users.delete(id);
  },

  async verifyPassword(user, plainPassword) {
    if (!user || !user.passwordHash) return false;
    return bcrypt.compare(plainPassword, user.passwordHash);
  }
};

// Seed default analyst user synchronously
const defaultSalt = bcrypt.genSaltSync(10);
const defaultHash = bcrypt.hashSync('TraceAIPassword2026!', defaultSalt);
memoryDb.users.set('usr-analyst-441', {
  id: 'usr-analyst-441',
  name: 'Amir Karki',
  email: 'karkiamir15@gmail.com',
  passwordHash: defaultHash,
  role: 'senior_analyst',
  createdAt: new Date(),
  updatedAt: new Date()
});

export default userRepository;
